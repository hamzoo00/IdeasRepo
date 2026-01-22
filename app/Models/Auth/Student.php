<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{

      use HasApiTokens;
     protected $table = 'students';
 
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
        'password',
        'bio',
    ];

   protected $hidden =['password'];


   // This adds a fake attribute 'profile_url' to your JSON response
      protected $appends = ['profile_url'];
      
      public function getProfileUrlAttribute()
      {
          return $this->image
              ? asset('storage/' . $this->image)
              : null;
      }
}


