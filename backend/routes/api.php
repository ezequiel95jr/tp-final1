<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;

// Ruta de prueba
Route::get('/prueba', function () {
    return ['status' => 'API OK'];
});

// ----------- AUTH ------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts', [PostController::class, 'index']); 

// Rutas protegidas por Sanctum (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // ----------- USERS ------------
    Route::apiResource('users', UserController::class)->only(['index','show','store']);

    // ----------- POSTS ------------
    Route::apiResource('posts', PostController::class)->only(['index','show','store']);

    // ----------- COMMENTS ------------
    Route::apiResource('comments', CommentController::class)->only(['index','store']);

    // ----------- LIKES ------------
    //Route::apiResource('likes', LikeController::class)->only(['index','store','show','toggle','count']);
     Route::post('/likes/toggle', [PostController::class, 'toggleLike']);
        
});
