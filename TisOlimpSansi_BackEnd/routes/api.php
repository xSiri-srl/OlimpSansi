<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NombreDeHU1\UserPruebaController;
use App\Http\Controllers\Inscripcion\ResponsableInscripcionController;
use App\Http\Controllers\Inscripcion\TutorLegalController; 
use App\Http\Controllers\Inscripcion\InscripcionCategoriaController; 
use App\Http\Controllers\Inscripcion\EstudianteController;
use App\Http\Controllers\Inscripcion\TutorAcademicoController;
use App\Http\Controllers\Inscripcion\ColegioController;
use App\Http\Controllers\Inscripcion\GradoController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\ConvocatoriaController;

use App\Http\Controllers\Inscripcion\AreaController;
use App\Http\Controllers\Inscripcion\CategoriaController;

use App\Http\Controllers\OrdenPagoController;
use App\Http\Middleware\VerificarPermiso;

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
    Route::get('/buscarResponsable/{ci}', [ResponsableInscripcionController::class, 'buscarResponsable']);
    
});

//registrarTutorLegal
Route::controller(TutorLegalController::class)->group(function(){
    Route::get('/tutoresLegales', [TutorLegalController::class, 'index']);
    Route::post('/agregarTutorLegal', [TutorLegalController::class, 'store']);
    Route::get('/tutorLegal/{id}', [TutorLegalController::class, 'show']);
    Route::put('/actualizarTutorLegal/{id}', [TutorLegalController::class, 'update']);
    Route::delete('/eliminarTutorLegal/{id}', [TutorLegalController::class, 'destroy']);
    Route::get('/buscarTutorLegal/{ci}', [TutorLegalController::class, 'buscarTutorLegal']); // Añadir esta línea
}); 
//registrarTutorAcademico
Route::controller(TutorAcademicoController::class)->group(function(){

    Route::get('/tutoresAcademicos', [TutorAcademicoController::class, 'index']);
    Route::post('/agregarTutorAcademico', [TutorAcademicoController::class, 'store']);
    Route::get('/tutorAcademico/{id}', [TutorAcademicoController::class, 'show']);
    Route::put('/actualizarTutorAcademico/{id}', [TutorAcademicoController::class, 'update']);
    Route::delete('/eliminarTutorAcademico/{id}', [TutorAcademicoController::class, 'destroy']);
    Route::get('/buscarTutor/{ci}', [TutorAcademicoController::class, 'buscarTutor']); 
});

