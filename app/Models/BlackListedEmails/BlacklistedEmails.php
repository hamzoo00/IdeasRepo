<?php

namespace App\Models\BlackListedEmails;

use Illuminate\Database\Eloquent\Model;

class BlacklistedEmails extends Model
{
    protected $fillable = ['email'];
}
