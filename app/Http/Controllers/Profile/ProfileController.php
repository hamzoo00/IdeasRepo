<?php

namespace App\Http\Controllers\Profile;

use Illuminate\Http\Request;
use App\Models\Auth\Student;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    
        public function showStudentProfile($id)
    {
        $profile = Student::where('id', $id)->firstOrFail();

        $viewer = auth('student')->user();
        $isOwner = $viewer && $viewer->id === $profile->id;


            $data = [
                'id' => $profile->id,
                'student_id' => $profile->id,
                'university_name' => $profile->university_name,
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

        return response()->json([
            'profile' => $data,
            'is_owner' => $isOwner,
        ]);
    }

   public function updateStudentProfile(Request $request)
    {
       /** @var \App\Models\Auth\Student $student */
        $student = auth('sanctum')->user();

       
        $request->validate([
            'full_name' => 'required|string|max:255',
            
            // Validate email: must be unique in students table, but ignore the current student's ID
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('students', 'email')->ignore($student->id),
            ],
            
            'whatsapp' => 'nullable|string|max:20',
            'interest' => 'nullable|string|max:1000',
            'bio' => 'nullable|string|max:5000',
            
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // Max 5MB
        ], [
           
            'email.unique' => 'This email address is already registered by another student.',
            'image.max' => 'The image size must not exceed 2MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg.',
        ]);

       
       $dataToUpdate = [
            'full_name' => $request->full_name,
            'email'     => $request->email,
            'whatsapp'  => $request->whatsapp,
            'interest'  => strtoupper($request->interest),
            'bio'       => $request->bio,
       ];

        // Handle Image Upload
        if ($request->hasFile('image')) {
       
        if ($student->image && Storage::disk('public')->exists($student->image)) {
            Storage::disk('public')->delete($student->image);
        }
       
        $dataToUpdate['image'] = $request->file('image')->store('profile_images', 'public');
    }

        $student->update($dataToUpdate);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $student->refresh(),
            'image_url' => $student->image ? asset('storage/' . $student->image) : null
        ], 200);
    }


}