//SeleccionarAreasCompetencia
Route::controller(InscripcionCategoriaController::class)->group(function(){

    Route::get('/todasInscripciones', [InscripcionCategoriaController::class, 'index']);
    Route::post('/agregarInscripcionCategoria', [InscripcionCategoriaController::class, 'store']);
    Route::get('/inscripcionCategoria/{id}', [InscripcionCategoriaController::class, 'show']);
    Route::put('/actualizarInscripcionCategoria/{id}', [InscripcionCategoriaController::class, 'update']);
    Route::delete('/eliminarInscripcionCategoria/{id}', [InscripcionCategoriaController::class, 'destroy']);
    
});
Route::controller(CategoriaController::class)->group(function(){

    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::post('/agregarCategoria', [CategoriaController::class, 'store']);
    Route::get('/categoria/{id}', [CategoriaController::class, 'show']);
    Route::put('/actualizarCategoria/{id}', [CategoriaController::class, 'update']);
    Route::delete('/eliminarCategoria/{id}', [CategoriaController::class, 'destroy']);
    
});
Route::controller(AreaController::class)->group(function(){

    Route::get('/areas', [AreaController::class, 'index']);
    Route::post('/agregarArea', [AreaController::class, 'store']);
    Route::get('/area/{id}', [AreaController::class, 'show']);
    Route::put('/actualizarArea/{id}', [AreaController::class, 'update']);
    Route::delete('/eliminarArea/{id}', [AreaController::class, 'destroy']);
    
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

Route::controller(ConvocatoriaController::class)->group(function(){

    Route::get('/convocatorias', [ConvocatoriaController::class, 'index']);
    Route::post('/agregarConvocatoria', [ConvocatoriaController::class, 'store']);
    Route::get('/convocatoria/{id}', [ConvocatoriaController::class, 'show']);
    Route::post('/actualizarConvocatoria/{id}', [ConvocatoriaController::class, 'update']);
    Route::delete('/eliminarConvocatoria/{id}', [ConvocatoriaController::class, 'destroy']);
    Route::get('/convocatoriaPorArea/{id}', [ConvocatoriaController::class, 'convocatoriaPorArea']);
});

Route::get('/orden-pago', [OrdenPagoController::class, 'obtenerOrdenPago']);
Route::post('/orden-pago/pdf', [OrdenPagoController::class, 'generarYGuardarOrdenPagoPDF']);
Route::get('/orden-pago/{codigoGenerado}', [OrdenPagoController::class, 'descargarOrdenPago']);

Route::post('/verificar-codigo-generado', [OrdenPagoController::class, 'verificarCodigo']);

Route::post('/procesar-comprobanteOCR', [OrdenPagoController::class, 'procesarComprobante']);

Route::post('/guardar-comprobante', [OrdenPagoController::class, 'guardarComprobante']);

Route::get('/obtener-orden-pago/{codigo}', [OrdenPagoController::class, 'obtenerOrdenPagoPorCodigo']);

Route::get('/resumen-orden-pago/{codigo}', [OrdenPagoController::class, 'obtenerResumenPorCodigo']);


Route::post('/inscribir', [InscripcionController::class, 'registrar']);
Route::post('/inscribir-lista', [InscripcionController::class, 'registrarLista']);

Route::get('/lista-inscritos', [InscripcionController::class, 'listarInscritos']);

Route::get('/ordenes-recientes', [OrdenPagoController::class, 'obtenerOrdenesConResponsable']);



Route::post('/colegios/filtro', [ColegioController::class, 'getByFiltro']);

Route::get('/buscarEstudiante/{ci}', [EstudianteController::class, 'buscarEstudiante']);



//filtros para contar 
Route::post('/estudiantes/bydepartamento', [ColegioController::class, 'contarPorDepartamento']);
Route::post('/estudiantes/byColegio', [ColegioController::class, 'contarPorColegio']);
Route::post('/estudiantes/byGrado', [ColegioController::class, 'contarPorGrado']);
Route::post('/estudiantes/byCategoriaArea', [ColegioController::class, 'filtrarPorCategoriaArea']);


//contar preinscritos
Route::get('/estudiantes/pre-inscritos', [InscripcionController::class, 'contarPreinscritos']);
Route::get('/estudiantes/inscritos', [InscripcionController::class, 'contarInscritos']);


Route::get('/orden-de-pago/info', [OrdenPagoController::class, 'getInfOrdenesDePago']);

Route::get('/orden-pago-existe/{codigo}', [OrdenPagoController::class, 'ordenPagoExiste']);
Route::post('/estudiantes/inscritos/bydepartamento', [ColegioController::class, 'contarInscritosPorDepartamento']);
Route::post('/estudiantes/preinscritos/bydepartamento', [ColegioController::class, 'contarPreinscritosPorDepartamento']);
Route::get('/inscripciones/por-area', [InscripcionController::class, 'inscripcionesPorArea']);
Route::get('/inscripciones/por-categoria', [InscripcionController::class, 'inscripcionesPorCategoria']);

//Autenticacion todo lo que va dentor de esto son funciones para usuarios autenticados

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/permisos',  [AuthController::class, 'getPermisos']);

    //ejemplo de proteger rutas, probar despues
    // Rutas protegidas por permisos
    //Route::get('/orden-de-pago/info', [OrdenPagoController::class, 'getInfOrdenesDePago'])
    //    ->middleware(VerificarPermiso::class . ':ver_orden_pago');
});
Route::post('/registro', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
