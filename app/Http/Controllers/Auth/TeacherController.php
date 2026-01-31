<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{



     public function login(Request $request)
    {
         $request->validate([
             'identifier' => 'required|string',
             'password' => 'required|string',
         ]);
    
         $identifier = $request->identifier;
         $password = $request->password;
    
        
    
         $teacher = Teacher::where('email',$identifier)->first();
    
         if (!$teacher || !Hash::check($password, $teacher->password)) {
             return response()->json([
                 'message' => 'Invalid credentials'
             ], 401);
         }

          $token = $teacher->createToken('teacher-token')->plainTextToken;

         return response()->json([
             'message' => 'Login successful',
             'teacher' => [
                 'id' => $teacher->id,
                 'email' => $teacher->email,
                 'full_name' => $teacher->full_name,
                 'employee_id' => $teacher->employee_id
             ],
             'auth_token' => $token
         ], 200);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }



    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Teacher $teacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        //
    }
}
