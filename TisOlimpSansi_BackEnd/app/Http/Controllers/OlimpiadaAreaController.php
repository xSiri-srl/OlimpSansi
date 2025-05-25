<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaAreaModel;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OlimpiadaAreaController extends Controller
{
    public function index()
    {
        $relaciones = OlimpiadaAreaModel::all();

        return response()->json([
            'status' => 200,
            'data' => $relaciones,
        ]);
    }

    public function store(Request $request)
    {
        $relacion = new OlimpiadaAreaModel();
        $relacion->id_olimpiada = $request->id_olimpiada;
        $relacion->id_area = $request->id_area;
        $relacion->monto = $request->monto;
        $relacion->save();

        return response()->json([
            'status' => 200,
            'message' => 'Área vinculada a olimpiada exitosamente',
        ]);
    }

    public function show($id)
    {
        $relacion = OlimpiadaAreaModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $relacion,
        ]);
    }

    public function update(Request $request, $id)
    {
        $relacion = OlimpiadaAreaModel::findOrFail($id);
        $relacion->monto = $request->monto;
        $relacion->save();

        return response()->json([
            'status' => 200,
            'message' => 'Relación actualizada exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $relacion = OlimpiadaAreaModel::findOrFail($id);
        $relacion->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Relación eliminada exitosamente',
        ]);
    }

public function getAreasPorOlimpiada($id)
{
    try {
        // Obtener áreas asociadas a la olimpiada desde olimpiada_area_categorias
        $areasAsociadas = DB::table('olimpiada_area_categorias')
            ->join('area', 'olimpiada_area_categorias.id_area', '=', 'area.id')
            ->where('olimpiada_area_categorias.id_olimpiada', $id)
            ->select(
                'area.id',
                'area.nombre_area as area',
                'olimpiada_area_categorias.precio as costoInscripcion',
                DB::raw('true as habilitado')
            )
            ->distinct() // Para evitar duplicados por múltiples categorías
            ->get();

        // Normalizamos y mapeamos los nombres para garantizar la coherencia
        $areasAsociadas = $areasAsociadas->map(function($item) {
            $nombreNormalizado = str_replace(['-', '_'], ' ', $item->area);
            $nombreNormalizado = str_replace('ASTROFISICA', 'ASTROFÍSICA', $nombreNormalizado);
            $nombreNormalizado = str_replace('MATEMATICAS', 'MATEMÁTICAS', $nombreNormalizado);
            $nombreNormalizado = str_replace('FISICA', 'FÍSICA', $nombreNormalizado);
            $nombreNormalizado = str_replace('INFORMATICA', 'INFORMÁTICA', $nombreNormalizado);
            $nombreNormalizado = str_replace('QUIMICA', 'QUÍMICA', $nombreNormalizado);
            $nombreNormalizado = str_replace('ROBOTICA', 'ROBÓTICA', $nombreNormalizado);
            
            $item->area = $nombreNormalizado;
            return $item;
        });

        return response()->json([
            'status' => 200,
            'data' => $areasAsociadas,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Error al obtener áreas asociadas: ' . $e->getMessage(),
        ], 500);
    }
}

