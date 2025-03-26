<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NombreDeHU1\UserPruebaController;
use App\Http\Controllers\Inscripcion\TutorAcademicoController;

Route::controller(UserPruebaController::class)->group(function(){
    Route::post('/agregarEjemplo', [UserPruebaController::class, 'store']);
    
});

//registrarTutorAcademico
Route::controller(TutorAcademicoController::class)->group(function(){

    Route::get('/tutoresAcademicos', [TutorAcademicoController::class, 'index']);
    Route::post('/agregarTutorAcademico', [TutorAcademicoController::class, 'store']);
    Route::get('/tutorAcademico/{id}', [TutorAcademicoController::class, 'show']);
    Route::put('/actualizarTutorAcademico/{id}', [TutorAcademicoController::class, 'update']);
    Route::delete('/eliminarTutorAcademico/{id}', [TutorAcademicoController::class, 'destroy']);
    
});