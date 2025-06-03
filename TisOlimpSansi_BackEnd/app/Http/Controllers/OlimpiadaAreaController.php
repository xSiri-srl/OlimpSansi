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
        // Obtener áreas y sus categorías con grados asociados a la olimpiada
        $areasYCategorias = DB::table('olimpiada_area_categorias')
            ->join('area', 'olimpiada_area_categorias.id_area', '=', 'area.id')
            ->join('categoria', 'olimpiada_area_categorias.id_categoria', '=', 'categoria.id')
            ->leftJoin('categoria_grado', 'categoria.id', '=', 'categoria_grado.id_categoria')
            ->leftJoin('grado', 'categoria_grado.id_grado', '=', 'grado.id')
            ->where('olimpiada_area_categorias.id_olimpiada', $id)
            ->select(
                'area.id',
                'area.nombre_area as area',
                'categoria.id as id_categoria',
                'categoria.nombre_categoria as nombre_categoria',
                'grado.id as id_grado',
                'grado.nombre_grado',
                'olimpiada_area_categorias.precio as costoInscripcion'
            )
            ->orderBy('area.nombre_area')
            ->orderBy('categoria.nombre_categoria')
            ->orderBy('grado.id')
            ->get();

        // Agrupar por área y categoría
        $areasAgrupadasMap = [];
        
        foreach ($areasYCategorias as $item) {
            $areaId = $item->id;
            $categoriaId = $item->id_categoria;
            
            // Inicializar área si no existe
            if (!isset($areasAgrupadasMap[$areaId])) {
                $areasAgrupadasMap[$areaId] = [
                    'id' => $areaId,
                    'area' => $item->area,
                    'costoInscripcion' => $item->costoInscripcion,
                    'habilitado' => true,
                    'categorias' => []
                ];
            }
            
            // Buscar si la categoría ya existe en el área
            $categoriaIndex = null;
            foreach ($areasAgrupadasMap[$areaId]['categorias'] as $index => $categoria) {
                if ($categoria['id'] == $categoriaId) {
                    $categoriaIndex = $index;
                    break;
                }
            }
            
            // Si la categoría no existe, crearla
            if ($categoriaIndex === null) {
                $areasAgrupadasMap[$areaId]['categorias'][] = [
                    'nombre' => $item->nombre_categoria,
                    'id' => $categoriaId,
                    'grados' => [],
                    'desde' => null,
                    'hasta' => null
                ];
                $categoriaIndex = count($areasAgrupadasMap[$areaId]['categorias']) - 1;
            }
            
            // Agregar grado si existe
            if ($item->id_grado && $item->nombre_grado) {
                $grados = &$areasAgrupadasMap[$areaId]['categorias'][$categoriaIndex]['grados'];
                
                // Evitar duplicados
                $gradoExiste = false;
                foreach ($grados as $grado) {
                    if ($grado['id'] == $item->id_grado) {
                        $gradoExiste = true;
                        break;
                    }
                }
                
                if (!$gradoExiste) {
                    $grados[] = [
                        'id' => $item->id_grado,
                        'nombre_grado' => $item->nombre_grado
                    ];
                }
            }
        }
        
        // Calcular desde y hasta para cada categoría basado en los grados
        foreach ($areasAgrupadasMap as &$area) {
            foreach ($area['categorias'] as &$categoria) {
                if (!empty($categoria['grados'])) {
                    // Ordenar grados por ID para obtener el rango correcto
                    usort($categoria['grados'], function($a, $b) {
                        return $a['id'] - $b['id'];
                    });
                    
                    $categoria['desde'] = $categoria['grados'][0]['nombre_grado'];
                    $categoria['hasta'] = end($categoria['grados'])['nombre_grado'];
                } else {
                    $categoria['desde'] = 'No definido';
                    $categoria['hasta'] = 'No definido';
                }
            }
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
                        // Buscar o crear la categoría (sin id_area que ya no existe)
                        $categoria = CategoriaModel::firstOrCreate(
                            ['nombre_categoria' => $nivel['nivel']]
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
                        
                        // Crear la relación en la tabla olimpiada_area_categorias
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
                        // Buscar o crear la categoría (sin id_area que ya no existe)
                        $categoria = CategoriaModel::firstOrCreate(
                            ['nombre_categoria' => $rango['nivel']]
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

public function desasociarCategorias(Request $request)
{
    $request->validate([
        'id_olimpiada' => 'required|exists:olimpiada,id',
        'id_area' => 'required|exists:area,id',
        'categorias_eliminar' => 'required|array',
        'categorias_eliminar.*.id' => 'required|exists:categoria,id',
    ]);

    try {
        $idOlimpiada = $request->id_olimpiada;
        $idArea = $request->id_area;
        $categoriasEliminar = $request->categorias_eliminar;

        DB::beginTransaction();

        foreach ($categoriasEliminar as $categoria) {
            $idCategoria = $categoria['id'];

            // Verificar si esta categoría específica tiene inscripciones
            $existeInscripcion = DB::table('inscripcion')
                ->join('olimpiada_area_categorias', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categorias.id')
                ->where('olimpiada_area_categorias.id_olimpiada', $idOlimpiada)
                ->where('olimpiada_area_categorias.id_area', $idArea)
                ->where('olimpiada_area_categorias.id_categoria', $idCategoria)
                ->exists();

            if ($existeInscripcion) {
                $nombreCategoria = DB::table('categoria')->where('id', $idCategoria)->value('nombre_categoria');
                $nombreArea = DB::table('area')->where('id', $idArea)->value('nombre_area');
                
                DB::rollBack();
                return response()->json([
                    'status' => 400,
                    'message' => "No se puede desasociar la categoría '$nombreCategoria' del área '$nombreArea' porque tiene inscripciones asociadas.",
                ], 400);
            }

            // Eliminar la relación específica
            DB::table('olimpiada_area_categorias')
                ->where('id_olimpiada', $idOlimpiada)
                ->where('id_area', $idArea)
                ->where('id_categoria', $idCategoria)
                ->delete();
        }

        DB::commit();
        return response()->json([
            'status' => 200,
            'message' => 'Categorías desasociadas exitosamente',
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => 'Error al desasociar categorías: ' . $e->getMessage(),
        ], 500);
    }
}

}
