<?php

namespace App\Http\Controllers\GestionPagos;

use App\Http\Controllers\Controller;
use App\Models\GestionPagos\OrdenPagoModel;
use Illuminate\Http\Request;
use App\Models\GestionPagos\ComprobantePagoModel;

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

        $ordenPago = OrdenPagoModel::with('responsable')->where('codigo_generado', $validated['codigo_generado'])->first();

        if (!$ordenPago) {
            return response()->json(['message' => 'Código no encontrado.'], 404);
        }

        $comprobanteExistente = ComprobantePagoModel::where('numero_comprobante', $validated['numero_comprobante'])->first();
        if ($comprobanteExistente) {
            return response()->json([
                'message' => 'El número de comprobante ya existe. Por favor, ingrese un número diferente.',
                'field' => 'numero_comprobante'
            ], 400);
        }

        $responsable = $ordenPago->responsable;
        
        $nombre = trim($responsable->nombre ?? '');
        $apellidoPaterno = trim($responsable->apellido_pa ?? '');
        $apellidoMaterno = trim($responsable->apellido_ma ?? '');

        if (empty($nombre) || empty($apellidoPaterno) || empty($apellidoMaterno)) {
            return response()->json([
                'message' => 'Los datos del responsable están incompletos en el sistema.',
                'field' => 'sistema_error'
            ], 400);
        }

        $validacion = $this->validarNombreResponsable(
            $validated['nombre_pagador'],
            $nombre,
            $apellidoPaterno,
            $apellidoMaterno
        );

        if (!$validacion) {
            return response()->json([
                'message' => 'El nombre ingresado no coincide con el responsable de inscripción registrado. Verifique que haya ingresado el nombre completo (nombre, apellido paterno y apellido materno).',
                'field' => 'nombre_pagador'
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


    private function validarNombreResponsable($nombreIngresado, $nombre, $apellidoPaterno, $apellidoMaterno)
    {
        $nombreNormalizado = $this->normalizarTexto($nombreIngresado);
        
        $nombreComponenteNormalizado = $this->normalizarTexto($nombre);
        $apellidoPaternoNormalizado = $this->normalizarTexto($apellidoPaterno);
        $apellidoMaternoNormalizado = $this->normalizarTexto($apellidoMaterno);

        \Log::info('Validación de nombre responsable:', [
            'nombre_ingresado_original' => $nombreIngresado,
            'nombre_normalizado' => $nombreNormalizado,
            'validando_componentes' => [
                'nombre_length' => strlen($nombreComponenteNormalizado),
                'apellido_paterno_length' => strlen($apellidoPaternoNormalizado),
                'apellido_materno_length' => strlen($apellidoMaternoNormalizado)
            ]
        ]);

        $tieneNombre = $this->contieneComponente($nombreNormalizado, $nombreComponenteNormalizado);
        $tieneApellidoPaterno = $this->contieneComponente($nombreNormalizado, $apellidoPaternoNormalizado);
        $tieneApellidoMaterno = $this->contieneComponente($nombreNormalizado, $apellidoMaternoNormalizado);

        $esValido = $tieneNombre && $tieneApellidoPaterno && $tieneApellidoMaterno;

        \Log::info('Resultado validación:', [
            'tiene_nombre' => $tieneNombre,
            'tiene_apellido_paterno' => $tieneApellidoPaterno,
            'tiene_apellido_materno' => $tieneApellidoMaterno,
            'es_valido' => $esValido
        ]);

        return $esValido;
    }


    private function normalizarTexto($texto)
    {
        if (empty($texto)) {
            return '';
        }

        $texto = strtolower($texto);
        
        $caracteres = [
            'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'ā' => 'a', 'ã' => 'a',
            'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e', 'ē' => 'e',
            'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i', 'ī' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o', 'ō' => 'o', 'õ' => 'o',
            'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u', 'ū' => 'u',
            'ñ' => 'n', 'ç' => 'c'
        ];
        
        $texto = strtr($texto, $caracteres);
        
        $texto = preg_replace('/[^a-z0-9\s]/', ' ', $texto);
        $texto = preg_replace('/\s+/', ' ', $texto);
        
        return trim($texto);
    }


    private function contieneComponente($textoCompleto, $componente)
    {
        if (empty($componente)) {
            return true;
        }

        $palabrasComponente = array_filter(explode(' ', trim($componente)));
        
        foreach ($palabrasComponente as $palabra) {
            if (!empty($palabra)) {
                $patron = '/\b' . preg_quote($palabra, '/') . '\b/';
                if (!preg_match($patron, $textoCompleto)) {
                    return false;
                }
            }
        }
        
        return true;
    }
}