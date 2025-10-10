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
            'title'   => ['required','string','max:255'],
            'content' => ['required','string'],
        ]);

        // user() viene del token Sanctum
        $post = $request->user()->posts()->create($data);
        $post->load('user:id,name');

        return response()->json($post, 201);
    }

    public function index()
    {
        // Lista con el usuario (id, name)
        return Post::with('user:id,name')->latest()->paginate(10);
    }

    public function show(Post $post)
    {
        $post->load('user:id,name');
        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
