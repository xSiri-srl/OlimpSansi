<?php

namespace App\Http\Controllers;
use App\Models\OrdenPago;

use App\Models\Inscripcion\InscripcionModel;

use Illuminate\Http\Request;

use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\comprobantes_pago;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\DB;

class OrdenPagoController extends Controller
{

  public function generarYGuardarOrdenPagoPDF(Request $request) 
{
    // Crear archivo de log específico
    $debugLog = storage_path('logs/pdf_debug.log');
    
    // Función helper para escribir logs
    $writeLog = function($message) use ($debugLog) {
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($debugLog, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
    };
    
    try {
        $writeLog("=== INICIO DEBUG SERVIDOR ===");
        
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);
        
        $writeLog("Validación OK - Código: " . $validated['codigo_generado']);
        $writeLog("PHP Version: " . phpversion());
        $writeLog("Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'));
        $writeLog("Memory Limit: " . ini_get('memory_limit'));
        $writeLog("Max Execution Time: " . ini_get('max_execution_time'));
        
        // Verificar extensiones necesarias
        $writeLog("DOM Extension: " . (extension_loaded('dom') ? 'OK' : 'NO'));
        $writeLog("GD Extension: " . (extension_loaded('gd') ? 'OK' : 'NO'));
        $writeLog("MBString Extension: " . (extension_loaded('mbstring') ? 'OK' : 'NO'));
        
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();
        if (!$ordenPago) {
            $writeLog("ERROR: Orden de pago no encontrada");
            return response()->json(['message' => 'Orden de pago no encontrada'], 404);
        }
        
        $writeLog("Orden de pago encontrada - ID: " . $ordenPago->id);
        
        $inscripcion = InscripcionModel::where('id_orden_pago', $ordenPago->id)->first();
        if (!$inscripcion) {
            $writeLog("ERROR: Inscripción no encontrada");
            return response()->json(['message' => 'Inscripción no encontrada'], 404);
        }
        
        $writeLog("Inscripción encontrada - ID: " . $inscripcion->id);
        
        // === VERIFICAR Y CREAR ESTRUCTURA DE DIRECTORIOS ===
        $storagePath = storage_path('app/public');
        $ordenesPath = $storagePath . '/ordenes_pago';
        
        $writeLog("Storage path: " . $storagePath);
        $writeLog("Ordenes path: " . $ordenesPath);
        $writeLog("Current working directory: " . getcwd());
        $writeLog("Base path: " . base_path());
        
        // Verificar rutas absolutas
        $writeLog("Storage path exists: " . (is_dir($storagePath) ? 'YES' : 'NO'));
        $writeLog("Storage path readable: " . (is_readable($storagePath) ? 'YES' : 'NO'));
        $writeLog("Storage path writable: " . (is_writable($storagePath) ? 'YES' : 'NO'));
        
        // Crear storage/app si no existe
        if (!is_dir(storage_path('app'))) {
            $created = mkdir(storage_path('app'), 0755, true);
            $writeLog("Creando storage/app: " . ($created ? 'OK' : 'FALLÓ'));
        }
        
        // Crear storage/app/public si no existe
        if (!is_dir($storagePath)) {
            $created = mkdir($storagePath, 0755, true);
            $writeLog("Creando storage/app/public: " . ($created ? 'OK' : 'FALLÓ'));
        }
        
        // Crear ordenes_pago si no existe
        if (!is_dir($ordenesPath)) {
            $created = mkdir($ordenesPath, 0755, true);
            $writeLog("Creando ordenes_pago: " . ($created ? 'OK' : 'FALLÓ'));
        }
        
        // Verificar permisos finales
        $writeLog("Final - Storage writable: " . (is_writable($storagePath) ? 'YES' : 'NO'));
        $writeLog("Final - Ordenes writable: " . (is_writable($ordenesPath) ? 'YES' : 'NO'));
        
        // === VERIFICAR VISTA ===
        $writeLog("Verificando vista pdf.orden_pago...");
        if (!view()->exists('pdf.orden_pago')) {
            $writeLog("ERROR: Vista pdf.orden_pago no encontrada");
            return response()->json(['message' => 'Vista PDF no encontrada'], 500);
        }
        $writeLog("Vista encontrada OK");
        
        // === GENERAR PDF ===
        $writeLog("Iniciando generación PDF...");
        
        try {
            // Aumentar límites
            ini_set('memory_limit', '512M');
            ini_set('max_execution_time', 300);
            
            $writeLog("Límites aumentados - Memory: " . ini_get('memory_limit') . " Time: " . ini_get('max_execution_time'));
            
            $pdf = Pdf::loadView('pdf.orden_pago', [
                'ordenPago' => $ordenPago,
                'inscripcion' => $inscripcion,
            ]);
            
            $writeLog("PDF objeto creado exitosamente");
            
            // Verificar que el PDF se puede generar
            $pdfContent = $pdf->output();
            $writeLog("PDF content generado - Tamaño: " . strlen($pdfContent) . " bytes");
            
            if (strlen($pdfContent) == 0) {
                throw new \Exception("PDF generado está vacío");
            }
            
        } catch (\Exception $pdfError) {
            $writeLog("ERROR generando PDF: " . $pdfError->getMessage());
            $writeLog("PDF Error File: " . $pdfError->getFile());
            $writeLog("PDF Error Line: " . $pdfError->getLine());
            return response()->json(['message' => 'Error generando PDF: ' . $pdfError->getMessage()], 500);
        }
        
        // === GUARDAR ARCHIVO ===
        $fileName = 'orden_pago_' . $ordenPago->codigo_generado . '.pdf';
        $filePath = 'ordenes_pago/' . $fileName;
        $fullPath = $ordenesPath . '/' . $fileName;
        
        $writeLog("Guardando archivo...");
        $writeLog("File name: " . $fileName);
        $writeLog("File path: " . $filePath);
        $writeLog("Full path: " . $fullPath);
        
        try {
            $result = file_put_contents($fullPath, $pdfContent);
            
            if ($result === false) {
                throw new \Exception("file_put_contents retornó false");
            }
            
            $writeLog("PDF guardado exitosamente. Bytes escritos: " . $result);
            
            // Verificar que el archivo existe
            if (!file_exists($fullPath)) {
                throw new \Exception("El archivo no existe después de guardarlo");
            }
            
            $fileSize = filesize($fullPath);
            $writeLog("Archivo verificado - Tamaño: " . $fileSize . " bytes");
            
            if ($fileSize == 0) {
                throw new \Exception("El archivo guardado está vacío");
            }
            
        } catch (\Exception $saveError) {
            $writeLog("ERROR guardando PDF: " . $saveError->getMessage());
            $writeLog("Save Error File: " . $saveError->getFile());
            $writeLog("Save Error Line: " . $saveError->getLine());
            return response()->json(['message' => 'Error guardando PDF: ' . $saveError->getMessage()], 500);
        }
        
        // === ACTUALIZAR BASE DE DATOS ===
        $writeLog("Actualizando base de datos...");
        $ordenPago->orden_pago_url = $filePath;
        $ordenPago->save();
        $writeLog("Base de datos actualizada");
        
        $writeLog("=== PDF PROCESO COMPLETADO EXITOSAMENTE ===");
        
        return response()->json([
            'message' => 'PDF generado y guardado exitosamente.',
            'orden_pago_url' => asset('storage/' . $filePath),
            'ordenPago' => $ordenPago,
            'debug_info' => [
                'file_path' => $filePath,
                'full_path' => $fullPath,
                'file_exists' => file_exists($fullPath),
                'file_size' => file_exists($fullPath) ? filesize($fullPath) : 0,
                'log_file' => $debugLog
            ]
        ]);
        
    } catch (\Exception $e) {
        $writeLog("=== ERROR GENERAL ===");
        $writeLog("Message: " . $e->getMessage());
        $writeLog("File: " . $e->getFile());
        $writeLog("Line: " . $e->getLine());
        $writeLog("Stack trace: " . $e->getTraceAsString());
        
        return response()->json([
            'message' => 'Error interno del servidor',
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'log_file' => $debugLog
        ], 500);
    }
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
            // Verificar que el archivo existe y es válido
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
                'timeout' => 30, // Aumentar timeout
                'multipart' => [
                    [
                        'name' => 'apikey',
                        'contents' => $apiKey
                    ],
                    [
                        'name' => 'language',
                        'contents' => 'spa' // Español
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

    // Procesar las imágenes
    $numeroComprobante = $ocrRequest($imagenComprobante);
    if (strpos($numeroComprobante, 'Error') !== false || strpos($numeroComprobante, 'no válido') !== false) {
        // Guardar imagen con error para depuración
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


 public function obtenerIdOlimpiada($codigo)
{
    try {
        // Buscar la orden de pago por código generado
        $ordenPago = OrdenPago::with(['inscripcion.olimpiadaAreaCategoria'])
            ->where('codigo_generado', $codigo)
            ->first();

        if (!$ordenPago) {
            return response()->json(['message' => 'No se encontró la orden de pago con el código proporcionado'], 404);
        }

        // Verificar que tenga al menos una inscripción
        if ($ordenPago->inscripcion->isEmpty()) {
            return response()->json(['message' => 'No se encontraron inscripciones para esta orden de pago'], 404);
        }

        // Obtener el id_olimpiada de la primera inscripción
        $idOlimpiada = $ordenPago->inscripcion->first()->olimpiadaAreaCategoria->id_olimpiada;

        return response()->json(['id_olimpiada' => $idOlimpiada]);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error interno del servidor', 'error' => $e->getMessage()], 500);
    }
}

}