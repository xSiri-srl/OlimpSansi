<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



use App\Http\Controllers\NombreDeHU1\EjemploController;


//Rutas de registrar competidor
Route::controller(EjemploController::class)->group(function(){
    Route::post('/agregarEjemplo', [EjemploController::class, 'store']);
    
});




