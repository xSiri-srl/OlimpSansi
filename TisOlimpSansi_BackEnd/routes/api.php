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
use App\Http\Controllers\Inscripcion\InscripcionController;
use App\Http\Controllers\GestionOlimpiadas\ConvocatoriaController;
use App\Http\Controllers\UserAdminController;
use App\Http\Controllers\GestionOlimpiadas\OlimpiadaController;
use App\Http\Controllers\GestionOlimpiadas\OlimpiadaAreaController;
use App\Http\Controllers\Inscripcion\CategoriaGradoController;

use App\Http\Controllers\Inscripcion\AreaController;
use App\Http\Controllers\Inscripcion\CategoriaController;

use App\Http\Controllers\GestionPagos\OrdenPagoController;
use App\Http\Controllers\GestionPagos\ComprobanteController;
use App\Http\Middleware\VerificarPermiso;


//registrarResponsableInscripcion
Route::controller(ResponsableInscripcionController::class)->group(function(){

    Route::get('/responsables-inscrip', [ResponsableInscripcionController::class, 'index']);
    Route::post('/agregar-responsable-inscrip', [ResponsableInscripcionController::class, 'store']);
    Route::get('/responsable-inscrip/{id}', [ResponsableInscripcionController::class, 'show']);
    Route::put('/actualizar-responsable-inscrip/{id}', [ResponsableInscripcionController::class, 'update']);
    Route::delete('/eliminar-responsable-inscrip/{id}', [ResponsableInscripcionController::class, 'destroy']);
    Route::get('/buscar-responsable/{ci}', [ResponsableInscripcionController::class, 'buscarResponsable']);
    
});

//registrarTutorLegal
Route::controller(TutorLegalController::class)->group(function(){
    Route::get('/tutores-legales', [TutorLegalController::class, 'index']);
    Route::post('/agregar-tutor-legal', [TutorLegalController::class, 'store']);
    Route::get('/tutor-legal/{id}', [TutorLegalController::class, 'show']);
    Route::put('/actualizar-tutor-legal/{id}', [TutorLegalController::class, 'update']);
    Route::delete('/eliminar-tutor-legal/{id}', [TutorLegalController::class, 'destroy']);
    Route::get('/buscar-tutor-legal/{ci}', [TutorLegalController::class, 'buscarTutorLegal']); // Añadir esta línea
}); 
//registrarTutorAcademico
Route::controller(TutorAcademicoController::class)->group(function(){

    Route::get('/tutores-academicos', [TutorAcademicoController::class, 'index']);
    Route::post('/agregar-tutor-academico', [TutorAcademicoController::class, 'store']);
    Route::get('/tutor-academico/{id}', [TutorAcademicoController::class, 'show']);
    Route::put('/actualizar-tutor-academico/{id}', [TutorAcademicoController::class, 'update']);
    Route::delete('/eliminar-tutor-academico/{id}', [TutorAcademicoController::class, 'destroy']);
    Route::get('/buscar-tutor/{ci}', [TutorAcademicoController::class, 'buscarTutor']); 
});


Route::controller(CategoriaController::class)->group(function(){

    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::post('/agregar-categoria', [CategoriaController::class, 'store']);
    Route::get('/categoria/{id}', [CategoriaController::class, 'show']);
    Route::put('/actualizar-categoria/{id}', [CategoriaController::class, 'update']);
    Route::delete('/eliminar-categoria/{id}', [CategoriaController::class, 'destroy']);
    
});
Route::controller(AreaController::class)->group(function(){

    Route::get('/areas', [AreaController::class, 'index']);
    Route::post('/agregar-area', [AreaController::class, 'store']);
    Route::get('/area/{id}', [AreaController::class, 'show']);
    Route::put('/actualizar-area/{id}', [AreaController::class, 'update']);
    Route::delete('/eliminar-area/{id}', [AreaController::class, 'destroy']);
    
});

//Registrar datos del competidor
Route::controller(EstudianteController::class)->group(function(){

    Route::get('/estudiantes', [EstudianteController::class, 'index']);
    Route::post('/agregar-estudiante', [EstudianteController::class, 'store']);
    Route::get('/estudiante/{id}', [EstudianteController::class, 'show']);
    Route::put('/actualizar-estudiante/{id}', [EstudianteController::class, 'update']);
    Route::delete('/eliminar-estudiante/{id}', [EstudianteController::class, 'destroy']);
    
});

Route::controller(ColegioController::class)->group(function(){

    Route::get('/colegios', [ColegioController::class, 'index']);
    Route::post('/agregar-colegio', [ColegioController::class, 'store']);
    Route::get('/colegio/{id}', [ColegioController::class, 'show']);
    Route::put('/actualizar-colegio/{id}', [ColegioController::class, 'update']);
    Route::delete('/eliminar-colegio/{id}', [ColegioController::class, 'destroy']);
    
});

