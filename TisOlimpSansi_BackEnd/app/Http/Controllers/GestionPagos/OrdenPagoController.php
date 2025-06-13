<?php

namespace App\Http\Controllers\GestionPagos;

use App\Http\Controllers\Controller;
use App\Models\GestionPagos\OrdenPagoModel;

use App\Models\Inscripcion\InscripcionModel;

use Illuminate\Http\Request;

use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\GestionPagos\ComprobantePagoModel
;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\DB;

class OrdenPagoController extends Controller
{

  public function generarYGuardarOrdenPagoPDF(Request $request) 
{
    $debugLog = storage_path('logs/pdf_debug.log');
    
    try {
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);

        $ordenPago = OrdenPagoModel::where('codigo_generado', $validated['codigo_generado'])->first();
        if (!$ordenPago) {
            return response()->json(['message' => 'Orden de pago no encontrada'], 404);
        }

        if (empty($ordenPago->numero_orden_pago)) {
            $ordenPago->numero_orden_pago = $this->generarNumeroOrdenSecuencial();
            $ordenPago->save();
        }
        
        $inscripcion = InscripcionModel::where('id_orden_pago', $ordenPago->id)->first();
        if (!$inscripcion) {
            return response()->json(['message' => 'Inscripción no encontrada'], 404);
        }
        
        $publicPath = public_path();
        $basePath = base_path();
        
        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('tempDir', sys_get_temp_dir());
        $options->set('fontDir', storage_path('fonts/'));
        $options->set('fontCache', storage_path('fonts/'));
        $options->set('chroot', [$publicPath, $basePath, storage_path()]);
        
        $storagePath = storage_path('app/public');
        $ordenesPath = $storagePath . '/ordenes_pago';
      
        if (!is_dir(storage_path('app'))) {
            $created = mkdir(storage_path('app'), 0755, true);
        }
        
        if (!is_dir($storagePath)) {
            $created = mkdir($storagePath, 0755, true);
        }
        
        if (!is_dir($ordenesPath)) {
            $created = mkdir($ordenesPath, 0755, true);
        }
        
        if (!is_dir(storage_path('fonts'))) {
            $created = mkdir(storage_path('fonts'), 0755, true);
        }
       
        if (!view()->exists('pdf.orden_pago')) {
            return response()->json(['message' => 'Vista PDF no encontrada'], 500);
        }
    
        try {
            ini_set('memory_limit', '512M');
            ini_set('max_execution_time', 300);
            
            try {
                $html = view('pdf.orden_pago', [
                    'ordenPago' => $ordenPago,
                    'inscripcion' => $inscripcion,
                ])->render();
                
                $dompdf = new \Dompdf\Dompdf($options);
                $dompdf->loadHtml($html);
                $dompdf->setPaper('A4', 'portrait');
                $dompdf->render();
                
                $pdfContent = $dompdf->output();
                
            } catch (\Exception $directError) {
                $pdf = Pdf::setOptions($options->getOptions())
                    ->loadView('pdf.orden_pago', [
                        'ordenPago' => $ordenPago,
                        'inscripcion' => $inscripcion,
                    ]);
                
                $pdfContent = $pdf->output();
            }
            
            if (strlen($pdfContent) == 0) {
                throw new \Exception("PDF generado está vacío");
            }
            
        } catch (\Exception $pdfError) {
            return response()->json(['message' => 'Error generando PDF: ' . $pdfError->getMessage()], 500);
        }
        
        $fileName = 'orden_pago_' . $ordenPago->codigo_generado . '.pdf';
        $filePath = 'ordenes_pago/' . $fileName;
        $fullPath = $ordenesPath . '/' . $fileName;
        
        try {
            $result = file_put_contents($fullPath, $pdfContent);
            
            if ($result === false) {
                throw new \Exception("file_put_contents retornó false");
            }
            
            if (!file_exists($fullPath)) {
                throw new \Exception("El archivo no existe después de guardarlo");
            }
            
            $fileSize = filesize($fullPath);
            
            if ($fileSize == 0) {
                throw new \Exception("El archivo guardado está vacío");
            }
            
        } catch (\Exception $saveError) {
            return response()->json(['message' => 'Error guardando PDF: ' . $saveError->getMessage()], 500);
        }
        
        $ordenPago->orden_pago_url = $filePath;
        $ordenPago->fecha_emision = now();
        $ordenPago->save();
        
        return response()->json([
            'message' => 'PDF generado y guardado exitosamente.',
            'orden_pago_url' => asset('storage/' . $filePath),
            'ordenPago' => $ordenPago,
            'debug_info' => [
                'file_path' => $filePath,
                'full_path' => $fullPath,
                'file_exists' => file_exists($fullPath),
                'file_size' => file_exists($fullPath) ? filesize($fullPath) : 0,
                'numero_orden_pago' => $ordenPago->numero_orden_pago,  
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error interno del servidor',
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
}


private function generarNumeroOrdenSecuencial()
{
    return DB::transaction(function () {
        $ultimaOrden = OrdenPagoModel::whereNotNull('numero_orden_pago')
                                    ->where('numero_orden_pago', '!=', '')
                                    ->orderBy('numero_orden_pago', 'desc')
                                    ->first();
        
        if (!$ultimaOrden) {
            $siguienteNumero = 1;
        } else {
            $ultimoNumero = (int) $ultimaOrden->numero_orden_pago;
            $siguienteNumero = $ultimoNumero + 1;
        }
        
        return str_pad($siguienteNumero, 8, '0', STR_PAD_LEFT);
    });
}
    
    public function descargarOrdenPago($codigo)
{
    $ordenPago = OrdenPagoModel::where('codigo_generado', $codigo)->first();

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

    
        $ordenPago = OrdenPagoModel::where('codigo_generado', $validated['codigo_generado'])->first();

        if (!$ordenPago) {
            return response()->json(['message' => 'Código generado no encontrado. No se puede proceder.'], 404);
        }

      
        if ($ordenPago->orden_pago_url === null) {
            return response()->json(['message' => 'Genere una orden de pago.'], 400);
        }

       
        $comprobante = ComprobantePagoModel::where('id_orden_pago', $ordenPago->id)->first();
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

   
    $imagenComprobante = $request->file('comprobante_numero');
    $imagenNombre = $request->file('comprobante_nombre');
    $imagenFecha = $request->file('fecha_comprobante');

  
    $debugDir = storage_path('app/public/debug_ocr');
    if (!file_exists($debugDir)) {
        mkdir($debugDir, 0755, true);
    }

    $apiKey = 'K86708130088957'; 
    $client = new Client();

    $ocrRequest = function($uploadedFile) use ($client, $apiKey, $debugDir) {
        try {
            if (!$uploadedFile || !$uploadedFile->isValid()) {
                Log::error('Archivo no válido o no existe');
                return 'Archivo no válido';
            }

            $originalName = $uploadedFile->getClientOriginalName();
            $mimeType = $uploadedFile->getMimeType();
            $extension = $uploadedFile->getClientOriginalExtension();
            $tempPath = $uploadedFile->getRealPath();

      
            $validExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tif', 'tiff', 'webp'];
            if (!in_array(strtolower($extension), $validExtensions)) {
                Log::error('Extensión de archivo no válida: ' . $extension);
                return 'Extensión no válida';
            }

            $validMimeTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'image/tiff', 'image/webp'];
            if (!in_array(strtolower($mimeType), $validMimeTypes)) {
                Log::error('MIME type no válido: ' . $mimeType);
                return 'MIME type no válido';
            }

            if (!file_exists($tempPath)) {
                Log::error('Archivo temporal no encontrado: ' . $tempPath);
                return 'Archivo temporal no encontrado';
            }

            Log::info('Enviando archivo a OCR.space', [
                'originalName' => $originalName,
                'mimeType' => $mimeType,
                'extension' => $extension,
                'tempPath' => $tempPath,
                'fileSize' => filesize($tempPath)
            ]);

            $response = $client->post('https://api.ocr.space/parse/image', [
                'timeout' => 30, 
                'multipart' => [
                    [
                        'name' => 'apikey',
                        'contents' => $apiKey
                    ],
                    [
                        'name' => 'language',
                        'contents' => 'spa' 
                    ],
                    [
                        'name' => 'isOverlayRequired',
                        'contents' => 'false'
                    ],
                    [
                        'name' => 'file',
                        'contents' => fopen($tempPath, 'r'),
                        'filename' => $originalName,
                        'headers' => [
                            'Content-Type' => $mimeType
                        ]
                    ]
                ]
            ]);

          
            $body = json_decode($response->getBody()->getContents(), true);
            
          
            Log::info('Respuesta completa de OCR.space', $body);

            
            if (isset($body['ErrorMessage']) && !empty($body['ErrorMessage'])) {
                $errorMessages = is_array($body['ErrorMessage']) 
                    ? implode(', ', $body['ErrorMessage']) 
                    : $body['ErrorMessage'];
                Log::error('OCR Error Message: ' . $errorMessages);
                return 'OCR Error: ' . $errorMessages;
            }

            
            if (!isset($body['ParsedResults']) || empty($body['ParsedResults'])) {
                Log::error('No se encontraron resultados en la respuesta de OCR');
                return 'Sin resultados de OCR';
            }

            
            $parsedText = $body['ParsedResults'][0]['ParsedText'] ?? '';
            
            if (empty($parsedText)) {
                Log::warning('Texto extraído está vacío');
                return 'Texto no detectado';
            }

            
            $cleanText = trim($parsedText);
            
            Log::info('Texto extraído exitosamente', ['text' => $cleanText]);
            
            return $cleanText;

        } catch (\Exception $e) {
            Log::error('Error en OCR Request', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return 'Error OCR: ' . $e->getMessage();
        }
    };

    $numeroComprobante = $ocrRequest($imagenComprobante);
    if (strpos($numeroComprobante, 'Error') !== false || strpos($numeroComprobante, 'no válido') !== false) {
        try {
            $imagenComprobante->move($debugDir, 'comprobante_error_' . time() . '.jpg');
        } catch (\Exception $e) {
            Log::error('No se pudo guardar imagen de error: ' . $e->getMessage());
        }
    }

    $nombrePagador = $ocrRequest($imagenNombre);
    if (strpos($nombrePagador, 'Error') !== false || strpos($nombrePagador, 'no válido') !== false) {
        try {
            $imagenNombre->move($debugDir, 'nombre_error_' . time() . '.jpg');
        } catch (\Exception $e) {
            Log::error('No se pudo guardar imagen de error: ' . $e->getMessage());
        }
    }

    $fechaComprobante = $ocrRequest($imagenFecha);
    if (strpos($fechaComprobante, 'Error') !== false || strpos($fechaComprobante, 'no válido') !== false) {
        try {
            $imagenFecha->move($debugDir, 'fecha_error_' . time() . '.jpg');
        } catch (\Exception $e) {
            Log::error('No se pudo guardar imagen de error: ' . $e->getMessage());
        }
    }

    return response()->json([
        'success' => true,
        'numero_comprobante' => $numeroComprobante,
        'nombre_pagador' => $nombrePagador,
        'fecha_comprobante' => $fechaComprobante,
    ]);
}

    /**
     * Obtiene la orden de pago por su código generado
     */
    public function obtenerOrdenPagoPorCodigo($codigo)
    {
        $ordenPago = OrdenPagoModel::where('codigo_generado', $codigo)->first();
        
        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado'], 404);
        }
        
        return response()->json($ordenPago);
    }

    public function obtenerResumenPorCodigo($codigo)
{
    $ordenPago = OrdenPagoModel::with([
        'responsable', 
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
    $ordenesPago = OrdenPagoModel::all();
    return response()->json($ordenesPago);
    }

    public function obtenerOrdenesConResponsable(Request $request)
    {
        try {
            $olimpiadaId = $request->query('olimpiada_id');
            
            if (!$olimpiadaId) {
                return response()->json(['error' => 'olimpiada_id es requerido'], 400);
            }
            
         
            $ordenesPago = OrdenPagoModel::with([
                    'responsable', 
                    'comprobantePago', 
                    'inscripcion' 
                ])
                ->whereHas('inscripcion', function($query) use ($olimpiadaId) {
                    $query->whereHas('olimpiadaAreaCategoria', function($subQuery) use ($olimpiadaId) {
                        $subQuery->where('id_olimpiada', $olimpiadaId);
                    });
                })
                
                ->orderBy('fecha_emision', 'desc')
                ->get();
            
            $resultado = $ordenesPago->map(function($orden) {
                $responsable = $orden->responsable;
                
                $nombreResponsable = 'No disponible';
                if ($responsable) {
                    $nombreResponsable = trim(
                        ($responsable->nombre ?? '') . ' ' .
                        ($responsable->apellido_pa ?? '') . ' ' .
                        ($responsable->apellido_ma ?? '')
                    );
                }
                
                $fecha = $orden->fecha_emision;
                
                $estado = $orden->estado;
                
                return [
                    'id' => $orden->codigo_generado,
                    'responsable' => $nombreResponsable,
                    'fecha' => $fecha,
                    'monto' => number_format($orden->monto_total, 2),
                    'estado' => $estado
                ];
            });
            
            return response()->json($resultado->toArray());
            
        } catch (\Exception $e) {
            \Log::error('Error en obtenerOrdenesConResponsable: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al procesar la solicitud', 
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function getInfOrdenesDePago()
    {
        try {
            $ordenesDePago = DB::table('inscripcion')
                ->join('responsable_inscripcion', 'inscripcion.id_responsable', '=', 'responsable_inscripcion.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->select(
                    'orden_pago.codigo_generado',
                    'orden_pago.monto_total',
                    'responsable_inscripcion.apellido_pa as apellido_paterno',
                    'responsable_inscripcion.apellido_ma as apellido_materno',
                    'responsable_inscripcion.nombre as nombre',
                    'responsable_inscripcion.ci as carnet_identidad',
                    DB::raw("CASE WHEN orden_pago.comprobante_url IS NULL THEN false ELSE true END as estado_pago")
                )
                ->groupBy(
                    'orden_pago.codigo_generado',
                    'orden_pago.monto_total',
                    'responsable_inscripcion.apellido_pa',
                    'responsable_inscripcion.apellido_ma',
                    'responsable_inscripcion.nombre',
                    'responsable_inscripcion.ci',
                    'orden_pago.comprobante_url'
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
        $ordenPago = OrdenPagoModel::where('codigo_generado', $codigo)->first();
    
        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado'], 404);
        }
    
        $existe = !empty($ordenPago->orden_pago_url); 
    
        return response()->json(['existe' => $existe]);
    }
    
    public function dineroRecaudadoPorDepartamento()
    {
        $subquery = DB::table('orden_pago')
            ->whereNull('orden_pago.numero_comprobante')
            ->join('inscripcion', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
            ->join('estudiante', 'estudiante.id', '=', 'inscripcion.id_estudiante')
            ->join('colegio', 'colegio.id', '=', 'estudiante.id_unidad')
            ->groupBy('colegio.departamento')
            ->select('colegio.departamento', DB::raw('SUM(DISTINCT orden_pago.monto_total) as monto_total'));
    
        $resultados = DB::table('colegio')
            ->select('colegio.departamento', DB::raw('COALESCE(t.monto_total, 0) as total_recaudado'))
            ->leftJoinSub($subquery, 't', 'colegio.departamento', '=', 't.departamento')
            ->groupBy('colegio.departamento', 't.monto_total')
            ->orderBy('colegio.departamento')
            ->get();
    
        return response()->json($resultados);
    }


 public function obtenerIdOlimpiada($codigo)
{
    try {
        $ordenPago = OrdenPagoModel::with(['inscripcion.olimpiadaAreaCategoria'])
            ->where('codigo_generado', $codigo)
            ->first();

        if (!$ordenPago) {
            return response()->json(['message' => 'No se encontró la orden de pago con el código proporcionado'], 404);
        }

        if ($ordenPago->inscripcion->isEmpty()) {
            return response()->json(['message' => 'No se encontraron inscripciones para esta orden de pago'], 404);
        }

        $idOlimpiada = $ordenPago->inscripcion->first()->olimpiadaAreaCategoria->id_olimpiada;

        return response()->json(['id_olimpiada' => $idOlimpiada]);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error interno del servidor', 'error' => $e->getMessage()], 500);
    }
}
    public function obtenerOrdenPagoPorOlimpiada(Request $request)
    {
        $olimpiadaId = $request->input('olimpiada_id');
        
        if (!$olimpiadaId) {
            return response()->json(['error' => 'ID de olimpiada requerido'], 400);
        }

        try {
            $ordenes = DB::table('orden_pago')
                ->join('inscripcion', 'orden_pago.id', '=', 'inscripcion.id_orden_pago')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->leftJoin('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->select(
                    'orden_pago.*',
                    'comprobante_pago.numero_comprobante',
                    'comprobante_pago.nombre_pagador',
                    'comprobante_pago.fecha_subida_imagen_comprobante'
                )
                ->distinct('orden_pago.id')
                ->get();

            return response()->json($ordenes);
        } catch (\Exception $e) {
            \Log::error('Error al obtener órdenes de pago por olimpiada: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function obtenerOrdenPago2()
    {
        try {
            $ordenesPago = OrdenPagoModel::all();
            return response()->json($ordenesPago);
        } catch (\Exception $e) {
            \Log::error('Error al obtener órdenes de pago: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

public function obtenerNombreResponsable(Request $request)
{
    $validated = $request->validate([
        'codigo_generado' => 'required|string|max:255',
    ]);

    $ordenPago = OrdenPagoModel::with('responsable')->where('codigo_generado', $validated['codigo_generado'])->first();

    if (!$ordenPago) {
        return response()->json(['message' => 'Código generado no encontrado.'], 404);
    }

    $responsable = $ordenPago->responsable;
    $nombreCompleto = trim(
        ($responsable->nombre ?? '') . ' ' . 
        ($responsable->apellido_pa ?? '') . ' ' . 
        ($responsable->apellido_ma ?? '')
    );

    return response()->json([
        'nombre_responsable' => $nombreCompleto,
        'ci_responsable' => $responsable->ci ?? null
    ]);
}

}