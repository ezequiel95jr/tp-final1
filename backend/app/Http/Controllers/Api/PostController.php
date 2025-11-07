<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
        'address' => 'nullable|string',
        // 🔹 importante: permitir archivos tipo imagen
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('imagenes', 'public');
        $data['image'] = basename($path); // solo guardamos el nombre del archivo
    }

    // Crear el post con el usuario autenticado
    $post = $request->user()->posts()->create($data);

    return response()->json([
        'message' => 'Post creado correctamente',
        'post' => $post,
    ]);
}

    public function index()
    {
        // Lista con el usuario (id, name)
        return Post::with('user:id,name')->withCount('likes')->latest()->paginate(10);
    }

    public function show(Post $post)
    {
        $post->load('user:id,name');
        $post->loadCount('likes');
        
        $userLiked = false;
    if (auth()->check()) {
        $userLiked = $post->likes()->where('user_id', auth()->id())->exists();
    }
    $post->setAttribute('user_liked', $userLiked);
        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    
   public function destroy(Post $post)
{
    $userId = auth()->id();
    if ($userId !== $post->user_id) {
        return response()->json(['message' => 'No autorizado'], 403);
    }

    $post->delete();
    return response()->json(['message' => 'Post eliminado correctamente']);
}
    public function toggleLike(Request $request)
{
    $user = $request->user(); // si usás auth:api o sanctum
    $postId = $request->post_id;

    if (!$user) {
        return response()->json(['message' => 'No autenticado'], 401);
    }

    $post = \App\Models\Post::find($postId);
    if (!$post) {
        return response()->json(['message' => 'Post no encontrado'], 404);
    }

    // Verificamos si el usuario ya dio like
    $like = \App\Models\Like::where('user_id', $user->id)
        ->where('post_id', $postId)
        ->first();

    if ($like) {
        $like->delete();
        $liked = false;
    } else {
        \App\Models\Like::create([
            'user_id' => $user->id,
            'post_id' => $postId,
        ]);
        $liked = true;
    }

    $likesCount = \App\Models\Like::where('post_id', $postId)->count();

    return response()->json([
        'liked' => $liked,
        'likes_count' => $likesCount,
    ]);
}

}
