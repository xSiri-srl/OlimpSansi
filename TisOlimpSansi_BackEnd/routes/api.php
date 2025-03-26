<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NombreDeHU1\UserPruebaController;
use App\Http\Controllers\Inscripcion\ResponsableInscripcionController;
use App\Http\Controllers\Inscripcion\TutorLegalController; 
use App\Http\Controllers\Inscripcion\TutorAcademicoController;

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