<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;
use App\Models\Auth\Admin;

class Announcement extends Model
{
    protected $fillable = ['admin_id', 'title', 'content', 'expires_at'];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
