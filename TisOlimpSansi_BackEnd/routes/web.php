<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OlimpiadaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/registro', [AuthController::class, 'register']);
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => true]);
});


Route::post('/agregarOlimpiada', [OlimpiadaController::class, 'store'])
    ->middleware(['auth:sanctum', 'permiso:crear_olimpiada']);