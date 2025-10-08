<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LikeController extends Controller
{

    public function index()
    {
        //
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
