<?php

namespace App\Http\Controllers\Report;

use App\Models\Ideas\Ideas;
use App\Models\Report\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Auth\Teacher;
use App\Models\Auth\Student;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'idea_id' => 'required|exists:ideas,id',
            'reason' => 'required|string|max:255',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        
       if (!($user instanceof \App\Models\Auth\Student) && !($user instanceof \App\Models\Auth\Teacher)) {
        return response()->json(['message' => 'Only students or teachers can report ideas.'], 403);
    }

        // Check if user already reported this idea
        $existing = Report::where('idea_id', $request->idea_id)
            ->where('reporter_id', $user->id)
            ->where('reporter_type', get_class($user))
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'You have already reported this idea.'], 422);
        }

        Report::create([
            'idea_id' => $request->idea_id,
            'reporter_id' => $user->id,
            'reporter_type' => get_class($user),
            'reason' => $request->reason,
            'comment' => $request->comment,
            'status' => 'pending'
        ]);
        
        // Increment the idea's report count
        $idea = Ideas::find($request->idea_id);
        $idea->increment('report_count');

        return response()->json(['message' => 'Report submitted successfully. Admins will review it shortly.']);
    }
}