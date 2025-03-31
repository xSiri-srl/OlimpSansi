<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\Inscripcion\InscripcionAreaModel;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\Inscripcion\TutorAcademicoModel;
use App\Models\Inscripcion\TutorLegalModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InscripcionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function registrar(Request $request)
    {
        DB::beginTransaction();

        try {
            // 1. Registrar colegio
            $colegio = ColegioModel::registrarDesdeRequest($request->colegio);

            // 2. Registrar estudiante
            $estudiante = EstudianteModel::registrarDesdeRequest($request->estudiante, $colegio->id);

            // 3. Registrar responsable y tutores
            $responsable = ResponsableInscripcionModel::registrarDesdeRequest($request->responsable_inscripcion);
            $tutorLegal = TutorLegalModel::registrarDesdeRequest($request->tutor_legal);
            $tutorAcademico = TutorAcademicoModel::registrarDesdeRequest($request->tutor_academico);

            // 4. Registrar inscripción
            $inscripcion = InscripcionModel::create([
                'estudiante_id' => $estudiante->id,
                'responsable_inscripcion_id' => $responsable->id,
                'tutor_legal_id' => $tutorLegal->id,
                'tutor_academico_id' => $tutorAcademico->id,
                'fecha' => now(),
            ]);

            // 5. Registrar áreas
            foreach ($request->areas as $area) {
                InscripcionAreaModel::create([
                    'inscripcion_id' => $inscripcion->id,
                    'area_id' => $area['area_id']
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Inscripción registrada correctamente.'], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Error al registrar la inscripción.',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
}
