<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaAreaModel;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\CategoriaGradoModel;

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
        // Obtener áreas y sus categorías asociadas a la olimpiada
        $areasYCategorias = DB::table('olimpiada_area_categorias')
            ->join('area', 'olimpiada_area_categorias.id_area', '=', 'area.id')
            ->join('categoria', 'olimpiada_area_categorias.id_categoria', '=', 'categoria.id')
            ->where('olimpiada_area_categorias.id_olimpiada', $id)
            ->select(
                'area.id',
                'area.nombre_area as area',
                'categoria.id as id_categoria',
                'categoria.nombre_categoria as nombre_categoria',
                'olimpiada_area_categorias.precio as costoInscripcion'
            )
            ->get();

        // Agrupar por área para evitar duplicados
        $areasAgrupadasMap = [];
        
        foreach ($areasYCategorias as $item) {
            if (!isset($areasAgrupadasMap[$item->id])) {
                $areasAgrupadasMap[$item->id] = [
                    'id' => $item->id,
                    'area' => $item->area,
                    'costoInscripcion' => $item->costoInscripcion,
                    'habilitado' => true,
                    'categorias' => []
                ];
            }
            
            // Añadir la categoría al área correspondiente
            $areasAgrupadasMap[$item->id]['categorias'][] = [
                'nombre' => $item->nombre_categoria,
                'id' => $item->id_categoria
            ];
        }
        
        // Convertir el mapa a un array para la respuesta
        $areasAgrupadas = array_values($areasAgrupadasMap);

        return response()->json([
            'status' => 200,
            'data' => $areasAgrupadas,
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

        DB::beginTransaction();
        $costosExistentes = DB::table('olimpiada_area_categorias')
            ->where('id_olimpiada', $idOlimpiada)
            ->select('id_area', 'id_categoria', 'precio')
            ->get()
            ->mapToGroups(function ($item) {
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
                    $areaModel = AreaModel::create([
                        'nombre_area' => strtoupper($area['area']),
                    ]);
                }

                // Si tiene niveles o rangos específicos, guardarlos
                if (isset($area['niveles']) && is_array($area['niveles'])) {
                    foreach ($area['niveles'] as $nivel) {
                        // Buscar o crear la categoría
                        $categoria = CategoriaModel::firstOrCreate(
                            ['nombre_categoria' => $nivel['nivel']],
                            ['id_area' => $areaModel->id]
                        );
                        
                        // Asociar grados a la categoría
                        if (isset($nivel['desde']) && isset($nivel['hasta'])) {
                            $gradoDesde = GradoModel::where('nombre_grado', $nivel['desde'])->first();
                            $gradoHasta = GradoModel::where('nombre_grado', $nivel['hasta'])->first();
                            
                            if ($gradoDesde && $gradoHasta) {
                                // Obtener todos los grados en el rango
                                $grados = GradoModel::where('id', '>=', $gradoDesde->id)
                                    ->where('id', '<=', $gradoHasta->id)
                                    ->get();
                                
                                // Asociar cada grado a la categoría
                                foreach ($grados as $grado) {
                                    CategoriaGradoModel::firstOrCreate([
                                        'id_categoria' => $categoria->id,
                                        'id_grado' => $grado->id,
                                    ]);
                                }
                            }
                        }
                        
                        // Verificar si existe un costo previo
                        $costoClave = $areaModel->id . '_' . $categoria->id;
                        $costoExistente = isset($costosExistentes[$costoClave]) && !empty($costosExistentes[$costoClave]) 
                            ? $costosExistentes[$costoClave][0] 
                            : 0;
                        
                        // Crear la relación en la tabla
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
                    // Similar implementación para rangos
                    foreach ($area['rangos'] as $rango) {
                        $categoria = CategoriaModel::firstOrCreate(
                            ['nombre_categoria' => $rango['nivel']],
                            ['id_area' => $areaModel->id]
                        );
                        
                        // Asociar grados a la categoría
                        if (isset($rango['desde']) && isset($rango['hasta'])) {
                            $gradoDesde = GradoModel::where('nombre_grado', $rango['desde'])->first();
                            $gradoHasta = GradoModel::where('nombre_grado', $rango['hasta'])->first();
                            
                            if ($gradoDesde && $gradoHasta) {
                                $grados = GradoModel::where('id', '>=', $gradoDesde->id)
                                    ->where('id', '<=', $gradoHasta->id)
                                    ->get();
                                
                                foreach ($grados as $grado) {
                                    CategoriaGradoModel::firstOrCreate([
                                        'id_categoria' => $categoria->id,
                                        'id_grado' => $grado->id,
                                    ]);
                                }
                            }
                        }
                        
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
