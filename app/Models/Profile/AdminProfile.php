<?php

namespace App\Models\Profile;

use Illuminate\Database\Eloquent\Model;
use App\Models\Auth\Admin;

class AdminProfile extends Model
{
     protected $fillable = [
        'profession',
        'bio',
        'office',
        'office_hours',
        'whatsapp',
        'image',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
  
}
