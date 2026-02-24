<?php

namespace App\Models\Admin;

use App\Models\Auth\Admin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Report\Report;

class AdminLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'report_id',
        'target_id',
        'target_type',
        'action_taken',
        'notes',
        'resolved_at'
    ];

    
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }


    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function target()
    {
        return $this->morphTo();
    }
}