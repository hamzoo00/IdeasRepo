<?php

namespace App\Models\Ideas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Ideas extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'summary', 'description', 'tech_stack',
        'status', 'is_embargo', 'author_id', 'author_type', 'is_edited'
    ];

    // Polymorphic Relationship
    public function author()
    {
        return $this->morphTo();
    }

    
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'idea_tag', 'idea_id', 'tag_id');
}
}
