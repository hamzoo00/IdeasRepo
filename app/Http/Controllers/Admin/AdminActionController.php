<?php

namespace App\Http\Controllers\Admin;

use App\Events\IdeaDeleted;
use App\Http\Controllers\Controller;
use App\Models\Ideas\Ideas;
use App\Models\Admin\AdminLog;
use App\Models\Auth\Student;
use App\Models\Auth\Teacher;
use App\Models\Profile\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Report\Report;
use App\Models\Notification\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminActionController extends Controller
{

  // Resuable Functions

    private function ensureAdmin() {
         if (!Auth::user() instanceof \App\Models\Auth\Admin) {
             abort(403, 'Unauthorized. Admin access only.');
         }
    }

    private function resolveReportsByIdea($targetId, $title, $actionName) {
        
        $reports = Report::where('idea_id', $targetId)
                        ->where('status', 'pending')
                        ->get();

        foreach ($reports as $report) {
            $this->notifyUser(
                $report->reporter_id,
                $report->reporter_type,
                "Report Update: " . $title,
                "The content you reported as \"{$report->reason}\" has been processed. Action taken: {$actionName}.",
            );
        }

        if ($reports->isNotEmpty()) {
            Report::whereIn('id', $reports->pluck('id'))->update([
                'status' => 'resolved',
                'resolved_at' => now()
            ]);
        }
    }

    private function resolveReportsByAccount($userId, $userType, $actionName) {
        // Find all ideas owned by this user that have PENDING reports
        $reportedItems = DB::table('ideas')
            ->where('author_id', $userId)
            ->where('author_type', $userType)
            ->join('reports', 'ideas.id', '=', 'reports.idea_id')
            ->where('reports.status', 'pending')
            ->select('reports.reporter_id', 'reports.reporter_type', 'reports.reason', 'ideas.title', 'ideas.id as idea_id', 'reports.id as report_id')
            ->get();

        foreach ($reportedItems as $report) {
            $this->notifyUser(
                $report->reporter_id,
                $report->reporter_type,
                $report->title,
                "The author of the idea you reported for '{$report->reason}' has been officially $actionName."
            );

            Report::where('id', $report->report_id)->update(
                ['status' => 'resolved',
                'resolved_at' => now()]);
            DB::table('ideas')->where('id', $report->idea_id)->decrement('report_count');
        }
    }

    private function logAction($targetId, $targetType, $action, $notes) {
        AdminLog::create([
            'admin_id' => Auth::id(),
            'target_id' => $targetId,
            'target_type' => $targetType,
            'action_taken' => $action,
            'notes' => $notes,
            'resolved_at' => now(),
        ]);
    }

    private function notifyUser($userId, $userType, $title, $message) {
        Notification::create([
            'notifiable_user_id' => $userId,
            'notifiable_user_type' => $userType,
            'title' => $title,
            'message' => $message
        ]);
    }

    // ADMIN ACTIONS

    public function deleteIdea(Request $request, $id) {
        return DB::transaction(function () use ($id, $request) {
            $this->ensureAdmin();
            $idea = Ideas::findOrFail($id);
            $reason = $request->reason ?: 'Your idea "'.$idea->title.'" was removed for violating community guidelines.';

            $this->resolveReportsByIdea($id, $idea->title, "Idea Removed");
            $this->logAction($id, Ideas::class, 'permanent_delete', $reason);
            $this->notifyUser($idea->author_id, $idea->author_type, "Post Deleted", $reason);
       
            $idToBroadcast = $idea->id;
            $idea->forceDelete();

            broadcast(new IdeaDeleted($idToBroadcast))->toOthers();
        
            return response()->json(['message' => 'Idea permanently deleted.']);
        });
    }

    public function warnUser(Request $request) {
        return DB::transaction(function () use ($request) {
            $this->ensureAdmin();
            $userType = $request->user_type == 'student' ? Student::class : Teacher::class;
            $user = $userType::findOrFail($request->user_id);
            $reason = $request->reason ?: 'Violation of Rules and Regulations. Repeated Violations would lead to Account Suspension.';

            $this->resolveReportsByAccount($user->id, $userType, "Warned");
            $userType == Student::class ? $user->increment('warning_count') : TeacherProfile::where('teacher_id', $user->id)->increment('warning_count');
            $this->logAction($user->id, $userType, 'warn_user', $reason);
            $this->notifyUser($user->id, $userType, 'Warning Issued', $reason);

            return response()->json(['message' => 'User warned.', 'new_count' => $user->warning_count]);
        });
    }

    public function toggleSuspension(Request $request) {
        return DB::transaction(function () use ($request) {
            $this->ensureAdmin();

            $userType = $request->user_type == 'student' ? Student::class : Teacher::class;
            $user = $userType == Student::class ? $userType::findOrFail($request->user_id) : TeacherProfile::where('id', $request->user_id)->firstOrFail();
            $reason = $request->reason ? $request->reason : ($user->is_suspended ? 'Your account has been reactivated.' : 'Your account has been suspended for violations.');

            $user->is_suspended = !$user->is_suspended;
            
            if ($user->is_suspended) {
                $user->suspension_reason = $reason;
                $user->suspended_at = now();
                $user->warning_count = 0;
                $this->resolveReportsByAccount($user->id, $userType, "Suspended");
            } else {
                $user->suspension_reason = null;
                $user->suspended_at = null;
            }

            $user->save();

            $actionTaken = $user->is_suspended ? 'suspend_user' : 'unsuspend_user';
            $notificationTitle = $user->is_suspended ? 'Account Suspended' : 'Account Reactivated';
            
            $this->logAction($user->id, $userType, $actionTaken, $reason);
            $this->notifyUser($user->id, $userType, $notificationTitle, $reason);

            return response()->json(['message' => 'Status updated.', 'is_suspended' => $user->is_suspended]);
        });
    }

    public function dismissReport(Request $request, $id) {
        return DB::transaction(function () use ($id, $request) {
            $this->ensureAdmin();
            $idea = Ideas::findOrFail($id);
            $reason = $request->reason ?: 'No violation found after manual review.';


            Report::where('idea_id', $id)->where('status', 'pending')->update([
                'status' => 'resolved', 
                'resolved_at' => now()
            ]);

            $idea->update(['report_count' => 0]); 

            $this->logAction($id, Ideas::class, 'dismiss_reports', $reason);
            
            return response()->json(['message' => 'Reports dismissed. Content marked as safe.']);
        });
    }

    public function deleteUserAccount(Request $request , $userId, $user_type) {
        return DB::transaction(function () use ($request, $userId, $user_type) {
            $this->ensureAdmin();
            $userType = $user_type == 'student' ? Student::class : Teacher::class;
            $user = $userType::findOrFail($userId);
            $reason = $request->reason ?: 'Account permanently terminated for severe violations.';

            // 1. Blacklist the email
            DB::table('blacklisted_emails')->insert([
                'email' => $user->email,
                'created_at' => now(),
                'updated_at' => now()
            ]);
           
            $this->resolveReportsByAccount($user->id, $userType, "Account Terminated");
            $this->logAction($user->id, $userType, 'delete_user_account', $reason);
           
            //2. Delete user image
            if ($user->image) {
             Storage::disk('public')->delete($user->image);
        }
            
            //2. permanantly delete all their ideas
            $ideaIds = $user->ideas()->pluck('id')->toArray();
            $user->ideas()->forceDelete();

            foreach ($ideaIds as $ideaId) {
                broadcast(new IdeaDeleted($ideaId))->toOthers();
            }
          
            $user->forceDelete();

            return response()->json(['message' => 'User account deleted and email blacklisted.']);
        });
    }
    
}