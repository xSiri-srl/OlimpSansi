<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\GradoModel;
use Illuminate\Http\Request;

class GradoController extends Controller
{
    public function index()
    {
        $grados = GradoModel::all();

        return response()->json([
            'status' => 200,
            'data' => $grados
        ]);
    }

    public function store(Request $request)
    {
        $grado = new GradoModel();
        
        $grado->nombre_grado = $request->nombre_grado;
        
        $grado->save();
  
        return response()->json([
            'status' => 200,
            'message' => 'Grado agregado exitosamente',
        ]);
    }

    public function show($id)
    {
        $grado = GradoModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $grado,
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $grado = GradoModel::findOrFail($id);

        $grado->nombre_grado = $request->nombre_grado;

        $grado->save();

        return response()->json([
            'status' => 200,
            'message' => 'Grado actualizado exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $grado = GradoModel::findOrFail($id);
        $grado->delete();
       
        return response()->json([
            'status' => 200,
            'message' => 'Grado eliminado exitosamente',
        ]);
    }
}
