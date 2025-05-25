<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\OlimpiadaAreaController;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/login', [AuthController::class, 'login']);

Route::post('/registro', [AuthController::class, 'register']);

Route::get('/olimpiadas-publicas', [OlimpiadaController::class, 'getOlimpiadasPublicas']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/permisos', [AuthController::class, 'getPermisos']);

    // Rutas para olimpiadas - solo usuarios con permiso crear_olimpiada
    Route::middleware('permiso:crear_olimpiada')->group(function () {
        // Obtener olimpiadas
        Route::get('/getOlimpiadas', [OlimpiadaController::class, 'getOlimpiadas']);
        Route::post('/olimpiada/max-materias', [OlimpiadaController::class, 'setNumMaxMaterias']);

        // Asociar áreas a olimpiadas
        Route::post('/asociar-areas-olimpiada', [OlimpiadaAreaController::class, 'asociarAreas']);
        
        // Obtener áreas por olimpiada
        Route::get('/areas-olimpiada/{id}', [OlimpiadaAreaController::class, 'getAreasPorOlimpiada']);
    
        //Actualizar costos por área
        Route::post('/actualizar-costos-olimpiada', [OlimpiadaAreaController::class, 'actualizarCostos']);
        
        Route::post('/asociar-areas-olimpiada', [OlimpiadaAreaController::class, 'asociarAreas']);
        Route::post('/desasociar-areas-olimpiada', [OlimpiadaAreaController::class, 'desasociarAreas']);
   
    });
});
    
Route::controller(OlimpiadaController::class)->group(function(){
    //crear olimpiadas
    Route::post('/agregarOlimpiada', [OlimpiadaController::class, 'store'])
    ->middleware(['auth:sanctum', 'permiso:crear_olimpiada']);
});

Route::get('/areas-olimpiada/{id}', [OlimpiadaAreaController::class, 'getAreasPorOlimpiada']);

