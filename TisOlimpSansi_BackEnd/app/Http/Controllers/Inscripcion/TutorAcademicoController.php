<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\TutorAcademicoModel;
use Illuminate\Http\Request;

class TutorAcademicoController extends Controller
{
    public function index()
    {
        $tutorAcademico = TutorAcademicoModel::all();

        return response()->json([
            'status' => 200,
            'data' => $tutorAcademico,
        ]);
    }

    public function store(Request $request)
    {
        $tutorAcademico = new TutorAcademicoModel();
        
        $tutorAcademico->nombre = $request->nombre;
        $tutorAcademico->apellido_pa = $request->apellido_pa;
        $tutorAcademico->apellido_ma = $request->apellido_ma;
        $tutorAcademico->ci = $request->ci;
        $tutorAcademico->complemento = $request->complemento;
        $tutorAcademico->save();
  
          return response()->json([
              'status' => 200,
              'message' => 'Tutor academico agregado exitosamente',
          ]);
    }

    
    public function show($id)
    {
        $tutorAcademico = TutorAcademicoModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $tutorAcademico,
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $tutorAcademico = TutorAcademicoModel::findOrFail($id);

        $tutorAcademico->nombre = $request->nombre;
        $tutorAcademico->apellido_pa = $request->apellido_pa;
        $tutorAcademico->apellido_ma = $request->apellido_ma;
        $tutorAcademico->ci = $request->ci;
        $tutorAcademico->complemento = $request->complemento;

        $tutorAcademico->save();

        return response()->json([
            'status' => 200,
            'message' => 'Tutor academico actualizado exitosamente',
        ]);
    }
    public function buscarTutor($ci)
{
    $tutor = TutorAcademicoModel::where('ci', $ci)->first();
    
    if ($tutor) {
        return response()->json([
            'status' => 200,
            'found' => true,
            'tutor' => $tutor
        ]);
    } else {
        return response()->json([
            'status' => 404,
            'found' => false,
            'message' => 'No se encontró ningún tutor académico con ese CI'
        ]);
    }
}

    public function destroy($id)
    {
        $tutorAcademico = TutorAcademicoModel::findOrFail($id);
        $tutorAcademico->delete();

       
        return response()->json([
            'status' => 200,
            'message' => '  Tutor academico eliminado exitosamente',
        ]);
    }
}
