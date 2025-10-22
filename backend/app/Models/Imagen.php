<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    use HasFactory;

    protected $table = 'imagenes';

    protected $fillable = [
        'id_post',
        'url',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class, 'id_post');
    }
}
