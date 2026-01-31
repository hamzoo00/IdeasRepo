<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use App\Models\Profile\TeacherProfile;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Teacher extends Authenticatable
{
    use HasApiTokens;
    
    protected $table = 'teachers';

   
    protected $fillable = [
        'full_name',
        'email',
        'password'
    ];

    protected $hidden = ['password'];

    public function profile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

}