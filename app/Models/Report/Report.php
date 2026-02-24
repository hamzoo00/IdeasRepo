<?php

namespace App\Models\Report;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ideas\Ideas;

class Report extends Model
{
    use HasFactory;

    // Allow mass assignment for these fields
    protected $fillable = [
        'idea_id',
        'reporter_id',
        'reporter_type',
        'reason',
        'comment',
        'status'
    ];

    public function idea()
    {
        return $this->belongsTo(Ideas::class, 'idea_id');
    }

    
    public function reporter()
    {
        return $this->morphTo();
    }
}