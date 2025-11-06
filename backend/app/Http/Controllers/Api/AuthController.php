<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;


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
        'image' => 'nullable|string|max:500', // 👈 agregamos la posibilidad de imagen (URL)
    ]);

    $user = \App\Models\User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'phone' => $request->phone,
        'image' => $request->image, // 👈 guarda la URL o base64 si lo envías
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


public function update(Request $request)
{
    $user = $request->user();
    $request->validate(['name' => 'required|string|max:255']);
    $user->name = $request->name;
    $user->save();

    return response()->json($user);
}


public function googleLogin(Request $request)
{
    $token = $request->input('id_token') ?? $request->input('access_token');

    if (!$token) {
        return response()->json(['message' => 'Token no recibido'], 400);
    }
    $clientId = '1057987267691-e0vs7jm74ofo6ou9ivn75p77mbhllmrt.apps.googleusercontent.com';
    #$clientId = config('services.google.client_id');
    if (!$clientId) {
        return response()->json(['message' => 'Google Client ID no configurado'], 500);
    }

    try {
        // 🔍 Verificar token con la API de Google
        $response = Http::get('https://www.googleapis.com/oauth2/v3/tokeninfo', [
            'access_token' => $token,
        ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Token inválido',
                'data' => $response->json(),
            ], 401);
        }

        $googleUser = $response->json();

        // ✅ Buscar usuario por email o crearlo
        $user = User::firstOrCreate(
            ['email' => $googleUser['email']],
            [
                'name' => $googleUser['name'] ?? 'Usuario Google',
                'password' => Hash::make(\Illuminate\Support\Str::random(16)),
                'image' => $googleUser['picture'] ?? null, // Si es nuevo, guarda la foto
            ]
        );

        // ⚙️ Si el usuario ya existía pero no tenía imagen, se la agregamos
        if (!$user->image && isset($googleUser['picture'])) {
            $user->image = $googleUser['picture'];
            $user->save();
        }

        // 🔐 Crear token Laravel Sanctum
        $appToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $appToken,
            'user' => $user,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error interno',
            'error' => $e->getMessage(),
        ], 500);
    }
}


}