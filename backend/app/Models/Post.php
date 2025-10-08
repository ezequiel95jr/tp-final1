<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content'
    ];

    // Un post pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Un post puede tener muchos comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Un post puede tener muchos likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
}