public function asociarAreas(Request $request)
{
    $request->validate([
        'id_olimpiada' => 'required|exists:olimpiada,id',
        'areas' => 'required|array',
    ]);

    try {
        $idOlimpiada = $request->id_olimpiada;
        $areas = $request->areas;

        // Iniciar transacción para mantener consistencia
        DB::beginTransaction();

        // NUEVO: Guardar los costos existentes antes de eliminar
        $costosExistentes = DB::table('olimpiada_area_categorias')
            ->where('id_olimpiada', $idOlimpiada)
            ->select('id_area', 'id_categoria', 'precio')
            ->get()
            ->mapToGroups(function ($item) {
                // Crear una clave compuesta para identificar cada combinación única
                $key = $item->id_area . '_' . $item->id_categoria;
                return [$key => $item->precio];
            })
            ->toArray();

        // Eliminar asociaciones existentes
        DB::table('olimpiada_area_categorias')->where('id_olimpiada', $idOlimpiada)->delete();

        // Guardar nuevas asociaciones
        foreach ($areas as $area) {
            // Solo guardar áreas habilitadas
            if (isset($area['habilitado']) && $area['habilitado']) {
                // Buscar el ID del área por nombre
                $areaModel = AreaModel::where('nombre_area', strtoupper($area['area']))
                    ->first();

                if (!$areaModel) {
                    // Si el área no existe, la creamos
                    $areaModel = AreaModel::create([
                        'nombre_area' => strtoupper($area['area']),
                    ]);
                }

                // Si tiene niveles o rangos específicos, guardarlos en tabla
                if (isset($area['niveles']) && is_array($area['niveles'])) {
                    foreach ($area['niveles'] as $nivel) {
                        // Buscar o crear la categoría
                        $categoria = CategoriaModel::firstOrCreate(
                            ['nombre_categoria' => $nivel['nivel']],
                            ['id_area' => $areaModel->id]
                        );
                        
                        // NUEVO: Verificar si existe un costo previo para esta combinación
                        $costoClave = $areaModel->id . '_' . $categoria->id;
                        $costoExistente = isset($costosExistentes[$costoClave]) && !empty($costosExistentes[$costoClave]) 
                            ? $costosExistentes[$costoClave][0] 
                            : 0;
                        
                        // Crear la relación en la tabla con el costo existente o 0 si es nueva
                        DB::table('olimpiada_area_categorias')->insert([
                            'id_olimpiada' => $idOlimpiada,
                            'id_area' => $areaModel->id,
                            'id_categoria' => $categoria->id,
                            'precio' => $costoExistente,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                } else if (isset($area['rangos']) && is_array($area['rangos'])) {
                    foreach ($area['rangos'] as $rango) {
                        // Implementación similar para rangos
                        $categoria = CategoriaModel::firstOrCreate(
                            ['nombre_categoria' => $rango['nivel']],
                            ['id_area' => $areaModel->id]
                        );
                        
                        // NUEVO: Verificar si existe un costo previo para esta combinación
                        $costoClave = $areaModel->id . '_' . $categoria->id;
                        $costoExistente = isset($costosExistentes[$costoClave]) && !empty($costosExistentes[$costoClave]) 
                            ? $costosExistentes[$costoClave][0] 
                            : 0;
                        
                        DB::table('olimpiada_area_categorias')->insert([
                            'id_olimpiada' => $idOlimpiada,
                            'id_area' => $areaModel->id,
                            'id_categoria' => $categoria->id,
                            'precio' => $costoExistente,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }

        DB::commit();

        return response()->json([
            'status' => 200,
            'message' => 'Áreas asociadas exitosamente a la olimpiada',
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => 'Error al asociar áreas a la olimpiada: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
}


public function actualizarCostos(Request $request)
{
    $request->validate([
        'id_olimpiada' => 'required|exists:olimpiada,id',
        'areas' => 'required|array',
    ]);

    try {
        $idOlimpiada = $request->id_olimpiada;
        $areas = $request->areas;

        // Iniciar transacción para mantener consistencia
        DB::beginTransaction();

        foreach ($areas as $area) {
            // Actualizar solo el precio en la tabla olimpiada_area_categorias
            DB::table('olimpiada_area_categorias')
                ->where('id_olimpiada', $idOlimpiada)
                ->where('id_area', $area['id'])
                ->update([
                    'precio' => $area['costoInscripcion'],
                    'updated_at' => now()
                ]);
        }

        DB::commit();

        return response()->json([
            'status' => 200,
            'message' => 'Costos actualizados exitosamente',
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => 'Error al actualizar costos: ' . $e->getMessage(),
        ], 500);
    }
}


public function desasociarAreas(Request $request)
{
    $request->validate([
        'id_olimpiada' => 'required|exists:olimpiada,id',
        'areas' => 'required|array',
        'areas.*.area' => 'required|string',
        'areas.*.habilitado' => 'required|boolean',
    ]);

    try {
        $idOlimpiada = $request->id_olimpiada;
        DB::beginTransaction();

        foreach ($request->areas as $areaItem) {
            $nombreArea = strtoupper($areaItem['area']);

            // Solo procesar si está deshabilitado
            if (!$areaItem['habilitado']) {
                $area = AreaModel::where('nombre_area', $nombreArea)->first();

                if (!$area) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 404,
                        'message' => "Área '$nombreArea' no encontrada",
                    ], 404);
                }

                // Buscar todos los ID de olimpiada_area_categoria asociados a esa área y olimpiada
                $idsRelacionados = DB::table('olimpiada_area_categorias')
                    ->where('id_olimpiada', $idOlimpiada)
                    ->where('id_area', $area->id)
                    ->pluck('id');

                // Verificar si alguno de esos IDs está en una inscripción
                $existeInscripcion = DB::table('inscripcion')
                    ->whereIn('id_olimpiada_area_categoria', $idsRelacionados)
                    ->exists();

                if ($existeInscripcion) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 400,
                        'message' => "No se puede desasociar el área '$nombreArea' porque está asociada a uno o más inscritos.",
                    ], 400);
                }

                // Eliminar la relación
                DB::table('olimpiada_area_categorias')
                    ->where('id_olimpiada', $idOlimpiada)
                    ->where('id_area', $area->id)
                    ->delete();
            }
        }

        DB::commit();
        return response()->json([
            'status' => 200,
            'message' => 'Áreas desasociadas exitosamente de la olimpiada',
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => 'Error al desasociar áreas: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
}

}
