<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Listado de comentarios funcionando 🚀',
            'data' => []
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string',
        ]);

        $comment = $request->user()->comments()->create([
            'post_id' => $data['post_id'],
            'content' => $data['content'],
        ]);

        return response()->json($comment, 201);
    }

    public function show(string $id)
    {
    }


    public function update(Request $request, string $id)
    {
        
    }

    public function destroy(string $id)
    {
        
    }
}
