<?php

namespace App\Helpers;

use Exception;
use NumberToWords\NumberToWords;
use Illuminate\Support\Facades\DB;
use App\Models\GestionPagos\OrdenPagoModel;

class OrdenPagoHelper
{
    public static function mostrarOrdenPago($numero) {
        $numberToWords = new NumberToWords();
        $numberTransformer = $numberToWords->getNumberTransformer('es');
        $literal = $numberTransformer->toWords($numero);
        return mb_strtoupper($literal, 'UTF-8');
    }

    /**
     * Obtiene los costos de una olimpiada usando código generado
     * @param string $codigoGenerado
     * @return array
     */
    public static function obtenerCostosOlimpiada($codigoGenerado) {
        try {
            // Debug: Log del código generado
            error_log("DEBUG: Código generado recibido: " . $codigoGenerado);
            
            // Paso 1: Obtener el ID de la olimpiada usando el código generado
            $idOlimpiada = self::obtenerIdOlimpiada($codigoGenerado);
            
            if (!$idOlimpiada) {
                throw new Exception("No se pudo obtener el ID de la olimpiada para el código: {$codigoGenerado}");
            }
            
            error_log("DEBUG: ID olimpiada extraído: " . $idOlimpiada);
            
            // Paso 2: Obtener los costos usando el ID de la olimpiada
            $dataCostos = self::obtenerCostos($idOlimpiada);
            
            if ($dataCostos && $dataCostos['success']) {
                error_log("DEBUG: Costos obtenidos correctamente: " . print_r($dataCostos, true));
                return [
                    'success' => true,
                    'costo_unico' => $dataCostos['costo_unico'] ?? false,
                    'costo' => $dataCostos['costo'] ?? null,
                    'costos_por_area' => $dataCostos['costos_por_area'] ?? []
                ];
            }
            
            throw new Exception("No se pudieron obtener los costos para la olimpiada ID: {$idOlimpiada}");
            
        } catch (Exception $e) {
            error_log("ERROR en obtenerCostosOlimpiada: " . $e->getMessage());
            
            return [
                'success' => false,
                'costo_unico' => true,
                'costo' => 20,
                'costos_por_area' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Obtiene el ID de la olimpiada según el código generado
     * @param string $codigo
     * @return int|null
     */
    private static function obtenerIdOlimpiada($codigo) {
        try {
            // Buscar la orden de pago por código generado
            $ordenPago = OrdenPagoModel::with(['inscripcion.olimpiadaAreaCategoria'])
                ->where('codigo_generado', $codigo)
                ->first();

            if (!$ordenPago) {
                error_log("DEBUG: No se encontró orden de pago con código: " . $codigo);
                return null;
            }

            // Verificar que tenga al menos una inscripción
            if ($ordenPago->inscripcion->isEmpty()) {
                error_log("DEBUG: No se encontraron inscripciones para la orden de pago");
                return null;
            }

            // Obtener el id_olimpiada de la primera inscripción
            $idOlimpiada = $ordenPago->inscripcion->first()->olimpiadaAreaCategoria->id_olimpiada;

            return $idOlimpiada;

        } catch (\Exception $e) {
            error_log("ERROR en obtenerIdOlimpiada: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene los costos de una olimpiada por ID
     * @param int $idOlimpiada
     * @return array
     */
    private static function obtenerCostos($idOlimpiada) {
        try {
            // Validar que la olimpiada existe
            $olimpiadaExists = DB::table('olimpiada')->where('id', $idOlimpiada)->exists();
            
            if (!$olimpiadaExists) {
                error_log("DEBUG: Olimpiada no encontrada con ID: " . $idOlimpiada);
                return [
                    'success' => false,
                    'message' => 'Olimpiada no encontrada'
                ];
            }

            // Obtener costos únicos por área (agrupando por área)
            $costos = DB::table('olimpiada_area_categoria as oac')
                ->join('area as a', 'oac.id_area', '=', 'a.id')
                ->where('oac.id_olimpiada', $idOlimpiada)
                ->select(
                    'oac.id_area', 
                    'a.nombre_area', 
                    DB::raw('MIN(oac.precio) as precio') // O MAX() si prefieres el precio más alto
                )
                ->groupBy('oac.id_area', 'a.nombre_area')
                ->get();

            if ($costos->isEmpty()) {
                error_log("DEBUG: No se encontraron áreas para la olimpiada ID: " . $idOlimpiada);
                return [
                    'success' => false,
                    'message' => 'No se encontraron áreas para esta olimpiada'
                ];
            }

            // Obtener todos los precios únicos
            $preciosUnicos = $costos->pluck('precio')->unique();

            // Si todos los costos son iguales
            if ($preciosUnicos->count() === 1) {
                return [
                    'success' => true,
                    'message' => 'Todas las áreas tienen el mismo costo',
                    'costo_unico' => true,
                    'costo' => $preciosUnicos->first(),
                    'costos_por_area' => []
                ];
            }

            // Si los costos son diferentes
            $costosDetallados = $costos->map(function ($item) {
                return [
                    'id_area' => $item->id_area,
                    'nombre_area' => $item->nombre_area,
                    'costo' => $item->precio
                ];
            })->toArray();

            return [
                'success' => true,
                'message' => 'Las áreas tienen costos diferentes',
                'costo_unico' => false,
                'costo' => null,
                'costos_por_area' => $costosDetallados
            ];

        } catch (\Exception $e) {
            error_log("ERROR en obtenerCostos: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener costos: ' . $e->getMessage()
            ];
        }
    }
}