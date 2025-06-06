<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\EstudianteModel;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    public function index()
    {
        $estudiantes = EstudianteModel::all();

        return response()->json([
            'status' => 200,
            'data' => $estudiantes,
        ]);
    }

    public function store(Request $request)
    {
        $estudiante = new EstudianteModel();

        $estudiante->id_unidad = $request->id_unidad;
        $estudiante->id_grado = $request->id_grado;
        $estudiante->id_tutor_legal = $request->id_tutor_legal;
        $estudiante->id_tutor_academico = $request->id_tutor_academico;
        $estudiante->nombre = $request->nombre;
        $estudiante->apellido_pa = $request->apellido_pa;
        $estudiante->apellido_ma = $request->apellido_ma;
        $estudiante->ci = $request->ci;
        $estudiante->fecha_nacimiento = $request->fecha_nacimiento;
        $estudiante->correo = $request->correo;
        $estudiante->propietario_correo = $request->propietario_correo;
        
        $estudiante->save();
  
        return response()->json([
            'status' => 200,
            'message' => 'Estudiante agregado exitosamente',
        ]);
    }

    public function show($id)
    {
        $estudiante = EstudianteModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $estudiante,
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $estudiante = EstudianteModel::findOrFail($id);

        $estudiante->id_unidad = $request->id_unidad;
        $estudiante->id_grado = $request->id_grado;
        $estudiante->id_tutor_legal = $request->id_tutor_legal;
        $estudiante->id_tutor_academico = $request->id_tutor_academico;
        $estudiante->nombre = $request->nombre;
        $estudiante->apellido_pa = $request->apellido_pa;
        $estudiante->apellido_ma = $request->apellido_ma;
        $estudiante->ci = $request->ci;
        $estudiante->fecha_nacimiento = $request->fecha_nacimiento;
        $estudiante->correo = $request->correo;
        $estudiante->propietario_correo = $request->propietario_correo;

        $estudiante->save();

        return response()->json([
            'status' => 200,
            'message' => 'Estudiante actualizado exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $estudiante = EstudianteModel::findOrFail($id);
        $estudiante->delete();
       
        return response()->json([
            'status' => 200,
            'message' => 'Estudiante eliminado exitosamente',
        ]);
    }
    public function buscarEstudiante($ci)
{
    $estudiante = EstudianteModel::where('ci', $ci)->first();
    
    if ($estudiante) {
        // Cargar la relación con el colegio para obtener datos completos
        $estudiante->load('colegio', 'grado');
        
        return response()->json([
            'found' => true,
            'estudiante' => $estudiante
        ]);
    }
    
    return response()->json([
        'found' => false,
        'message' => 'No se encontró estudiante con ese CI'
    ]);
}
}
