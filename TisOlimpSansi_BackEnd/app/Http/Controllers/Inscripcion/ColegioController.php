<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\ColegioModel;
use Illuminate\Http\Request;

class ColegioController extends Controller
{
    public function index()
    {
        $colegios = ColegioModel::all();

        return response()->json([
            'status' => 200,
            'data' => $colegios
        ]);
    }

    public function store(Request $request)
    {
        $colegio = new ColegioModel();
        
        $colegio->nombre_colegio = $request->nombre_colegio;
        $colegio->departamento = $request->departamento;
        $colegio->provincia = $request->provincia;
        
        $colegio->save();
  
        return response()->json([
            'status' => 200,
            'message' => 'Colegio agregado exitosamente',
        ]);
    }

    public function show($id)
    {
        $colegio = ColegioModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $colegio,
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $colegio = ColegioModel::findOrFail($id);

        $colegio->nombre_colegio = $request->nombre_colegio;
        $colegio->departamento = $request->departamento;
        $colegio->provincia = $request->provincia;

        $colegio->save();

        return response()->json([
            'status' => 200,
            'message' => 'Colegio actualizado exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $colegio = ColegioModel::findOrFail($id);
        $colegio->delete();
       
        return response()->json([
            'status' => 200,
            'message' => 'Colegio eliminado exitosamente',
        ]);
    }

    
}
