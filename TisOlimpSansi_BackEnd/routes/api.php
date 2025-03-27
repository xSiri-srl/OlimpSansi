<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NombreDeHU1\UserPruebaController;
use App\Http\Controllers\Inscripcion\ResponsableInscripcionController;
use App\Http\Controllers\Inscripcion\TutorLegalController; 
use App\Http\Controllers\Inscripcion\InscripcionAreaController; 
use App\Http\Controllers\Inscripcion\EstudianteController; 

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

//registrarTutorLegal
Route::controller(TutorLegalController::class)->group(function(){

    Route::get('/tutoresLegales', [TutorLegalController::class, 'index']);
    Route::post('/agregarTutorLegal', [TutorLegalController::class, 'store']);
    Route::get('/tutorLegal/{id}', [TutorLegalController::class, 'show']);
    Route::put('/actualizarTutorLegal/{id}', [TutorLegalController::class, 'update']);
    Route::delete('/eliminarTutorLegal/{id}', [TutorLegalController::class, 'destroy']);
    
});

//SeleccionarAreasCompetencia
Route::controller(InscripcionAreaController::class)->group(function(){

    Route::get('/todasInscripciones', [InscripcionAreaController::class, 'index']);
    Route::post('/agregarInscripcionArea', [InscripcionAreaController::class, 'store']);
    Route::get('/inscripcionArea/{id}', [InscripcionAreaController::class, 'show']);
    Route::put('/actualizarInscripcionArea/{id}', [InscripcionAreaController::class, 'update']);
    Route::delete('/eliminarInscripcionArea/{id}', [InscripcionAreaController::class, 'destroy']);
    
});

//Registrar datos del competidor
Route::controller(EstudianteController::class)->group(function(){

    Route::get('/estudiantes', [EstudianteController::class, 'index']);
    Route::post('/agregarEstudiante', [EstudianteController::class, 'store']);
    Route::get('/estudiante/{id}', [EstudianteController::class, 'show']);
    Route::put('/actualizarEstudiante/{id}', [EstudianteController::class, 'update']);
    Route::delete('/eliminarEstudiante/{id}', [EstudianteController::class, 'destroy']);
    
});