<?php

namespace App\Http\Controllers;

use App\Models\OrdenPago;
use App\Models\Inscripcion\InscripcionModel;
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
    public function generarCodigoUnico()
    {
        $letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $year = date('Y');
        $codigo = '';
        
        do {
            $codigoLetras = '';
            for ($i = 0; $i < 6; $i++) {
                $codigoLetras .= $letras[rand(0, 25)];
            }
            
            $codigo = "TSOL-{$year}-{$codigoLetras}";
        
            // Verificar que el código no exista ya en la base de datos
            $existe = OrdenPago::where('codigo_generado', $codigo)->exists();
        } while ($existe);
        
        return $codigo;
    }

    public function descargarOrdenPago(Request $request)
    {
        // Validar que el ID de la orden de pago esté presente
        $validated = $request->validate([
            'codigo_generado' => 'required|string|max:255',
        ]);

        // Obtener la orden de pago
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();

        // Obtener la inscripción asociada por el ID de la orden de pago
        $inscripcion = InscripcionModel::where('id_orden_pago', $ordenPago->id)->first();

        // Generar el PDF utilizando DomPDF
        $pdf = Pdf::loadView('pdf.orden_pago', [
            'ordenPago' => $ordenPago,
            'inscripcion' => $inscripcion,
        ]);
        // Retornar el PDF como respuesta
        return $pdf->download('orden_pago.pdf');
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
