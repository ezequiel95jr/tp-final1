<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register (puede coexistir con POST /api/users)
public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
        'phone' => 'nullable|string|max:20',

    ]);

    $user = \App\Models\User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'phone' => $request->phone,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user
    ]);
}

    // Login
public function login(Request $request){
    $user = User::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message'=>'Credenciales incorrectas'], 401);
    }
    $token = $user->createToken('auth_token')->plainTextToken;
    return response()->json(['token'=>$token, 'user'=>$user]);
}

public function logout(Request $request){
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message'=>'Logout exitoso']);
}
}