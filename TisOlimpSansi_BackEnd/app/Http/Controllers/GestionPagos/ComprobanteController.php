<?php

namespace App\Http\Controllers\GestionPagos;

use App\Http\Controllers\Controller;
use App\Models\GestionPagos\OrdenPagoModel;
use Illuminate\Http\Request;
use App\Models\GestionPagos\ComprobantePagoModel
;


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

    $ordenPago = OrdenPagoModel::where('codigo_generado', $validated['codigo_generado'])->first();

    if (!$ordenPago) {
        return response()->json(['message' => 'Código no encontrado.'], 404);
    }

   
    $comprobante = new ComprobantePagoModel();
    $comprobante->id_orden_pago = $ordenPago->id;
    $comprobante->numero_comprobante = $validated['numero_comprobante'];
    $comprobante->comprobante_url = $comprobantePath;
    $comprobante->fecha_subida_imagen_comprobante = now();
    $comprobante->nombre_pagador = $validated['nombre_pagador'];
    $comprobante->save();

    $ordenPago->estado = 'pagado';
    $ordenPago->save();

    return response()->json([
        'message' => 'Comprobante guardado exitosamente',
        'comprobante' => $comprobante
    ]);
}

}
