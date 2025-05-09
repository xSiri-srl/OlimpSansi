<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OlimpiadaModel;
use Illuminate\Support\Facades\Auth;

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

}
