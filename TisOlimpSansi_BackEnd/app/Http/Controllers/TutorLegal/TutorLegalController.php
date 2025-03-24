<?php

namespace App\Http\Controllers\TutorLegal;

use App\Models\TutorLegal\TutorLegalModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TutorLegalController extends Controller
{
    
    public function index()
    {
        $tutorLegal = TutorLegalModel::all();

        return response()->json([
            'status' => 200,
            'data' => $tutorLegal,
        ]);
    }


    public function store(Request $request)
    {
      $tutorLegal = new TutorLegalModel();

      $tutorLegal->nombre = $request->nombre;
      $tutorLegal->apellido_pa = $request->apellido_pa;
      $tutorLegal->apellido_ma = $request->apellido_ma;
      $tutorLegal->ci = $request->ci;
      $tutorLegal->complemento = $request->complemento;
      $tutorLegal->correo = $request->correo;
      $tutorLegal->numero_celular = $request->numero_celular;
      $tutorLegal->tipo = $request->tipo;
      $tutorLegal->fecha_registro = $request->fecha_registro;
      $tutorLegal->fecha_actualizacion = $request->fecha_actualizacion;
      $tutorLegal->save();

        return response()->json([
            'status' => 200,
            'message' => 'Tutor legal agregado exitosamente',
        ]);
    }

   
    public function show($id)
    {
        $tutorLegal = TutorLegalModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $tutorLegal,
        ]);
    }
   
    public function update(Request $request, $id)
    {
        $tutorLegal = TutorLegalModel::findOrFail($id);

        $tutorLegal->nombre = $request->nombre;
        $tutorLegal->apellido_pa = $request->apellido_pa;
        $tutorLegal->apellido_ma = $request->apellido_ma;
        $tutorLegal->ci = $request->ci;
        $tutorLegal->complemento = $request->complemento;
        $tutorLegal->correo = $request->correo;
        $tutorLegal->numero_celular = $request->numero_celular;
        $tutorLegal->tipo = $request->tipo;
        $tutorLegal->fecha_registro = $request->fecha_registro;
        $tutorLegal->fecha_actualizacion = $request->fecha_actualizacion;

        $tutorLegal->save();

        return response()->json([
            'status' => 200,
            'message' => 'Tutor legal actualizado exitosamente',
        ]);
    }

   
    public function destroy($id)
    {
        $tutorLegal = TutorLegalModel::findOrFail($id);
        $tutorLegal->delete();

       
        return response()->json([
            'status' => 200,
            'message' => 'Tutor legal eliminado exitosamente',
        ]);
    }
}
