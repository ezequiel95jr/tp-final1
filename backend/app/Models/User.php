<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;
    use HasApiTokens, Notifiable;
    
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'is_active'
    ];

        protected $hidden = [
        'password',
        'remember_token',
    ];

    // Un usuario puede tener muchos posts
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // Un usuario puede tener muchos comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Un usuario puede dar muchos likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
}
