<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class CommentController extends Controller
{
    // GET /comments?post_id=123
    public function index(Request $request)
    {
        $request->validate(['post_id' => 'required|integer|exists:posts,id']);

        $comments = Comment::with(['user:id,name'])
            ->where('post_id', $request->post_id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($comments); // [{ id, post_id, user_id, content, created_at, user:{id,name} }]
    }

    // POST /comments  { post_id, content }
    public function store(Request $request)
    {
        $data = $request->validate([
            'post_id' => 'required|integer|exists:posts,id',
            'content' => 'required|string|max:5000',
        ]);

        $comment = Comment::create([
            'post_id' => $data['post_id'],
            'content' => $data['content'],
            'user_id' => Auth::id(),
        ]);

        // devolver con el user para el front
        $comment->load('user:id,name');

        return response()->json($comment, Response::HTTP_CREATED);
    }

    // DELETE /comments/{comment}
    public function destroy(Comment $comment)
    {
        $userId = Auth::id();

        // dueño del comentario o dueño del post
        $isOwnerOfComment = $comment->user_id === $userId;
        $isOwnerOfPost    = $comment->post()->value('user_id') === $userId;

        if (!($isOwnerOfComment || $isOwnerOfPost)) {
            return response()->json(['message' => 'No autorizado'], Response::HTTP_FORBIDDEN);
        }

        $comment->delete();

        return response()->json(['ok' => true]);
    }
}
