<?php

namespace App\Http\Controllers\GestionPagos;

use App\Http\Controllers\Controller;
use App\Models\GestionPagos\OrdenPagoModel;
use Illuminate\Http\Request;
use App\Models\GestionPagos\ComprobantePagoModel;
use Illuminate\Support\Facades\Log;

class ComprobanteController extends Controller
{
    public function guardarComprobante(Request $request)
    {
        try {
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

            // Validar nombre del responsable
            $responsable = $ordenPago->responsable;
            
            if (!$responsable) {
                return response()->json([
                    'message' => 'No se encontró información del responsable.',
                    'field' => 'sistema_error'
                ], 400);
            }

            $nombre = trim($responsable->nombre ?? '');
            $apellidoPaterno = trim($responsable->apellido_pa ?? '');
            $apellidoMaterno = trim($responsable->apellido_ma ?? '');

            // Verificar que todos los campos obligatorios estén presentes
            if (empty($nombre) || empty($apellidoPaterno) || empty($apellidoMaterno)) {
                return response()->json([
                    'message' => 'Los datos del responsable están incompletos en el sistema.',
                    'field' => 'sistema_error'
                ], 400);
            }

            // Validar que el nombre ingresado coincida con el responsable registrado
            $validacion = $this->validarNombreResponsable(
                $validated['nombre_pagador'],
                $nombre,
                $apellidoPaterno,
                $apellidoMaterno
            );

            if (!$validacion) {
                return response()->json([
                    'message' => 'El nombre ingresado no coincide con el responsable de inscripción registrado.',
                    'field' => 'nombre_pagador'
                ], 400);
            }

            // Si la validación es exitosa, guardar el comprobante
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

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error en guardarComprobante', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'field' => 'servidor'
            ], 500);
        }
    }


    private function validarNombreResponsable($nombreIngresado, $nombre, $apellidoPaterno, $apellidoMaterno)
    {
        try {
            // Normalizar el nombre ingresado
            $nombreNormalizado = $this->normalizarTexto($nombreIngresado);
            
            // Normalizar los componentes del responsable
            $nombreComponenteNormalizado = $this->normalizarTexto($nombre);
            $apellidoPaternoNormalizado = $this->normalizarTexto($apellidoPaterno);
            $apellidoMaternoNormalizado = $this->normalizarTexto($apellidoMaterno);

            Log::info('Validación de nombre responsable:', [
                'nombre_ingresado_original' => $nombreIngresado,
                'nombre_normalizado' => $nombreNormalizado,
                'componentes_normalizados' => [
                    'nombre' => $nombreComponenteNormalizado,
                    'apellido_paterno' => $apellidoPaternoNormalizado,
                    'apellido_materno' => $apellidoMaternoNormalizado
                ]
            ]);

            // Verificar formato 1: Nombres ApellidoPaterno ApellidoMaterno
            $formato1 = $this->verificarFormato1($nombreNormalizado, $nombreComponenteNormalizado, $apellidoPaternoNormalizado, $apellidoMaternoNormalizado);
            
            // Verificar formato 2: ApellidoPaterno ApellidoMaterno Nombres
            $formato2 = $this->verificarFormato2($nombreNormalizado, $nombreComponenteNormalizado, $apellidoPaternoNormalizado, $apellidoMaternoNormalizado);

            $esValido = $formato1 || $formato2;

            Log::info('Resultado validación:', [
                'formato1_valido' => $formato1,
                'formato2_valido' => $formato2,
                'es_valido' => $esValido
            ]);

            return $esValido;
        } catch (\Exception $e) {
            Log::error('Error en validarNombreResponsable: ' . $e->getMessage());
            return false;
        }
    }

  
    private function verificarFormato1($nombreNormalizado, $nombres, $apellidoPaterno, $apellidoMaterno)
    {
        // Crear el patrón esperado: nombres + apellido paterno + apellido materno
        $patronEsperado = trim($nombres . ' ' . $apellidoPaterno . ' ' . $apellidoMaterno);
        $patronEsperadoNormalizado = $this->normalizarTexto($patronEsperado);
        
        // Comparar directamente
        $coincideExacto = $nombreNormalizado === $patronEsperadoNormalizado;
        
        // También verificar que contenga todos los componentes
        $tieneNombres = $this->contieneComponente($nombreNormalizado, $nombres);
        $tieneApellidoPaterno = $this->contieneComponente($nombreNormalizado, $apellidoPaterno);
        $tieneApellidoMaterno = $this->contieneComponente($nombreNormalizado, $apellidoMaterno);
        
        $tieneComponentes = $tieneNombres && $tieneApellidoPaterno && $tieneApellidoMaterno;
        
        Log::info('Verificando formato 1:', [
            'patron_esperado' => $patronEsperadoNormalizado,
            'nombre_ingresado' => $nombreNormalizado,
            'coincide_exacto' => $coincideExacto,
            'tiene_componentes' => $tieneComponentes
        ]);
        
        return $coincideExacto || $tieneComponentes;
    }

 
    private function verificarFormato2($nombreNormalizado, $nombres, $apellidoPaterno, $apellidoMaterno)
    {
        // Crear el patrón esperado: apellido paterno + apellido materno + nombres
        $patronEsperado = trim($apellidoPaterno . ' ' . $apellidoMaterno . ' ' . $nombres);
        $patronEsperadoNormalizado = $this->normalizarTexto($patronEsperado);
        
        // Comparar directamente
        $coincideExacto = $nombreNormalizado === $patronEsperadoNormalizado;
        
        // También verificar que contenga todos los componentes
        $tieneNombres = $this->contieneComponente($nombreNormalizado, $nombres);
        $tieneApellidoPaterno = $this->contieneComponente($nombreNormalizado, $apellidoPaterno);
        $tieneApellidoMaterno = $this->contieneComponente($nombreNormalizado, $apellidoMaterno);
        
        $tieneComponentes = $tieneNombres && $tieneApellidoPaterno && $tieneApellidoMaterno;
        
        Log::info('Verificando formato 2:', [
            'patron_esperado' => $patronEsperadoNormalizado,
            'nombre_ingresado' => $nombreNormalizado,
            'coincide_exacto' => $coincideExacto,
            'tiene_componentes' => $tieneComponentes
        ]);
        
        return $coincideExacto || $tieneComponentes;
    }


    private function normalizarTexto($texto)
    {
        if (empty($texto)) {
            return '';
        }

        try {
            // Convertir a minúsculas
            $texto = strtolower($texto);
            
            // Remover acentos y caracteres especiales
            $caracteres = [
                'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'ā' => 'a', 'ã' => 'a',
                'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e', 'ē' => 'e',
                'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i', 'ī' => 'i',
                'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o', 'ō' => 'o', 'õ' => 'o',
                'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u', 'ū' => 'u',
                'ñ' => 'n', 'ç' => 'c'
            ];
            
            $texto = strtr($texto, $caracteres);
            
            // Limpiar espacios múltiples y caracteres especiales
            $texto = preg_replace('/[^a-z0-9\s]/', ' ', $texto);
            $texto = preg_replace('/\s+/', ' ', $texto);
            
            return trim($texto);
        } catch (\Exception $e) {
            Log::error('Error en normalizarTexto: ' . $e->getMessage());
            return '';
        }
    }


    private function contieneComponente($textoCompleto, $componente)
    {
        if (empty($componente)) {
            return true;
        }

        try {
            // Dividir el componente en palabras individuales (para nombres compuestos)
            $palabrasComponente = array_filter(explode(' ', trim($componente)));
            
            // Verificar que todas las palabras del componente estén presentes
            foreach ($palabrasComponente as $palabra) {
                if (!empty($palabra)) {
                    // Buscar la palabra como palabra completa
                    $patron = '/\b' . preg_quote($palabra, '/') . '\b/';
                    if (!preg_match($patron, $textoCompleto)) {
                        return false;
                    }
                }
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error en contieneComponente: ' . $e->getMessage());
            return false;
        }
    }
}