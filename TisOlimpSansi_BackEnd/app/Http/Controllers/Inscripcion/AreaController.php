<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function index(){
        $areas = AreaModel::all();

        return response()->json([
            'status' => 200,
            'data' => $areas,
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'nombre_area' => 'required|string|max:255',
        ]);

        $area = AreaModel::create([
            'nombre_area' => $request->nombre_area,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Área agregada exitosamente',
            'data' => $area,
        ]);
    }

    public function show($id){
        $area = AreaModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $area,
        ]);
    }

    public function update(Request $request, $id){
        $request->validate([
            'nombre_area' => 'required|string|max:255',
        ]);

        $area = AreaModel::findOrFail($id);
        $area->update([
            'nombre_area' => $request->nombre_area,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Área actualizada exitosamente',
            'data' => $area,
        ]);
    }

    public function destroy($id){
        $area = AreaModel::findOrFail($id);
        $area->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Área eliminada exitosamente',
        ]);
    }
}
