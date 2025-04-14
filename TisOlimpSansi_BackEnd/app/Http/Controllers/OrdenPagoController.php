<?php

namespace App\Http\Controllers;

use App\Models\OrdenPago;
use Illuminate\Support\Facades\Storage;
use App\Models\Inscripcion\InscripcionModel;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Barryvdh\DomPDF\Facade\Pdf;



use Illuminate\Support\Facades\Log;

use thiagoalessio\TesseractOCR\UnsuccessfulCommandException;
class OrdenPagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(OrdenPago $ordenPago)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrdenPago $ordenPago)
    {

    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrdenPago $ordenPago)
    {
        //
    }

    /**
     * Genera un código único con formato TSOL-YYYY-XXXXXX donde XXXXXX son 6 letras mayúsculas
     * 
     * @return string
     */
    
    public function generarYGuardarOrdenPagoPDF(Request $request)
    {
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);
    
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();
        if (!$ordenPago) {
            Log::error("Orden de pago no encontrada para el código: {$validated['codigo_generado']}");
            return response()->json(['message' => 'Orden de pago no encontrada'], 404);
        }
    
        $inscripcion = InscripcionModel::where('id_orden_pago', $ordenPago->id)->first();
        if (!$inscripcion) {
            Log::error("Inscripción no encontrada para la orden de pago con código: {$ordenPago->codigo_generado}");
            return response()->json(['message' => 'Inscripción no encontrada para esta orden de pago'], 404);
        }
    
        Log::info("Generando PDF para la orden de pago: {$ordenPago->codigo_generado}");
        // Generar el PDF con la vista 'pdf.orden_pago'
        $pdf = Pdf::loadView('pdf.orden_pago', [
            'ordenPago' => $ordenPago,
            'inscripcion' => $inscripcion,
        ]);
    
        Log::info("PDF generado correctamente.");
    
        // Generar el nombre y guardar el PDF en disco
        $fileName = 'orden_pago_' . $ordenPago->codigo_generado . '.pdf';
        $filePath = 'ordenes_pago/' . $fileName;
    
        Log::info("Guardando PDF en: {$filePath}");
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
        $filename = "ordenes_pago/orden_pago_{$codigo}.pdf";

        if (!Storage::disk('public')->exists($filename)) {
            return response()->json(['error' => 'Archivo no encontrado'], 404);
        }

        $path = storage_path("app/public/" . $filename);

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=orden_pago_{$codigo}.pdf",
        ]);
    }

    public function verificarCodigo(Request $request)
    {
        // Validar que el código generado no esté vacío
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);

        // Verificar si el código generado ya existe en la base de datos
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();

        if (!$ordenPago) {
            return response()->json(['message' => 'Código generado no encontrado. No se puede proceder.'], 404);
        }

        if (!is_null($ordenPago->numero_comprobante)) {
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
        ]);
    
        // Obtener imágenes
        $imagenComprobante = $request->file('comprobante_numero');
        $imagenNombre = $request->file('comprobante_nombre');
    
        // Guardar imágenes para depuración (solo si falla)
        $debugDir = storage_path('app/public/debug_ocr');
        if (!file_exists($debugDir)) {
            mkdir($debugDir, 0755, true);
        }
    
        $rutaComprobante = $imagenComprobante->getRealPath();
        $rutaNombre = $imagenNombre->getRealPath();
    
        $numeroComprobante = '';
        $nombrePagador = '';
    
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
    
        return response()->json([
            'numero_comprobante' => $numeroComprobante ?: 'No se pudo extraer',
            'nombre_pagador' => $nombrePagador ?: 'No se pudo extraer',
        ]);
    }


    public function guardarComprobante(Request $request)
    {
        $validated = $request->validate([
            'numero_comprobante' => 'required|string',
            'codigo_generado' => 'required|string',
            'comprobante' => 'required|image|mimes:jpg,png,jpeg|max:5120', 
        ]);
    
        // Obtener el archivo de la imagen subido
        $imagen = $request->file('comprobante');
        
        // Subir la imagen a una carpeta pública 'comprobantes' y obtener la ruta de almacenamiento
        $comprobantePath = $imagen->store('comprobantes', 'public'); 
    
        // Buscar la orden de pago correspondiente con el código generado
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();
    
        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado.'], 404);
        }
    
        // Actualizar los datos del comprobante
        $ordenPago->numero_comprobante = $validated['numero_comprobante'];
        $ordenPago->comprobante_url = $comprobantePath; 
        $ordenPago->fecha_subida_imagen_comprobante = now(); 
        $ordenPago->save(); 
    
        // Retornar la respuesta indicando éxito
        return response()->json([
            'message' => 'Comprobante guardado exitosamente',
            'ordenPago' => $ordenPago
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

}
