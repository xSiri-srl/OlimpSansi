<?php

namespace App\Http\Controllers\Inscripcion;


use App\Http\Controllers\Controller;
use App\Models\Inscripcion\CategoriaModel;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(){
        $categorias = CategoriaModel::with('area')->get();

        return response()->json([
            'status' => 200,
            'data' => $categorias,
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'id_area' => 'required|exists:area,id',
            'nombre_categoria' => 'required|string|max:255',
        ]);

        $categoria = CategoriaModel::create([
            'id_area' => $request->id_area,
            'nombre_categoria' => $request->nombre_categoria,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Categoría agregada exitosamente',
            'data' => $categoria,
        ]);
    }

    public function show($id){
        $categoria = CategoriaModel::with('area')->findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $categoria,
        ]);
    }

    public function update(Request $request, $id){
        $request->validate([
            'id_area' => 'required|exists:area,id',
            'nombre_categoria' => 'required|string|max:255',
        ]);

        $categoria = CategoriaModel::findOrFail($id);
        $categoria->update([
            'id_area' => $request->id_area,
            'nombre_categoria' => $request->nombre_categoria,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Categoría actualizada exitosamente',
            'data' => $categoria,
        ]);
    }

    public function destroy($id){
        $categoria = CategoriaModel::findOrFail($id);
        $categoria->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Categoría eliminada exitosamente',
        ]);
    }
}
