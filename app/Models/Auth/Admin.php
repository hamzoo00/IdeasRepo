<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        'full_name',
        'login_code',
        'employee_id',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}
