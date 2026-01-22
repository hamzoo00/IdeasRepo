<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class StudentController extends Controller
{
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
    public function register(Request $request)
    {
         $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'university_name' => 'required|string',
            'student_id' => 'required|string|unique:students',
            'batch'      => 'required|string',
            'program'    => 'required|string',
            'degree'     => 'required|string',
            'semester'   => 'required|string',
            'email' => 'required|email|unique:students',
            'whatsapp'   => 'nullable|string',
            'interest'   => 'nullable|string',
            'password' => 'required|min:8|confirmed'
           
        ]);

          $validated['password'] = bcrypt($validated['password']);



           $student = Student::create($validated);

        return response()->json([
            'message' => 'Student registered successfully',
            'student' => $student,
        ], 201);
    }

    //LOGIN

    public function login(Request $request)
    {
         $request->validate([
             'identifier' => 'required|string',
             'password' => 'required|string',
         ]);
    
         $identifier = $request->identifier;
         $password = $request->password;
    
        
         $field = filter_var($identifier, FILTER_VALIDATE_EMAIL)
             ? 'email'
             : 'student_id';
    
         $student = Student::where($field, $identifier)->first();
    
         if (!$student || !Hash::check($password, $student->password)) {
             return response()->json([
                 'message' => 'Invalid credentials'
             ], 401);
         }

         $token = $student->createToken('student-token')->plainTextToken; // Bearer type
    
         return response()->json([
             'message' => 'Login successful',
             'student' => [
                 'id' => $student->id,
                 'full_name' => $student->full_name,
                 'email' => $student->email,
                 'student_id' => $student->student_id
             ],
             'auth_token' => $token,
         ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
    }
}
