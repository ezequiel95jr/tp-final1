<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        // Guarda la imagen en storage/app/public/uploads
        $path = $request->file('image')->store('imagenes', 'public');

        // Genera la URL pública
        $url = asset('storage/' . $path);

        return response()->json([
            'message' => 'Imagen subida correctamente',
            'url' => $url
        ]);
    }
}
