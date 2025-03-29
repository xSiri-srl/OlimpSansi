<?php

namespace App\Http\Controllers;

use App\Models\OrdenPago;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;

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

        return response()->json(['message' => 'Código generado válido, puedes continuar con la subida de la imagen.'], 200);
    }

    public function procesarComprobante(Request $request)
    {
        
        
        $validated = $request->validate([
            'comprobante' => 'required|image|mimes:jpg,png,jpeg|max:2048',
            'codigo_generado' => 'required|string|max:255', // Asegurarse de que el código se pase
        ]);

        // Subir la imagen
        $imagen = $request->file('comprobante');
        $rutaImagen = $imagen->store('comprobantes', 'public'); // Guardar la imagen temporalmente

        
        $numeroComprobante = (new TesseractOCR(storage_path('app/public/' . $rutaImagen)))
            ->lang('eng') 
            ->run();

        // Mostrar el número extraído y la imagen para que el usuario lo confirme
        return response()->json([
            'numero_comprobante' => $numeroComprobante,
            'comprobante_path' => $rutaImagen, // Retornar la ruta de la imagen
            'codigo_generado' => $validated['codigo_generado'], // Enviar el código para el paso de confirmación
        ]);
    }


    public function guardarComprobante(Request $request)
    {
        $validated = $request->validate([
            'numero_comprobante' => 'required|string',
            'codigo_generado' => 'required|string',
            'comprobante_path' => 'required|string', // La ruta de la imagen
        ]);
        
        
        $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();
        
        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado.'], 404);
        }
        
        // Actualizar los datos del comprobante
        $ordenPago->numero_comprobante = $validated['numero_comprobante'];
        $ordenPago->comprobante_url = $validated['comprobante_path'];
        $ordenPago->fecha_subida_imagen_comprobante = now(); 
        return response()->json(['message' => 'Se ha guardado correctamente.'], 200);
        $ordenPago->save(); 
    
        return response()->json([
            'message' => 'Comprobante guardado exitosamente',
            'ordenPago' => $ordenPago
        ]);
    }
}
