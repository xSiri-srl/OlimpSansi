<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        $olimpiada = OlimpiadaModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $olimpiada,
        ]);
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
        $olimpiadas = OlimpiadaModel::select('id', 'titulo')->get();

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
}
