<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\MarkerController;
use App\Http\Controllers\Api\MapsController;


// Ruta de prueba
Route::get('/prueba', function () {
    return ['status' => 'API OK'];
});

// ----------- AUTH ------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts', [PostController::class, 'index']); 
Route::apiResource('markers', MarkerController::class)
        ->only(['index','store','update','destroy']);
// Rutas protegidas por Sanctum (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // ----------- USERS ------------
    Route::apiResource('users', UserController::class)->only(['index','show','store']);

    // ----------- POSTS ------------
    Route::apiResource('posts', PostController::class)->only(['index','show','store','destroy']);

    // ----------- COMMENTS ------------
    Route::apiResource('comments', CommentController::class)->only(['index','store','destroy']);

    // ----------- LIKES ------------
     Route::post('/likes/toggle', [PostController::class, 'toggleLike']);

     Route::post('/upload', [ImageController::class, 'upload']);
         Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);

    //------------------ Maps ------------------
    

    Route::get('/maps/geocode', [MapsController::class, 'geocode']);

        
});
