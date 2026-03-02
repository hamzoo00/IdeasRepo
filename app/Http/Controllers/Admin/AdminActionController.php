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
        $this->ensureAdmin();
        
        $idea = Ideas::findOrFail($id);
        
        AdminLog::create([
            'admin_id' => Auth::id(),
            'target_id' => $idea->id,
            'target_type' => Ideas::class,
            'action_taken' => 'permanent_delete',
            'notes' => $request->input('reason', 'Direct deletion by admin'),
            'resolved_at' => now(),
        ]);

        $idOfDeletedIdea = $idea->id;
        $idea->forceDelete();
        broadcast(new IdeaDeleted($idOfDeletedIdea))->toOthers();

        return response()->json(['message' => 'Idea permanently deleted.']);
    }

   
    public function warnUser(Request $request)
    {
        $this->ensureAdmin();

        $request->validate([
            'user_id' => 'required',
            'user_type' => 'required|in:student,teacher',
            'reason' => 'required|string'
        ]);

        
        $model = $request->user_type === 'student' ? Student::class : TeacherProfile::class;
        $user = $model::findOrFail($request->user_id);

        $user->increment('warning_count');

        AdminLog::create([
            'admin_id' => Auth::id(),
            'target_id' => $user->id,
            'target_type' => $model,
            'action_taken' => 'warn_user',
            'notes' => $request->reason,
            'resolved_at' => now(),
        ]);

        return response()->json(['message' => 'User warned successfully.', 'new_count' => $user->warning_count]);
    }

    // SUSPEND / UNSUSPEND
    public function toggleSuspension(Request $request)
    {
        $this->ensureAdmin();

        $request->validate([
            'user_id' => 'required',
            'user_type' => 'required|in:student,teacher',
            'reason' => 'nullable|string'
        ]);

        $model = $request->user_type === 'student' ? Student::class : TeacherProfile::class;
        $user = $model::findOrFail($request->user_id);

        // Toggle logic
        $user->is_suspended = !$user->is_suspended;
        
        if ($user->is_suspended) {
            $user->suspension_reason = $request->reason ?? 'Violation of terms';
            $user->suspended_at = now();
        } else {
            $user->suspension_reason = null;
            $user->suspended_at = null;
        }
        
        $user->save();

        AdminLog::create([
            'admin_id' => Auth::id(),
            'target_id' => $user->id,
            'target_type' => $model,
            'action_taken' => $user->is_suspended ? 'suspend_user' : 'unsuspend_user',
            'notes' => $request->reason,
            'resolved_at' => now(),
        ]);

        return response()->json([
            'message' => $user->is_suspended ? 'User suspended.' : 'User activated.',
            'is_suspended' => $user->is_suspended
        ]);
    }
}