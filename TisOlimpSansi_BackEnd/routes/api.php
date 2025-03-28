<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NombreDeHU1\UserPruebaController;
use App\Http\Controllers\Inscripcion\ResponsableInscripcionController;
use App\Http\Controllers\Inscripcion\TutorLegalController; 
use App\Http\Controllers\Inscripcion\InscripcionAreaController; 
use App\Http\Controllers\Inscripcion\EstudianteController;
use App\Http\Controllers\Inscripcion\TutorAcademicoController;
use App\Http\Controllers\Inscripcion\ColegioController;
use App\Http\Controllers\Inscripcion\GradoController;

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
//registrarTutorAcademico
Route::controller(TutorAcademicoController::class)->group(function(){

    Route::get('/tutoresAcademicos', [TutorAcademicoController::class, 'index']);
    Route::post('/agregarTutorAcademico', [TutorAcademicoController::class, 'store']);
    Route::get('/tutorAcademico/{id}', [TutorAcademicoController::class, 'show']);
    Route::put('/actualizarTutorAcademico/{id}', [TutorAcademicoController::class, 'update']);
    Route::delete('/eliminarTutorAcademico/{id}', [TutorAcademicoController::class, 'destroy']);
    
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

Route::controller(ColegioController::class)->group(function(){

    Route::get('/colegios', [ColegioController::class, 'index']);
    Route::post('/agregarColegio', [ColegioController::class, 'store']);
    Route::get('/colegio/{id}', [ColegioController::class, 'show']);
    Route::put('/actualizarColegio/{id}', [ColegioController::class, 'update']);
    Route::delete('/eliminarColegio/{id}', [ColegioController::class, 'destroy']);
    
});

Route::controller(GradoController::class)->group(function(){

    Route::get('/grados', [GradoController::class, 'index']);
    Route::post('/agregarGrado', [GradoController::class, 'store']);
    Route::get('/grado/{id}', [GradoController::class, 'show']);
    Route::put('/actualizarGrado/{id}', [GradoController::class, 'update']);
    Route::delete('/eliminarGrado/{id}', [GradoController::class, 'destroy']);
    
});