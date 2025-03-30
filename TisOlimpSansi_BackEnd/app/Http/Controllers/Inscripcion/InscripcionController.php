<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\OrdenPago;
use App\Models\Inscripcion\InscripcionAreaModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;

class InscripcionController extends Controller
{
    /**
     * Obtener todas las inscripciones.
     */
    public function index()
    {
        $inscripciones = InscripcionModel::with(['inscripcionArea', 'responsable', 'estudiante', 'ordenPago'])->get();
        return response()->json($inscripciones);
    }

    /**
     * Crear una nueva inscripción.
     */
    public function store(Request $request)
    {
        
        $inscripcion = InscripcionModel::create($request->all());
        return response()->json($inscripcion, 201);
    }

    /**
     * Obtener una inscripción específica.
     */
    public function show($id)
    {
        $inscripcion = InscripcionModel::with(['inscripcionArea', 'responsable', 'estudiante', 'ordenPago'])->findOrFail($id);
        return response()->json($inscripcion);
    }

    /**
     * Actualizar una inscripción.
     */
    public function update(Request $request, $id)
    {
        $inscripcion = InscripcionModel::findOrFail($id);
        
      
        
        $inscripcion->update($request->all());
        return response()->json($inscripcion);
    }

    /**
     * Eliminar una inscripción.
     */
    public function destroy($id)
    {
        $inscripcion = InscripcionModel::findOrFail($id);
        $inscripcion->delete();

        return response()->json(['message' => 'Inscripción eliminada correctamente']);
    }
}
