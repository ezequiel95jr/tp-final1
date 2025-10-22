<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;          
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Marker extends Model
{
    protected $fillable = ['lat', 'lng', 'title', 'description', 'user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
