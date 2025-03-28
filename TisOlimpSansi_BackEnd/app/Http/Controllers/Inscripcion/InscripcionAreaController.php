<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\InscripcionAreaModel;
use Illuminate\Http\Request;

class InscripcionAreaController extends Controller
{
    
    public function index()
    {
        $inscripcionArea = InscripcionAreaModel::all();

        return response()->json([
            'status' => 200,
            'data' => $inscripcionArea
        ]);
    }

    public function store(Request $request)
    {
        $inscripcionArea = new InscripcionAreaModel();
        
        $inscripcionArea->id_inscripcion = $request->id_inscripcion;
        $inscripcionArea->id_area = $request->id_area;
        $inscripcionArea->id_categoria = $request->id_categoria;
        
        $inscripcionArea->save();
  
        return response()->json([
            'status' => 200,
            'message' => 'Area de inscripcion agregada exitosamente',
        ]);
    }

    public function show($id)
    {
        $inscripcionArea = InscripcionAreaModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $inscripcionArea,
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $inscripcionArea = InscripcionAreaModel::findOrFail($id);

        $inscripcionArea->id_inscripcion = $request->id_inscripcion;
        $inscripcionArea->id_area = $request->id_area;
        $inscripcionArea->id_categoria = $request->id_categoria;

        $inscripcionArea->save();

        return response()->json([
            'status' => 200,
            'message' => 'Area de inscripcion actualizada exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $inscripcionArea = InscripcionAreaModel::findOrFail($id);
        $inscripcionArea->delete();
       
        return response()->json([
            'status' => 200,
            'message' => 'Area de inscripcion eliminada exitosamente',
        ]);
    }
}
