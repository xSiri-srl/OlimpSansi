<?php

namespace App\Http\Controllers;
use App\Models\OrdenPago;
use Illuminate\Support\Facades\Storage;
use App\Models\Inscripcion\InscripcionModel;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\InscripcionAreaModel;
use App\Models\Inscripcion\InscripcionCategoriaModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\Inscripcion\TutorAcademicoModel;
use App\Models\Inscripcion\TutorLegalModel;
use App\Models\comprobantes_pago;



use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

use thiagoalessio\TesseractOCR\UnsuccessfulCommandException;
class OrdenPagoController extends Controller
{

    public function generarYGuardarOrdenPagoPDF(Request $request)
    {
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);
    
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();
        if (!$ordenPago) {
            return response()->json(['message' => 'Orden de pago no encontrada'], 404);
        }
    
        $inscripcion = InscripcionModel::where('id_orden_pago', $ordenPago->id)->first();
        if (!$inscripcion) {
            return response()->json(['message' => 'Inscripción no encontrada para esta orden de pago'], 404);
        }
    
        // Generar el PDF con la vista 'pdf.orden_pago'
        $pdf = Pdf::loadView('pdf.orden_pago', [
            'ordenPago' => $ordenPago,
            'inscripcion' => $inscripcion,
        ]);
    
    
        // Generar el nombre y guardar el PDF en disco
        $fileName = 'orden_pago_' . $ordenPago->codigo_generado . '.pdf';
        $filePath = 'ordenes_pago/' . $fileName;
    
        // Guardar el archivo en storage/app/public/ordenes_pago
        try {
            Storage::disk('public')->put($filePath, $pdf->output());
            Log::info("PDF guardado correctamente en: {$filePath}");
        } catch (\Exception $e) {
            Log::error("Error al guardar el PDF: " . $e->getMessage());
            return response()->json(['message' => 'Error al guardar el PDF'], 500);
        }
    
        // Guardar la URL en el modelo
        $ordenPago->orden_pago_url = $filePath;
        $ordenPago->save();
    
        Log::info("PDF guardado y URL actualizada para la orden de pago: {$ordenPago->codigo_generado}");
    
        return response()->json([
            'message' => 'PDF generado y guardado exitosamente.',
            'orden_pago_url' => asset('storage/' . $filePath),
            'ordenPago' => $ordenPago
        ]);
    }

    /**
     * Descarga la orden de pago como PDF
     */
    public function descargarOrdenPago($codigo)
{
    // Buscar la orden de pago por el código
    $ordenPago = OrdenPago::where('codigo_generado', $codigo)->first();

    if (!$ordenPago) {
        return response()->json(['error' => 'Orden de pago no encontrada'], 404);
    }

    if (is_null($ordenPago->orden_pago_url)) {
        return response()->json(['error' => 'Aún no existe una orden de pago generada.'], 400);
    }

    $path = storage_path("app/public/" . $ordenPago->orden_pago_url);

    if (!file_exists($path)) {
        return response()->json(['error' => 'El archivo de la orden de pago no fue encontrado'], 404);
    }

    return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => "attachment; filename=orden_pago_{$codigo}.pdf",
    ]);
}

