<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Auth\Teacher;
use App\Models\Profile\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TeacherProfileController extends Controller
{
    public function showTeacherProfile($id)
    {
       $teacher = Teacher::with('profile')->findOrFail($id);

        $viewer = auth('teacher')->user();
        $isOwner = $viewer && $viewer->id === $teacher->id;

      $data = [
        // Data from 'teachers' table
        'id'        => $teacher->id,
        'full_name' => $teacher->full_name, 
        'email'     => $teacher->email,

        // Data from 'teacher_profiles' table (accessed via the relationship)
        'whatsapp'     => $teacher->profile ? $teacher->profile->whatsapp : null,
        'bio'          => $teacher->profile ? $teacher->profile->bio : null,
        'profession'   => $teacher->profile ? $teacher->profile->profession : null,
        'expertise'    => $teacher->profile ? $teacher->profile->expertise : null,
        'office'       => $teacher->profile ? $teacher->profile->office : null,
        'office_hours' => $teacher->profile ? $teacher->profile->office_hours : null,
        'image'        => $teacher->profile ? $teacher->profile->image : null,
    ];

        return response()->json([
            'profile' => $data,
            'is_owner' => $isOwner,
        ]);
}

    public function updateTeacherProfile(Request $request)
    {
        /** @var \App\Models\Auth\Teacher $teacher */
        $teacher = auth('teacher')->user();
    
        if (!$teacher) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
       
        $validated = $request->validate([
            'full_name'    => 'required|string|max:255',
            
            'email'        => ['required', 'email', Rule::unique('teachers')->ignore($teacher->id)],
            'whatsapp'     => 'nullable|string|max:13',
            'profession'   => 'nullable|string|max:100',
            'office'       => 'nullable|string|max:100',
            'office_hours' => 'nullable|string|max:100',
            'expertise'    => 'nullable|string|max:1000',
            'bio'          => 'nullable|string|max:5000',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // Max 5MB
        ]);
    
        // Updates Main Teacher Table
        $teacher->update([
            'full_name' => $validated['full_name'],
            'email'     => $validated['email'],
        ]);
    
        
        $profileData = [
            'whatsapp'     => $validated['whatsapp'] ?? null,
            'profession'   => $validated['profession'] ?? null,
            'office'       => $validated['office'] ?? null,
            'office_hours' => $validated['office_hours'] ?? null,
            'expertise'    => $validated['expertise'] ?? null,
            'bio'          => $validated['bio'] ?? null,
        ];
    
        // Handle Image Upload
        if ($request->hasFile('image')) {

            $currentProfile = $teacher->profile;
    
            if ($currentProfile && $currentProfile->image) {
                if (Storage::disk('public')->exists($currentProfile->image)) {
                    Storage::disk('public')->delete($currentProfile->image);
                }
            }
    
            $path = $request->file('image')->store('teacher_images', 'public');
            $profileData['image'] = $path;
        }
    
        // Update or Create the Profile Record
        // This looks for a profile with 'teacher_id' matching this user.
        // If found, it updates it. If not, it creates a new row.
        $teacher->profile()->updateOrCreate(
            ['teacher_id' => $teacher->id],
            $profileData
        );
    
        return response()->json([
            'message' => 'Profile updated successfully',
            // Return fresh data to update frontend immediately
            'teacher' => $teacher->refresh()->load('profile'),
            
        ]);
    }
}
