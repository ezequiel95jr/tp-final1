<?php

use Illuminate\Support\Facades\Route;
Route::get('/prueba-web', function() {
    return 'Ruta web OK';
});

Route::get('/', function () {
    return view('welcome');
});
