<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NombreDeHU1\UserPruebaController;
use App\Http\Controllers\OrdenPagoController;
use App\Http\Controllers\ResponsableInscripcion\ResponsableInscripcionController;

Route::controller(UserPruebaController::class)->group(function(){
    Route::post('/agregarEjemplo', [UserPruebaController::class, 'store']);
    
});


//registrarResponsableInscripcion
Route::controller(ResponsableInscripcionController::class)->group(function(){

    Route::get('/responsablesInscrip', [ResponsableInscripcionController::class, 'index']);
    Route::post('/agregarTresponsableInscrip', [ResponsableInscripcionController::class, 'store']);
    Route::get('/responsableInscrip/{id}', [ResponsableInscripcionController::class, 'show']);
    Route::put('/actualizarResponsableInscrip/{id}', [ResponsableInscripcionController::class, 'update']);
    Route::delete('/eliminarResponsableInscrip/{id}', [ResponsableInscripcionController::class, 'destroy']);
    
});

Route::post('/verificar-codigo-generado', [OrdenPagoController::class, 'verificarCodigo']);

Route::post('/procesar-comprobanteOCR', [OrdenPagoController::class, 'procesarComprobante']);

Route::post('/guardar-comprobante', [OrdenPagoController::class, 'guardarComprobante']);