<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Auth\Admin;
use App\Models\Profile\AdminProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminProfileController extends Controller
{
     public function showAdminProfile($id)
    {
       $admin = Admin::with('profile')->findOrFail($id);

        $viewer = auth('admin')->user();
        $isOwner = $viewer && $viewer->id === $admin->id;

      $data = [
        // Data from 'admins' table
        'full_name' => $admin->full_name,
        'email'     => $admin->email,

        // Data from 'admin_profiles' table (accessed via the relationship)
        'whatsapp'     => $admin->profile ? $admin->profile->whatsapp : null,
        'bio'          => $admin->profile ? $admin->profile->bio : null,
        'profession'   => $admin->profile ? $admin->profile->profession : null,
        'office'       => $admin->profile ? $admin->profile->office : null,
        'office_hours' => $admin->profile ? $admin->profile->office_hours : null,
        'image'        => $admin->profile ? $admin->profile->image : null,
    ];

        return response()->json([
            'profile' => $data,
            'is_owner' => $isOwner,
        ]);
}

    public function updateAdminProfile(Request $request)
    {
        /** @var \App\Models\Auth\Admin $admin */
        $admin = auth('admin')->user();
    
        if (!$admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
       
        $validated = $request->validate([
            'full_name'    => 'required|string|max:255',
            
            'email'        => ['required', 'email', Rule::unique('admins')->ignore($admin->id)],
            'whatsapp'     => 'nullable|string|max:20',
            'profession'   => 'nullable|string|max:100',
            'office'       => 'nullable|string|max:100',
            'office_hours' => 'nullable|string|max:100',
            'bio'          => 'nullable|string|max:5000',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // Max 5MB
        ]);
    
        // Updates Main Admin Table 
        $admin->update([
            'full_name' => $validated['full_name'],
            'email'     => $validated['email'],
        ]);
    
        $profileData = [
            'whatsapp'     => $validated['whatsapp'] ?? null,
            'profession'   => $validated['profession'] ?? null,
            'office'       => $validated['office'] ?? null,
            'office_hours' => $validated['office_hours'] ?? null,
            'bio'          => $validated['bio'] ?? null,
        ];
    
        // Handle Image Upload
        if ($request->hasFile('image')) {

            $currentProfile = $admin->profile;
    
            if ($currentProfile && $currentProfile->image) {
                if (Storage::disk('public')->exists($currentProfile->image)) {
                    Storage::disk('public')->delete($currentProfile->image);
                }
            }
    
            $path = $request->file('image')->store('teacher_images', 'public');
            $profileData['image'] = $path;
        }
    
        $admin->profile()->updateOrCreate(
            ['admin_id' => $admin->id],
            $profileData
        );
    
        return response()->json([
            'message' => 'Profile updated successfully',
            // Return fresh data to update frontend immediately
            'admin' => $admin->fresh(['profile']), 
        ]);
    }
}
