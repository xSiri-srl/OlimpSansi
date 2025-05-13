<?php

namespace App\Http\Controllers;

use App\Models\OrdenPago;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;
use App\Models\comprobantes_pago;


class ComprobanteController extends Controller
{
public function guardarComprobante(Request $request)
{
    $validated = $request->validate([
        'numero_comprobante' => 'required|string',
        'codigo_generado' => 'required|string',
        'comprobante' => 'required|image|mimes:jpg,png,jpeg|max:5120',
        'nombre_pagador' => 'required|string',
    ]);

    $imagen = $request->file('comprobante');
    $comprobantePath = $imagen->store('comprobantes', 'public');

    $ordenPago = OrdenPago::where('codigo_generado', $validated['codigo_generado'])->first();

    if (!$ordenPago) {
        return response()->json(['message' => 'Código no encontrado.'], 404);
    }

    // Crear un nuevo comprobante relacionado a la orden de pago
    $comprobante = new comprobantes_pago();
    $comprobante->id_orden_pago = $ordenPago->id;
    $comprobante->numero_comprobante = $validated['numero_comprobante'];
    $comprobante->comprobante_url = $comprobantePath;
    $comprobante->fecha_subida_imagen_comprobante = now();
    $comprobante->nombre_pagador = $validated['nombre_pagador'];
    $comprobante->save();

    // Cambiar el estado de la orden de pago a 'pagado'
    $ordenPago->estado = 'pagado';
    $ordenPago->save();

    return response()->json([
        'message' => 'Comprobante guardado exitosamente',
        'comprobante' => $comprobante
    ]);
}

}
