<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaAreaModel;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use Illuminate\Support\Facades\DB;

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

        // Eliminar asociaciones existentes primero - MODIFICADO PARA USAR olimpiada_area_categorias
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
                        
                        // Crear la relación en la tabla
                        DB::table('olimpiada_area_categorias')->insert([
                            'id_olimpiada' => $idOlimpiada,
                            'id_area' => $areaModel->id,
                            'id_categoria' => $categoria->id,
                            'precio' => $area['costoInscripcion'] ?? 16,
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
                        
                        DB::table('olimpiada_area_categorias')->insert([
                            'id_olimpiada' => $idOlimpiada,
                            'id_area' => $areaModel->id,
                            'id_categoria' => $categoria->id,
                            'precio' => $area['costoInscripcion'] ?? 16,
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

}
