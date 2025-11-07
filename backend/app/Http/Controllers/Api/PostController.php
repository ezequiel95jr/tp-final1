<?php

namespace App\Http\Controllers\Api;

use App\Models\Marker;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class PostController extends Controller
{
public function store(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'title'      => 'required|string|max:255',
        'content'    => 'required|string',
        'image'      => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        'latitude'   => 'required|numeric',
        'longitude'  => 'required|numeric',
        'address'    => 'nullable|string|max:255',
    ]);

    $post = DB::transaction(function () use ($user, $data, $request) {

        
        $path = $request->file('image')->store('imagenes', 'public');
        
        $imageUrl = Storage::url($path);

        
        $post = Post::create([
            'user_id' => $user->id,
            'title'   => $data['title'],
            'content' => $data['content'],
            'image'   => $imageUrl,                  
            'address' => $data['address'] ?? null,
        ]);

       
        Marker::create([
            'post_id'     => $post->id,
            'user_id'     => $user->id,
            'latitude'    => $data['latitude'],
            'longitude'   => $data['longitude'],
            'title'       => $data['title'],
            'description' => $data['content'],
        ]);

        return $post;
    });

    return response()->json([
        'message' => 'Post creado correctamente',
        'post'    => $post,
    ], 201);
}


    public function index()
    {
        
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
    $user = $request->user(); 
    $postId = $request->post_id;

    if (!$user) {
        return response()->json(['message' => 'No autenticado'], 401);
    }

    $post = \App\Models\Post::find($postId);
    if (!$post) {
        return response()->json(['message' => 'Post no encontrado'], 404);
    }

   
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
