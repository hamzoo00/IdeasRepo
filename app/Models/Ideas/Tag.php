<?php

namespace App\Models\Ideas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function ideas()
    {
        return $this->belongsToMany(Ideas::class);
    }
}