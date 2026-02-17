<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Profile\AdminProfile;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'full_name',
        'login_code',
        'email',
        'employee_id',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

     public function profile()
    {
        return $this->hasOne(AdminProfile::class);
    }

}