public function verificarCodigo(Request $request)
    {
    
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);

    
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();

        if (!$ordenPago) {
            return response()->json(['message' => 'Código generado no encontrado. No se puede proceder.'], 404);
        }

      
        if ($ordenPago->orden_pago_url === null) {
            return response()->json(['message' => 'Genere una orden de pago.'], 400);
        }

       
        $comprobante = comprobantes_pago::where('id_orden_pago', $ordenPago->id)->first();
        if ($comprobante) {
            return response()->json([
                'message' => 'Este comprobante ya fue registrado previamente. No puede continuar.'
            ], 400);
        }

        return response()->json(['message' => 'Código generado válido, puedes continuar con la subida de la imagen.'], 200);
    }

    public function procesarComprobante(Request $request)
    {
        $validated = $request->validate([
            'comprobante_numero' => 'required|image|mimes:jpg,png,jpeg|max:5120',
            'comprobante_nombre' => 'required|image|mimes:jpg,png,jpeg|max:5120',
            'fecha_comprobante' => 'required|image|mimes:jpg,png,jpeg|max:5120',
        ]);
    
        // Obtener imágenes
        $imagenComprobante = $request->file('comprobante_numero');
        $imagenNombre = $request->file('comprobante_nombre');
        $imagenFecha = $request->file('fecha_comprobante');
    
        // Crear carpeta de depuración si no existe
        $debugDir = storage_path('app/public/debug_ocr');
        if (!file_exists($debugDir)) {
            mkdir($debugDir, 0755, true);
        }
    
        $rutaComprobante = $imagenComprobante->getRealPath();
        $rutaNombre = $imagenNombre->getRealPath();
        $rutaFecha = $imagenFecha->getRealPath();
    
        $numeroComprobante = '';
        $nombrePagador = '';
        $fechaComprobante = '';
    
        try {
            $numeroComprobante = (new TesseractOCR($rutaComprobante))
                ->lang('spa')
                ->run();
        } catch (UnsuccessfulCommandException $e) {
            $imagenComprobante->move($debugDir, 'comprobante_error.jpg');
            Log::error('OCR falló para comprobante_numero: ' . $e->getMessage());
        }
    
        try {
            $nombrePagador = (new TesseractOCR($rutaNombre))
                ->lang('spa')
                ->run();
        } catch (UnsuccessfulCommandException $e) {
            $imagenNombre->move($debugDir, 'nombre_error.jpg');
            Log::error('OCR falló para comprobante_nombre: ' . $e->getMessage());
        }
    
        try {
            $fechaComprobante = (new TesseractOCR($rutaFecha))
                ->lang('spa')
                ->run();
        } catch (UnsuccessfulCommandException $e) {
            $imagenFecha->move($debugDir, 'fecha_error.jpg');
            Log::error('OCR falló para fecha_comprobante: ' . $e->getMessage());
        }
    
        return response()->json([
            'numero_comprobante' => $numeroComprobante ?: 'No se pudo extraer',
            'nombre_pagador' => $nombrePagador ?: 'No se pudo extraer',
            'fecha_comprobante' => $fechaComprobante ?: 'No se pudo extraer',
        ]);
    }

    /**
     * Obtiene la orden de pago por su código generado
     */
    public function obtenerOrdenPagoPorCodigo($codigo)
    {
        $ordenPago = OrdenPago::where('codigo_generado', $codigo)->first();
        
        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado'], 404);
        }
        
        return response()->json($ordenPago);
    }

    public function obtenerResumenPorCodigo($codigo)
{
    // Buscar la orden de pago con todas las relaciones necesarias
    $ordenPago = OrdenPago::with([
        'responsable', // El responsable está en la tabla orden_pago
        'inscripcion.estudiante.grado',
        'inscripcion.olimpiadaAreaCategoria.categoria',
        'inscripcion.olimpiadaAreaCategoria.area'
    ])->where('codigo_generado', $codigo)->first();

    if (!$ordenPago) {
        return response()->json([
            'success' => false,
            'message' => 'No se encontró una orden de pago con ese código.'
        ], 404);
    }

    $inscripciones = $ordenPago->inscripcion;

    if ($inscripciones->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No se encontraron inscripciones asociadas a esta orden de pago.'
        ], 404);
    }

    $totalInscritos = $inscripciones->count();
    $totalAreas = 0;
    $datosInscritos = [];

    foreach ($inscripciones as $inscripcion) {
        $estudiante = $inscripcion->estudiante;
        $grado = $estudiante->grado->nombre_grado ?? null;

        $categoria = $inscripcion->olimpiadaAreaCategoria->categoria->nombre_categoria ?? null;
        $area = $inscripcion->olimpiadaAreaCategoria->area->nombre_area ?? null;

        $datosInscritos[] = [
            'nombre_estudiante' => "{$estudiante->nombre} {$estudiante->apellido_pa} {$estudiante->apellido_ma}",
            'area' => $area,
            'categoria' => $categoria,
            'grado' => $grado
        ];

        if ($area) {
            $totalAreas++;
        }
    }

    // Obtener el responsable desde la tabla orden_pago
    $responsable = $ordenPago->responsable;
    $nombreCompleto = trim(
        ($responsable->nombre ?? '') . ' ' . 
        ($responsable->apellido_pa ?? '') . ' ' . 
        ($responsable->apellido_ma ?? '')
    );

    return response()->json([
        'success' => true,
        'message' => 'Resumen generado correctamente.',
        'resumen' => [
            'codigo_generado' => $codigo,
            'responsable' => [
                'nombre' => $nombreCompleto,
                'ci' => $responsable->ci ?? null,
            ],
            'total_inscritos' => $totalInscritos,
            'total_areas' => $totalAreas,
            'inscritos' => $datosInscritos
        ]
    ]);
}

    
    

    
    public function obtenerOrdenPago(){
    $ordenesPago = OrdenPago::all();
    return response()->json($ordenesPago);
    }

    public function obtenerOrdenesConResponsable(){
        try {
            //calcular la fecha de hace 7 días
            $fechaLimite = now()->subDays(7);
            
            $ordenesPago = OrdenPago::where('fecha_emision', '>=', $fechaLimite)
                ->orderBy('fecha_emision', 'desc')
                ->get();
                
            $resultado = [];
            
            foreach ($ordenesPago as $orden) {
                $inscripcion = InscripcionModel::where('id_orden_pago', $orden->id)
                    ->with('responsable')
                    ->first();
                    
                $responsable = $inscripcion ? $inscripcion->responsable : null;
                
                $nombreResponsable = 'No disponible';
                if ($responsable) {
                    $nombreResponsable = trim(
                        ($responsable->nombre ?? '') . ' ' .
                        ($responsable->apellido_pa ?? '') . ' ' .
                        ($responsable->apellido_ma ?? '')
                    );
                }
                
                $fecha = $orden->fecha_emision ? 
                    date('d M Y', strtotime($orden->fecha_emision)) : 
                    'Fecha no disponible';
                    
                $resultado[] = [
                    'id' => $orden->codigo_generado,
                    'responsable' => $nombreResponsable,
                    'fecha' => $fecha,
                    'monto' => $orden->monto_total,
                    'estado' => $orden->numero_comprobante ? 'pagado' : 'pendiente'
                ];
            }
                
            return response()->json($resultado);
            
        } catch (\Exception $e) {
            \Log::error('Error en obtenerOrdenesConResponsable: ' . $e->getMessage());
            return response()->json(['error' => 'Error al procesar la solicitud'], 500);
        }
    }



    public function getInfOrdenesDePago()
    {
        try {
            $ordenesDePago = DB::table('inscripcion')
                ->join('responsable_inscripcion', 'inscripcion.id_responsable', '=', 'responsable_inscripcion.id')
                ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
                ->select(
                    'orden_pagos.codigo_generado',
                    'orden_pagos.monto_total',
                    'responsable_inscripcion.apellido_pa as apellido_paterno',
                    'responsable_inscripcion.apellido_ma as apellido_materno',
                    'responsable_inscripcion.nombre as nombre',
                    'responsable_inscripcion.ci as carnet_identidad',
                    DB::raw("CASE WHEN orden_pagos.comprobante_url IS NULL THEN false ELSE true END as estado_pago")
                )
                ->groupBy(
                    'orden_pagos.codigo_generado',
                    'orden_pagos.monto_total',
                    'responsable_inscripcion.apellido_pa',
                    'responsable_inscripcion.apellido_ma',
                    'responsable_inscripcion.nombre',
                    'responsable_inscripcion.ci',
                    'orden_pagos.comprobante_url'
                )
                ->get();
    
            return response()->json([
                'ordenes' => $ordenesDePago
            ]);            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al procesar la solicitud getInfOrdenesDePago'], 500);
        }
    }

    public function ordenPagoExiste($codigo)
    {
        $ordenPago = OrdenPago::where('codigo_generado', $codigo)->first();
    
        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado'], 404);
        }
    
        $existe = !empty($ordenPago->orden_pago_url); 
    
        return response()->json(['existe' => $existe]);
    }
    
    public function dineroRecaudadoPorDepartamento()
    {
        // Subconsulta: obtener sumatoria total por departamento (con montos únicos)
        $subquery = DB::table('orden_pagos')
            ->whereNull('orden_pagos.numero_comprobante')
            ->join('inscripcion', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
            ->join('estudiante', 'estudiante.id', '=', 'inscripcion.id_estudiante')
            ->join('colegio', 'colegio.id', '=', 'estudiante.id_unidad')
            ->groupBy('colegio.departamento')
            ->select('colegio.departamento', DB::raw('SUM(DISTINCT orden_pagos.monto_total) as monto_total'));
    
        // Consulta principal: mostrar todos los departamentos con su total o cero
        $resultados = DB::table('colegio')
            ->select('colegio.departamento', DB::raw('COALESCE(t.monto_total, 0) as total_recaudado'))
            ->leftJoinSub($subquery, 't', 'colegio.departamento', '=', 't.departamento')
            ->groupBy('colegio.departamento', 't.monto_total')
            ->orderBy('colegio.departamento')
            ->get();
    
        return response()->json($resultados);
    }

}
