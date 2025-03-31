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
        $colegio = ColegioModel::create([
            'nombre_colegio' => $request->colegio['nombre_colegio'],
            'departamento' => $request->colegio['departamento'],
            'provincia' => $request->colegio['provincia'],
            
        ]);
        
        
        // 2. Registrar responsable
        $responsable = ResponsableInscripcionModel::create($request->responsable_inscripcion);

        
        // 3. Registrar tutor legal
        $tutorLegal = TutorLegalModel::create($request->tutor_legal);
        
        // 4. Registrar tutores académicos y sus áreas
        $tutoresMap = [];
        foreach ($request->tutores_academicos as $asignacion) {
            $tutorData = $asignacion['tutor'];
            $areaNombre = $asignacion['nombre_area'];

            $tutor = TutorAcademicoModel::create($tutorData);

            // Registrar el área si no existe
            $area = \App\Models\Inscripcion\AreaModel::firstOrCreate([
                'nombre_area' => $areaNombre
            ]);

            // Asociar área con tutor académico
            DB::table('area_tutor_academico')->insert([
                'area_id' => $area->id,
                'tutor_academico_id' => $tutor->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $tutoresMap[$areaNombre] = $tutor->id;
        }
        DB::commit();
        return response()->json(['message' => $tutoresMap], 201);
        // 5. Registrar áreas adicionales
        foreach ($request->areas_competencia as $areaData) {
            \App\Models\Inscripcion\AreaModel::firstOrCreate([
                'nombre_area' => $areaData['nombre_area'],
                'categoria' => $areaData['categoria'] ?? null
            ]);
        }

        // 6. Registrar estudiante
        $estudiante = EstudianteModel::create([
            'nombre' => $request->estudiante['nombre'],
            'apellido_pa' => $request->estudiante['apellido_pa'],
            'apellido_ma' => $request->estudiante['apellido_ma'],
            'ci' => $request->estudiante['ci'],
            'fecha_nacimiento' => $request->estudiante['fecha_nacimiento'],
            'correo' => $request->estudiante['correo'],
            'propietario_correo' => $request->estudiante['propietario_correo'],
            'id_unidad' => $colegio->id,
            'id_grado' => 1, // Esto deberías ajustarlo según tu lógica
            'id_tutor_legal' => $tutorLegal->id,
            'id_tutor_academico' => array_values($tutoresMap)[0] ?? null // por si solo uno es principal
        ]);

        // 7. Registrar inscripción
        $inscripcion = InscripcionModel::create([
            'estudiante_id' => $estudiante->id,
            'responsable_inscripcion_id' => $responsable->id,
            'tutor_legal_id' => $tutorLegal->id,
            'tutor_academico_id' => $estudiante->id_tutor_academico,
            'fecha' => now(),
        ]);

        // 8. Registrar relación inscripción ↔ área
        foreach ($request->areas_competencia as $areaData) {
            $area = \App\Models\Inscripcion\AreaModel::where('nombre_area', $areaData['nombre_area'])->first();

            if ($area) {
                InscripcionAreaModel::create([
                    'inscripcion_id' => $inscripcion->id,
                    'area_id' => $area->id
                ]);
            }
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