Route::controller(GradoController::class)->group(function(){

    Route::get('/grados', [GradoController::class, 'index']);
    Route::post('/agregar-grado', [GradoController::class, 'store']);
    Route::get('/grado/{id}', [GradoController::class, 'show']);
    Route::put('/actualizar-grado/{id}', [GradoController::class, 'update']);
    Route::delete('/eliminar-grado/{id}', [GradoController::class, 'destroy']);
    
});

Route::controller(ConvocatoriaController::class)->group(function(){

    Route::get('/convocatorias', [ConvocatoriaController::class, 'index']);
    Route::post('/agregar-convocatoria', [ConvocatoriaController::class, 'store']);
    Route::get('/convocatoria/{id}', [ConvocatoriaController::class, 'show']);
    Route::post('/actualizar-convocatoria/{id}', [ConvocatoriaController::class, 'update']);
    Route::delete('/eliminar-convocatoria/{id}', [ConvocatoriaController::class, 'destroy']);
    Route::get('/convocatoria-por-area/{id}', [ConvocatoriaController::class, 'convocatoriaPorArea']);
});




Route::get('/orden-pago', [OrdenPagoController::class, 'obtenerOrdenPago']);
Route::post('/orden-pago/pdf', [OrdenPagoController::class, 'generarYGuardarOrdenPagoPDF']);
Route::get('/orden-pago/{codigoGenerado}', [OrdenPagoController::class, 'descargarOrdenPago']);
Route::post('/verificar-codigo-generado', [OrdenPagoController::class, 'verificarCodigo']);
Route::post('/procesar-comprobanteOCR', [OrdenPagoController::class, 'procesarComprobante']);
Route::get('/obtener-orden-pago/{codigo}', [OrdenPagoController::class, 'obtenerOrdenPagoPorCodigo']);
Route::get('/resumen-orden-pago/{codigo}', [OrdenPagoController::class, 'obtenerResumenPorCodigo']);
Route::get('/dinero-por-departamento', [OrdenPagoController::class, 'dineroRecaudadoPorDepartamento']);
Route::get('/ordenes-recientes', [OrdenPagoController::class, 'obtenerOrdenesConResponsable']);
Route::get('/orden-de-pago/info', [OrdenPagoController::class, 'getInfOrdenesDePago']);
Route::get('/orden-pago-existe/{codigo}', [OrdenPagoController::class, 'ordenPagoExiste']);
Route::get('/todas-publicas', [OlimpiadaController::class, ' getTodasLasOlimpiadas']);
Route::get('/obtener-olimpiada/{codigo}', [OrdenPagoController::class, 'obtenerIdOlimpiada']);

Route::post('/guardar-comprobante', [ComprobanteController::class, 'guardarComprobante']);


Route::get('/inscripciones/por-area', [InscripcionController::class, 'inscripcionesPorArea']);
Route::get('/inscripciones/por-categoria', [InscripcionController::class, 'inscripcionesPorCategoria']);
Route::post('/inscribir', [InscripcionController::class, 'registrar']);
Route::post('/inscribir-lista', [InscripcionController::class, 'registrarLista']);
Route::post('/editar-lista', [InscripcionController::class, 'actualizarLista']);
Route::get('/lista-inscritos', [InscripcionController::class, 'listarInscritos']);
Route::get('/preinscritos-por-codigo', [InscripcionController::class, 'registrosPorCodigo']);
//contar preinscritos
Route::get('/estudiantes/pre-inscritos', [InscripcionController::class, 'contarPreinscritos']);
Route::get('/estudiantes/inscritos', [InscripcionController::class, 'contarInscritos']);


Route::get('/buscarEstudiante/{ci}', [EstudianteController::class, 'buscarEstudiante']);

//filtros para contar 
Route::post('/colegios/filtro', [ColegioController::class, 'getByFiltro']);
Route::post('/estudiantes/departamento', [ColegioController::class, 'contarPorDepartamento']);
Route::post('/estudiantes/colegio', [ColegioController::class, 'contarPorColegio']);
Route::post('/estudiantes/grado', [ColegioController::class, 'contarPorGrado']);
Route::post('/estudiantes/categoria-area', [ColegioController::class, 'filtrarPorCategoriaArea']);
Route::post('/estudiantes/inscritos/departamento', [ColegioController::class, 'contarInscritosPorDepartamento']);
Route::post('/estudiantes/preinscritos/departamento', [ColegioController::class, 'contarPreinscritosPorDepartamento']);



//inscripcion
//obtener todas las olimpiadas esto sirve tanto para admin como para usuarios no registrados
Route::get('/get-olimpiadasActuales', [OlimpiadaController::class, 'getOlimpiadasActuales']);
Route::get('/get-olimpiadaz', [OlimpiadaController::class, 'getOlimpiadas']);
//mostrar todas las areas habilitadas para esa olimpiada
Route::post('/olimpiadas/areas', [OlimpiadaController::class, 'getAreasPorOlimpiada']);


Route::get('/areas-categorias-olimpiada', [OlimpiadaController::class, 'getAreasCategoriasPorOlimpiada']);


Route::get('/curso-area-categoria-por-olimpiada', [CategoriaGradoController::class, 'obtenerCategoriasPorGrado']);

//mostrar todas las categorias de esa materia de una olimpiada




