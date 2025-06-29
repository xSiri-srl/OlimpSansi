<?php

use App\Http\Controllers\Usuarios\AuthController;
use App\Http\Controllers\GestionOlimpiadas\OlimpiadaController;
use App\Http\Controllers\GestionOlimpiadas\OlimpiadaAreaController;
use App\Http\Middleware\VerifyCsrfToken;
use App\Helpers\OrdenPagoHelper;
use App\Http\Controllers\GestionPagos\OrdenPagoController;
use App\Http\Controllers\Inscripcion\ColegioController;
use App\Http\Controllers\Inscripcion\InscripcionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::post('/login', [AuthController::class, 'login']);


Route::post('/registro', [AuthController::class, 'register']);

Route::get('/obtener-costos-olimpiada/{id}', [OlimpiadaAreaController::class, 'obtenerCostos']);
Route::get('/areas-habilitadas/{id}', [OlimpiadaController::class, 'obtenerCombinacionesOlimpiada']);
Route::get('/areas-habilitadas-simple/{id}', [OlimpiadaController::class, 'listarCombinacionesSimple']);

Route::get('/olimpiadas-publicas', [OlimpiadaController::class, 'getTodasLasOlimpiadas']);
Route::get('/olimpiadas-publicas-completas', [OlimpiadaController::class, 'getOlimpiadasPublicasCompletas']);

Route::get('/olimpiada/{id}', [OlimpiadaController::class, 'show']);

// Corregir esta ruta para que funcione correctamente
Route::get('/olimpiada/{id}/areas-categorias', function($id) {
    return app(OlimpiadaController::class)->getAreasCategoriasPorOlimpiada(new \Illuminate\Http\Request(['id' => $id]));
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/permisos', [AuthController::class, 'getPermisos']);

    // Rutas para olimpiadas - solo usuarios con permiso crear_olimpiada
    Route::middleware('permiso:crear_olimpiada')->group(function () {
         Route::post('/agregar-olimpiada', [OlimpiadaController::class, 'store']);
        // Obtener olimpiadas
        Route::get('/getOlimpiadas', [OlimpiadaController::class, 'getOlimpiadas']);
        Route::post('/olimpiada/max-materias', [OlimpiadaController::class, 'setNumMaxMaterias']);

        // Verificar si una olimpiada tiene inscripciones
        Route::get('/olimpiada/{id}/verificar-inscripciones', [OlimpiadaController::class, 'verificarInscripciones']);
        
        // Asociar áreas a olimpiadas
        Route::post('/asociar-areas-olimpiada', [OlimpiadaAreaController::class, 'asociarAreas']);
        
        // Obtener áreas por olimpiada
        Route::get('/areas-olimpiada/{id}', [OlimpiadaAreaController::class, 'getAreasPorOlimpiada']);
    
        //Actualizar costos por área
        Route::post('/actualizar-costos-olimpiada', [OlimpiadaAreaController::class, 'actualizarCostos']);
        Route::post('/desasociar-areas-olimpiada', [OlimpiadaAreaController::class, 'desasociarAreas']);

        //Categorías y grados
        Route::get('/categorias-por-area/{idArea}', [App\Http\Controllers\Inscripcion\CategoriaController::class, 'getCategoriasPorArea']);
        Route::get('/grados', function() {
            return response()->json([
                'status' => 200,
                'data' => App\Models\Inscripcion\GradoModel::orderBy('id')->get()
            ]);
        });
        Route::post('/desasociar-areas-olimpiada', [OlimpiadaAreaController::class, 'desasociarAreas']);
        Route::post('/desasociar-categorias-olimpiada', [OlimpiadaAreaController::class, 'desasociarCategorias']);
   
    });

    // Route::middleware('permiso:ver_preinscritos')->group(function () {
    //     Route::get('/estudiantes/pre-inscritos-olimpiada', [InscripcionController::class, 'contarPreinscritosPorOlimpiada']);
        
    //     Route::post('/estudiantes/preinscritos/departamento', [ColegioController::class, 'contarPreinscritosPorDepartamento']);

    //     Route::get('/inscripciones/por-area', [InscripcionController::class, 'inscripcionesPorArea']);
    //     Route::get('/inscripciones/por-categoria', [InscripcionController::class, 'inscripcionesPorCategoria']);

    // });

    // Route::middleware('permiso:ver_ordenes_pago')->group(function () {
    //     Route::get('/orden-pago-olimpiada', [OrdenPagoController::class, 'obtenerOrdenPagoPorOlimpiada']);
    //     Route::get('/ordenes-recientes', [OrdenPagoController::class, 'obtenerOrdenesConResponsable']);

    // });
    // Route::middleware('permiso:ver_inscripciones_verificadas')->group(function () {
    //     Route::get('/estudiantes/inscritos-olimpiada', [InscripcionController::class, 'contarInscritosPorOlimpiada']);
    //     Route::post('/estudiantes/inscritos/departamento', [ColegioController::class, 'contarInscritosPorDepartamento']);
    // });
    
});

Route::get('/areas-olimpiada/{id}', [OlimpiadaAreaController::class, 'getAreasPorOlimpiada']);

Route::get('/{any}', function () {
    return view('index');
})->where('any','.*');