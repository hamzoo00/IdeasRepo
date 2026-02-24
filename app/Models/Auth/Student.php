<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Ideas\Ideas;

class Student extends Authenticatable
{

      use HasApiTokens;
     // protected $table = 'students';
 
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
        'is_suspended'
    ];

   protected $hidden =['password'];


   protected $appends = ['profile_image']; 

    public function getProfileImageAttribute()
    {
     
        return $this->image; 
    }

      public function ideas()
     {
          return $this->morphMany(Ideas::class, 'author');
     }

      
}


