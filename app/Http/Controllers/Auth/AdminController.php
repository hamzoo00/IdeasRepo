<?php

namespace App\Http\Controllers\Auth;

use App\Models\Auth\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
     public function login(Request $request)
    {
         $request->validate([
             'identifier' => 'required|string',
             'password' => 'required|string',
         ]);
    
         $identifier = $request->identifier;
         $password = $request->password;
    
        
    
         $admin = Admin::where('login_code',$identifier)->first();
    
         if (!$admin || !Hash::check($password, $admin->password)) {
             return response()->json([
                 'message' => 'Invalid credentials'
             ], 401);
         }
    
         return response()->json([
             'message' => 'Login successful',
             'admin' => [
                 'id' => $admin->id,
                 'login_code' => $admin->login_code,
                 'full_name' => $admin->full_name,
                 'employee_id' => $admin->employee_id
             ]
         ], 200);
    }

}
