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

class AdminActionController extends Controller
{
    // Helper to verify Admin status
    private function ensureAdmin() {
        if (!Auth::user() instanceof \App\Models\Auth\Admin) {
            abort(403, 'Unauthorized. Admin access only.');
        }
    }

    public function deleteIdea(Request $request, $id)
    {
    
     return DB::transaction(function () use ($id, $request) {
        $this->ensureAdmin();
        
        $userId = $request->user_id;
        $userType = $request->user_type == 'student' ? Student::class : Teacher::class;
        $reason = $request->reason;

        $idea = Ideas::findOrFail($id);

        // 1. Get all user IDs who reported this specific idea
        $reporters = Report::where('idea_id', $id)
                            ->where('reason','!=', 'Fake Profile')
                            ->where('status', 'pending')
                            ->get(['reporter_id', 'reporter_type']);

        // 2. Log admin action
        AdminLog::create([
            'admin_id' => Auth::id(),
            'target_id' => $idea->id,
            'target_type' => Ideas::class,
            'action_taken' => 'permanent_delete',
            'notes' => $request->reason? $request->reason : 'Violation of guidelines',
            'resolved_at' => now(),
        ]);


        // 3. Notify all reporters
        foreach ($reporters as $reporter) {
            Notification::create([
                'notifiable_user_id' => $reporter->reporter_id,
                'notifiable_user_type' => $reporter->reporter_type,
                'title' => $idea->title,
                'message' => "The idea you reported has been removed for violating community guidelines.",
            ]);
        }

        //4. Notify the user whose idea is been deleted
        Notification::create([
              'notifiable_user_id' => $userId,
              'notifiable_user_type' => $userType,
              'title' => $idea->title,
              'message' => $request-> $reason ? $reason : 'Your Idea is been DELETED for the voilation of Rules'
        ]);

        $idOfDeletedIdea = $idea->id;
        $idea->forceDelete();
        broadcast(new IdeaDeleted($idOfDeletedIdea))->toOthers();

        return response()->json(['message' => 'Idea permanently deleted.']);
     });
    }

   
    public function warnUser(Request $request)
    {
        return DB::transaction(function () use ($request) {
           $this->ensureAdmin();
  
            $request->validate([
                'user_id' => 'required',
                'user_type' => 'required|in:student,teacher',
                'reason' => 'required|string'
            ]);
  
            $userId = $request->user_id;
            $userType = $request->user_type == 'student' ? Student::class : Teacher::class;
            $reason = $request->reason;
  
            // 1. Find all ideas owned by this user that have PENDING reports
            // We pluck the IDs to find the people who reported them
            $reportedIdeas = DB::table('ideas')
                ->where('author_id', $userId)
                ->where('author_type', $userType)
                ->join('reports', 'ideas.id', '=', 'reports.idea_id')
                ->where('reports.status', 'pending')
                ->select('reports.reporter_id', 'reports.reporter_type', 'reports.reason', 'ideas.title', 'reports.id as report_id')
                ->get();
  
            // 2. Notify each reporter
            foreach ($reportedIdeas as $report) {
                Notification::create([
                    'notifiable_user_id' => $report->reporter_id,
                    'notifiable_user_type' => $report->reporter_type,
                    'title' =>  $report->title,
                    'message' => "The author of the idea you reported as \"" . $report->reason . "\" has been officially WARNED",
                ]);
  
                // 3. Mark the report as resolved
                Report::where('id', $report->report_id)->update([
                    'status' => 'resolved',
                ]);
            }

            // Notify warned user
             Notification::create([
              'notifiable_user_id' => $userId,
              'notifiable_user_type' => $userType,
              'title' => 'Warning',
              'message' => $request-> $reason ? $reason : 'It come across that you are voilating our Rules and Regulations we advised to follow them in your content otherwise 
                                                           it will lead to account SUSPENSION or PERMANENT DELETION of your account'
            ]);


            // 5. Increment the warning count for the user
             $user = $userType::findOrFail($request->user_id);
             $user->increment('warning_count');
  
            // 6. Log the Admin Action
            AdminLog::create([
                'admin_id' => Auth::id(),
                'target_id' => $userId,
                'target_type' => $userType,
                'action_taken' => 'warn_user',
                'notes' => $reason,
                'resolved_at' => now(),
          ]);
  
          return response()->json([
            'message' => 'User warned and reporters notified.',
             'new_count' => $user->warning_count
             ]);
    });
       
    }

    public function toggleSuspension(Request $request)
    {
           return DB::transaction(function () use ($request) {
           $this->ensureAdmin();
  
            $request->validate([
                'user_id' => 'required',
                'user_type' => 'required|in:student,teacher',
                'reason' => 'required|string'
            ]);
  
            $userId = $request->user_id;
            $userType = $request->user_type == 'student' ? Student::class : Teacher::class;
            $reason = $request->reason;


            // Toggle logic
            $user = $userType::findOrFail($userId);
            $user->is_suspended = $user->is_suspended ? false : true;
            
            if ($user->is_suspended) {
                $user->suspension_reason = $reason ?? 'Your account has been suspended due to violation of our terms. Please contact support for more information.';
                $user->suspended_at = now();

                // 1. Find all ideas owned by this user that have PENDING reports
                // We pluck the IDs to find the people who reported them
                $reportedIdeas = DB::table('ideas')
                    ->where('author_id', $userId)
                    ->where('author_type', $userType)
                    ->join('reports', 'ideas.id', '=', 'reports.idea_id')
                    ->where('reports.status', 'pending')
                    ->select('reports.reporter_id', 'reports.reporter_type', 'reports.reason', 'ideas.title', 'reports.id as report_id')
                    ->get();
      
                // 2. Notify each reporter
                foreach ($reportedIdeas as $report) {
                    Notification::create([
                        'notifiable_user_id' => $report->reporter_id,
                        'notifiable_user_type' => $report->reporter_type,
                        'title' =>  $report->title,
                        'message' => "The author of the idea you reported as \"" . $report->reason . "\" has been officially SUSPENDED",
                    ]);
      
                    // 3. Mark the report as resolved
                    Report::where('id', $report->report_id)->update([
                        'status' => 'resolved',
                    ]);
                }

                    // 4. Reset warning count on suspension
                    $user->warning_count = 0 ;
            } else {
                $user->suspension_reason = null;
                $user->suspended_at = null;
            }

            $user->save();

            //5. Notify warned user
             Notification::create([
              'notifiable_user_id' => $userId,
              'notifiable_user_type' => $userType,
              'title' => 'Account ' . ($user->is_suspended ? 'Suspended' : 'Reactivated'),
              'message' => $request-> $reason ? $reason : ($user->is_suspended ? 'Your account has been suspended due to violation of our terms. Please contact support for more information.' 
                                                                               : 'Your account has been reactivated. Please adhere to our community guidelines to avoid future suspensions.')
            ]);

      
            
            $user->save();
  
             AdminLog::create([
            'admin_id' => Auth::id(),
            'target_id' => $user->id,
            'target_type' => $userType,
            'action_taken' => $user->is_suspended ? 'suspend_user' : 'unsuspend_user',
            'notes' => $request->reason,
            'resolved_at' => now(),
        ]);

        return response()->json([
            'message' => $user->is_suspended ? 'User suspended.' : 'User activated.',
            'is_suspended' => $user->is_suspended
        ]);
    });
  
    }
}