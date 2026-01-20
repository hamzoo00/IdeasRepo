<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
                'email',
                'password'
    ];

    protected $hidden = ['password'];
}
