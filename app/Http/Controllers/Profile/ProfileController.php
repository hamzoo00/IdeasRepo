<?php

namespace App\Http\Controllers\Profile;

use Illuminate\Http\Request;
use App\Models\Auth\Admin;
use App\Models\Auth\Student;
use App\Models\Auth\Teacher;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    
        public function show($id)
    {
        $profile = Student::where('id', $id)->firstOrFail();

        $viewer = auth('student')->user();
        $isOwner = $viewer && $viewer->id === $profile->id;

   
        // Build response depending on ownership
        // if ($isOwner) {
        //     // return full profile
            $data = [
                'id' => $profile->id,
                'full_name' => $profile->full_name,
                'batch' => $profile->batch,
                'degree' => $profile->degree,
                'semester' => $profile->semester,
                'email' => $profile->email,
                'whatsapp' => $profile->whatsapp,
                'bio' => $profile->bio,
                'interest' => $profile->interest,
                'image' => $profile->image,
            ];
        // } else {
        //     // return only public subset
        //     $data = [
        //         'id' => $profile->id,
        //         'full_name' => $profile->full_name,
        //         'batch' => $profile->batch,
        //         'degree' => $profile->degree,
        //         'semester' => $profile->semester,
        //         'email' => $profile->email,
        //         'whatsapp' => $profile->whatsapp,
        //         'bio' => $profile->bio,
        //         'interest' => $profile->interest,
        //         'image' => $profile->image,
        //     ];
        // }

        return response()->json([
            'profile' => $data,
            'is_owner' => $isOwner,
        ]);
    }

    public function update(Request $request)
    {
        // Auth required by route middleware
        $user = $request->user(); // same as auth()->user()

        // Validate allowed fields
        $validated = $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
            'full_name' => 'sometimes|string|max:255',
            'bio'       => 'sometimes|string|max:1000',
            'interest'  => 'sometimes|nullable|string',
            'whatsapp'  => 'sometimes|nullable|string',
            
        ]);

        // 2. Handle Image Upload
       if ($request->hasFile('image')) {
        
        // A. Delete old image if it exists (Optional, keeps folder clean)
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        // B. Store the new file
        // This saves to: storage/app/public/profile_images/filename.jpg
        // It returns the path: "profile_images/filename.jpg"
        $path = $request->file('image')->store('profile_images', 'public');

        // C. Update the user model with the path
        $user->image = $path;
    }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated',
            'profile' => $user,
            'image_url' => asset('storage/' . $user->image),
        ]
        );
    }

}
