<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marker extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'latitude',
        'longitude',
        'title',
        'description',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    public $timestamps = true;
}
