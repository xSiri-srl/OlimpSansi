<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OlimpiadaController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
Route::get('/', function () {
    return view('welcome');
});






Route::post('/login', [AuthController::class, 'login']);

Route::post('/registro', [AuthController::class, 'register']);
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => true]);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/permisos',  [AuthController::class, 'getPermisos']);

});





    
Route::controller(OlimpiadaController::class)->group(function(){
    Route::post('/agregarOlimpiada', [OlimpiadaController::class, 'store'])
    ->middleware(['auth:sanctum', 'permiso:crear_olimpiada']);
    //devolver todas las olimpiadas para que seleccionen una y hagan la asociacion entre area y categoria

    //devolver todas las olimpiadas para que seleccione una y devuelva todas las areas de esta y seleccione una materia y le asigne precio

});


