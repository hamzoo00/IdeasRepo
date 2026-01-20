<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
   protected $fillable =[
        'full_name',
        'university_name',
        'student_id',
        'batch',
        'program',
        'degree',
        'semester',
        'email',
        'whatsapp',
        'interest',
        'image',
        'password'
    ];

   protected $hidden =['password'];
}
