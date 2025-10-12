<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;


class LikeController extends Controller
{

    public function index()
    {
        //
    }

public function toggle(Request $request, $postId)
{
    $post = Post::findOrFail($postId);
    $user = $request->user();

    // toggle: si ya tiene like, lo quita; si no, lo agrega
    if ($post->likes()->where('user_id', $user->id)->exists()) {
        $post->likes()->detach($user->id);
    } else {
        $post->likes()->attach($user->id);
    }

    return response()->json([
        'likes_count' => $post->likes()->count(),
        'liked_by_user' => $post->likes()->where('user_id', $user->id)->exists(),
    ]);
}


    public function count(Post $post)
    {
        return response()->json([
            'likes' => $post->likes()->count()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'post_id' => 'required|exists:posts,id',
        ]);

        $like = \App\Models\Like::firstOrCreate([
            'post_id' => $data['post_id'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json($like, 201);
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }
    
    public function destroy(string $id)
    {
        //
    }
}
