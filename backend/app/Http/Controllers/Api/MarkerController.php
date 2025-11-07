<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Marker;
use Illuminate\Support\Facades\Auth;

class MarkerController extends Controller
{
    
    public function index()
    {
        $markers = Marker::where('user_id', Auth::id())->get();
        return response()->json($markers);
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $marker = Marker::create([
            'user_id' => Auth::id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($marker, 201);
    }

    
    public function update(Request $request, $id)
    {
        $marker = Marker::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $request->validate([
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $marker->update($request->only(['latitude', 'longitude', 'title', 'description']));

        return response()->json($marker);
    }

    
    public function destroy($id)
    {
        $marker = Marker::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $marker->delete();

        return response()->json(['message' => 'Marcador eliminado correctamente']);
    }
}
