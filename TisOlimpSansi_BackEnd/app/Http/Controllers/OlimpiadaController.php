<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\olimpiada_area_categoria;



class OlimpiadaController extends Controller
{
    public function index()
    {
        $olimpiadas = OlimpiadaModel::all();

        return response()->json([
            'status' => 200,
            'data' => $olimpiadas,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'id_user' => 'required|exists:users,id',
            'titulo' => 'required|string|max:255',
            'fecha_ini' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_ini',
        ], [
            'id_user.exists' => 'El usuario no existe.',
        ]);

        $año = Carbon::parse($request->fecha_ini)->year;

        $existe = OlimpiadaModel::where('titulo', $request->titulo)
            ->whereYear('fecha_ini', $año)
            ->exists();

        if ($existe) {
            return response()->json([
                'status' => 422,
                'message' => 'Ya existe una olimpiada con ese título en el mismo año.',
            ], 422);
        }

        try {
            $olimpiada = new OlimpiadaModel();
            $olimpiada->id_user = $request->id_user;
            $olimpiada->titulo = $request->titulo;
            $olimpiada->fecha_ini = $request->fecha_ini;
            $olimpiada->fecha_fin = $request->fecha_fin;
            $olimpiada->save();

            return response()->json([
                'status' => 200,
                'message' => 'Olimpiada creada exitosamente',
                'data' => $olimpiada,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error al crear la olimpiada: ' . $e->getMessage(),
            ], 500);
        }
    }


public function show($id)
{
    try {
        $olimpiada = OlimpiadaModel::findOrFail($id);
        
        $olimpiada->makeVisible(['max_materias']);
        
        return response()->json($olimpiada);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Olimpiada no encontrada',
            'message' => $e->getMessage()
        ], 404);
    }
}


    public function update(Request $request, $id)
    {
        $olimpiada = OlimpiadaModel::findOrFail($id);
        $olimpiada->id_user_admin = $request->id_user_admin;
        $olimpiada->titulo = $request->titulo;
        $olimpiada->fecha_ini = $request->fecha_ini;
        $olimpiada->fecha_fin = $request->fecha_fin;
        $olimpiada->save();

        return response()->json([
            'status' => 200,
            'message' => 'Olimpiada actualizada exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $olimpiada = OlimpiadaModel::findOrFail($id);
        $olimpiada->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Olimpiada eliminada exitosamente',
        ]);
    }

    public function getOlimpiadas()
    {
        $olimpiadas = OlimpiadaModel::select('id', 'titulo','fecha_ini', 'fecha_fin')
        ->get();

        return response()->json([
            'status' => 200,
            'data' => $olimpiadas,
        ]);
    }

    public function getOlimpiadasActuales()
    {
        $hoy = Carbon::now()->toDateString();

        $olimpiadas = OlimpiadaModel::whereDate('fecha_inicio', '>=', $hoy)
            ->select('id', 'titulo')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $olimpiadas,
        ]);
    }


        public function getAreasPorOlimpiada(Request $request)
    {
        $id = $request->input('id');

        $areas = DB::table('olimpiada_area_categorias')
            ->join('area', 'area.id', '=', 'olimpiada_area_categorias.id_area')
            ->where('olimpiada_area_categorias.id_olimpiada', $id)
            ->select('area.id', 'area.nombre_area')
            ->distinct()
            ->get();

        return response()->json([
            'status' => 200,
            'areas' => $areas
        ]);
    }

public function getOlimpiadasPublicas()
{
    $olimpiadas = OlimpiadaModel::select('id', 'titulo', 'fecha_ini', 'fecha_fin')
        ->get();
    
    return response()->json([
        'status' => 200,
        'data' => $olimpiadas,
    ]);
}

public function getTodasLasOlimpiadas(): JsonResponse
{
    try {
        $olimpiadas = OlimpiadaModel::select('id', 'titulo', 'fecha_ini', 'fecha_fin')
            ->orderBy('fecha_ini', 'asc') // Opcional: ordena por fecha de inicio
            ->get();

        if ($olimpiadas->isEmpty()) {
            return response()->json([
                'status' => 204,
                'message' => 'No hay olimpiadas registradas.'
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => $olimpiadas,
        ]);
    } catch (\Exception $e) {
        \Log::error('Error al obtener todas las olimpiadas: ' . $e->getMessage());

        return response()->json([
            'status' => 500,
            'error' => 'Ocurrió un error al recuperar las olimpiadas.'
        ]);
    }
}


    public function setNumMaxMaterias(Request $request)
    {
    
        $data = $request->validate([
            'id'     => 'required|exists:olimpiada,id',
            'numMax' => 'required|integer|min:0',
        ]);

        
        $olimpiada = OlimpiadaModel::findOrFail($data['id']);
        $olimpiada->max_materias = $data['numMax'];
        $olimpiada->save();


        return response()->json([
            'message'    => 'Número máximo de materias actualizado correctamente',
            'olimpiada'  => $olimpiada,
        ], 200);
    }

public function getAreasCategoriasPorOlimpiada(Request $request)
{
    try {
        $idOlimpiada = $request->input('id');

        // Obtener todas las relaciones necesarias
        $registros = olimpiada_area_categoria::with(['area', 'categoria'])
            ->where('id_olimpiada', $idOlimpiada)
            ->get();

        if ($registros->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No se encontraron áreas ni categorías para esta olimpiada.'
            ], 404);
        }

        // Agrupar por área
        $resultado = [];

        foreach ($registros as $registro) {
            $areaId = $registro->area->id;

            if (!isset($resultado[$areaId])) {
                $resultado[$areaId] = [
                    'nombre_area' => $registro->area->nombre_area,
                    'categorias' => []
                ];
            }

            $resultado[$areaId]['categorias'][] = [
                'nombre_categoria' => $registro->categoria->nombre_categoria,
            ];
        }

        // Reindexar como array simple
        $resultado = array_values($resultado);

        return response()->json($resultado);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => $e->getMessage()
        ], 500);
    }
}
}
