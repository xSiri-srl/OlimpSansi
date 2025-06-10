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

    // Buscar la orden de pago con el responsable
    $ordenPago = OrdenPagoModel::with('responsable')->where('codigo_generado', $validated['codigo_generado'])->first();

    if (!$ordenPago) {
        return response()->json(['message' => 'Código no encontrado.'], 404);
    }

    // Validar que el número de comprobante sea único
    $comprobanteExistente = ComprobantePagoModel::where('numero_comprobante', $validated['numero_comprobante'])->first();
    if ($comprobanteExistente) {
        return response()->json([
            'message' => 'El número de comprobante ya existe. Por favor, ingrese un número diferente.',
            'field' => 'numero_comprobante'
        ], 400);
    }

    // Validar que el nombre del responsable coincida
    $responsable = $ordenPago->responsable;
    $nombreCompletoResponsable = trim(
        ($responsable->nombre ?? '') . ' ' . 
        ($responsable->apellido_pa ?? '') . ' ' . 
        ($responsable->apellido_ma ?? '')
    );

    // Normalizar nombres para comparación (quitar espacios extra, convertir a minúsculas)
    $nombreIngresado = preg_replace('/\s+/', ' ', trim(strtolower($validated['nombre_pagador'])));
    $nombreRegistrado = preg_replace('/\s+/', ' ', trim(strtolower($nombreCompletoResponsable)));

    if ($nombreIngresado !== $nombreRegistrado) {
        return response()->json([
            'message' => 'El nombre del responsable de inscripción no coincide con el registrado.',
            'field' => 'nombre_pagador',
            'nombre_esperado' => $nombreCompletoResponsable
        ], 400);
    }

    $imagen = $request->file('comprobante');
    $comprobantePath = $imagen->store('comprobantes', 'public');

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
