<?php

namespace App\Models\Profile;

use Illuminate\Database\Eloquent\Model;
use App\Models\Auth\Teacher;

class TeacherProfile extends Model
{
    protected $table = 'teacher_profile';
    
     protected $fillable = [
        'profession',
        'bio',
        'expertise',
        'office',
        'office_hours',
        'whatsapp',
        'image',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    protected $appends = ['profile_url'];

    public function getProfileUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }
}
