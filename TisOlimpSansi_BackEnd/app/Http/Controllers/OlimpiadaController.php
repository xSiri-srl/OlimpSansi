<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\olimpiada_area_categoria;
use Illuminate\Http\JsonResponse;




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
        // $olimpiada->max_materias = 1; // ELIMINAR ESTA LÍNEA
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
        
        return response()->json($olimpiada->toArray());
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
        $olimpiadas = OlimpiadaModel::select('id', 'titulo', 'fecha_ini', 'fecha_fin')->get();



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
            $area = $registro->area;
            $categoria = $registro->categoria;

            $nombreArea = $area->nombre_area;

            if (!isset($resultado[$nombreArea])) {
                $resultado[$nombreArea] = [];
            }

            // Obtener los grados asociados a esta categoría
            $grados = \DB::table('categoria_grado')
                ->join('grado', 'categoria_grado.id_grado', '=', 'grado.id')
                ->where('categoria_grado.id_categoria', $categoria->id)
                ->select('grado.id', 'grado.nombre_grado')
                ->orderBy('grado.id')
                ->get();

            $resultado[$nombreArea][] = [
                'id' => $categoria->id,
                'nombre' => $categoria->nombre_categoria,
                'grados' => $grados->toArray(),
                'desde' => $grados->isNotEmpty() ? $grados->first()->nombre_grado : null,
                'hasta' => $grados->isNotEmpty() ? $grados->last()->nombre_grado : null
            ];
        }

        return response()->json($resultado);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => $e->getMessage()
        ], 500);
    }
}

public function verificarInscripciones($id)
{
    try {
        // Obtener la olimpiada para verificar las fechas
        $olimpiada = OlimpiadaModel::findOrFail($id);
        
        // Contar inscripciones asociadas a esta olimpiada
        $cantidadInscripciones = DB::table('inscripcion')
            ->join('olimpiada_area_categorias', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categorias.id')
            ->where('olimpiada_area_categorias.id_olimpiada', $id)
            ->count();

        // Verificar si el período de inscripción ha terminado
        $hoy = now()->toDateString();
        $periodoTerminado = $hoy > $olimpiada->fecha_fin;

        // La olimpiada está bloqueada si tiene inscripciones O si el período terminó
        $estaBloqueada = $cantidadInscripciones > 0 || $periodoTerminado;

        return response()->json([
            'status' => 200,
            'tiene_inscripciones' => $cantidadInscripciones > 0,
            'cantidad_inscripciones' => $cantidadInscripciones,
            'periodo_terminado' => $periodoTerminado,
            'fecha_fin' => $olimpiada->fecha_fin,
            'esta_bloqueada' => $estaBloqueada,
            'razon_bloqueo' => $this->obtenerRazonBloqueo($cantidadInscripciones, $periodoTerminado)
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Error al verificar inscripciones: ' . $e->getMessage()
        ], 500);
    }
}

private function obtenerRazonBloqueo($cantidadInscripciones, $periodoTerminado)
{
    if ($cantidadInscripciones > 0 && $periodoTerminado) {
        return 'inscripciones_y_periodo';
    } elseif ($cantidadInscripciones > 0) {
        return 'inscripciones';
    } elseif ($periodoTerminado) {
        return 'periodo';
    }
    return null;
}

public function getOlimpiadasPublicasCompletas(): JsonResponse
{
    try {
        // Obtener todas las olimpiadas
        $olimpiadas = OlimpiadaModel::select('id', 'titulo', 'fecha_ini', 'fecha_fin', 'max_materias')
            ->orderBy('fecha_ini', 'desc')
            ->get();

        $olimpiadasCompletas = [];

        foreach ($olimpiadas as $olimpiada) {
            // Verificar si la olimpiada está completamente configurada
            if ($this->esOlimpiadaCompleta($olimpiada->id, $olimpiada->max_materias)) {
                $olimpiadasCompletas[] = [
                    'id' => $olimpiada->id,
                    'titulo' => $olimpiada->titulo,
                    'fecha_ini' => $olimpiada->fecha_ini,
                    'fecha_fin' => $olimpiada->fecha_fin
                ];
            }
        }

        return response()->json([
            'status' => 200,
            'data' => $olimpiadasCompletas,
        ]);
    } catch (\Exception $e) {
        \Log::error('Error al obtener olimpiadas públicas completas: ' . $e->getMessage());

        return response()->json([
            'status' => 500,
            'error' => 'Ocurrió un error al recuperar las olimpiadas.'
        ], 500);
    }
}

private function esOlimpiadaCompleta($olimpiadaId, $maxMaterias)
{
    try {
        // 1. Verificar que max_materias sea mayor a 0
        if (!$maxMaterias || $maxMaterias <= 0) {
            return false;
        }

        // 2. Verificar que tenga áreas asociadas
        $tieneAreas = DB::table('olimpiada_area_categorias')
            ->where('id_olimpiada', $olimpiadaId)
            ->exists();

        if (!$tieneAreas) {
            return false;
        }

        // 3. Verificar que todas las áreas tengan costo mayor a 0
        $areasSinCosto = DB::table('olimpiada_area_categorias')
            ->where('id_olimpiada', $olimpiadaId)
            ->where(function($query) {
                $query->where('precio', '<=', 0)
                      ->orWhereNull('precio');
            })
            ->exists();

        if ($areasSinCosto) {
            return false;
        }

        return true;
    } catch (\Exception $e) {
        \Log::error("Error al verificar olimpiada completa {$olimpiadaId}: " . $e->getMessage());
        return false;
    }
}

}
