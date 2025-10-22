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
        'content',
        'latitude',
        'longitude',
        'image',
    ];

    // Un post pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // un post tiene muchas imagenes
    public function imagenes()
{
    return $this->hasMany(Imagen::class, 'id_post');
}


    // Un post puede tener muchos comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();;
    }

    // Un post puede tener muchos likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

}
