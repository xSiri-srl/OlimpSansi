<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\InscripcionAreaModel;
use App\Models\Inscripcion\InscripcionCategoriaModel;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\Inscripcion\TutorAcademicoModel;
use App\Models\Inscripcion\TutorLegalModel;
use App\Models\OrdenPago;
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
            $colegio = ColegioModel::create($request->colegio);
    
            // 2. Registrar responsable
            $responsable = ResponsableInscripcionModel::create($request->responsable_inscripcion);
    
            // 3. Registrar tutor legal
            $tutorLegal = TutorLegalModel::create($request->tutor_legal);
    
            // 4. Registrar o crear el grado (usando curso del colegio)
            $grado = GradoModel::firstOrCreate([
                'nombre_grado' => $request->colegio['curso']
            ]);
    
            // 5. Registrar estudiante
            $estudiante = EstudianteModel::create([
                'nombre' => $request->estudiante['nombre'],
                'apellido_pa' => $request->estudiante['apellido_pa'],
                'apellido_ma' => $request->estudiante['apellido_ma'],
                'ci' => $request->estudiante['ci'],
                'fecha_nacimiento' => $request->estudiante['fecha_nacimiento'],
                'correo' => $request->estudiante['correo'],
                'propietario_correo' => $request->estudiante['propietario_correo'],
                'id_unidad' => $colegio->id,
                'id_grado' => $grado->id,
                'id_tutor_legal' => $tutorLegal->id,
            ]);
            
            // 6. Crear orden de pago
            // Obtener el año actual
            $year = date('Y');
            
            // Calcular el monto total (20 Bs por cada área)
            $totalAreas = count($request->areas_competencia);
            $montoTotal = $totalAreas * 20;
            
            // Crear la orden de pago con un código temporal
            $ordenPago = OrdenPago::create([
                'codigo_generado' => 'TEMP', // Código temporal
                'monto_total' => $montoTotal,
                'fecha_emision' => now(),
            ]);
            
            // Actualizar el código generado con el formato TSOL-YYYY-XXXX
            $codigoGenerado = sprintf('TSOL-%s-%04d', $year, $ordenPago->id);
            $ordenPago->codigo_generado = $codigoGenerado;
            $ordenPago->save();
            
            // 7. Crear inscripción
            $inscripcion = InscripcionModel::create([
                'id_estudiante' => $estudiante->id,
                'id_responsable' => $responsable->id,
                'id_orden_pago' => $ordenPago->id,
            ]);
            
            
            // 8. Registrar áreas y categorías
            foreach ($request->areas_competencia as $areaData) {
                // Crear o buscar área
                $area = AreaModel::firstOrCreate([
                    'nombre_area' => $areaData['nombre_area']
                ]);
    
                // Crear o buscar categoría
                $categoria = CategoriaModel::firstOrCreate([
                    'id_area' => $area->id,
                    'nombre_categoria' => $areaData['categoria'] ?? 'General'
                ]);
    
                // Buscar el tutor correspondiente para esta área (desde el JSON)
                $tutorData = collect($request->tutores_academicos)
                    ->firstWhere('nombre_area', $areaData['nombre_area'])['tutor'] ?? null;
    
                if ($tutorData) {
                    // Registrar tutor académico
                    $tutor = TutorAcademicoModel::create($tutorData);
    
                    // Aquí puedes guardar si deseas una relación tutor ↔ categoría
                    // Ejemplo: guardar en `categoria_tutor_academico` si lo necesitas
                }
                DB::commit();
                // Guardar inscripción-categoría
                InscripcionCategoriaModel::create([
                    'id_inscripcion' => $inscripcion->id,
                    'id_categoria' => $categoria->id,
                    'id_tutor_academico' => $tutor->id,
                ]);
            }
    
            DB::commit();
            return response()->json([
                'message' => 'Inscripción registrada correctamente.',
                'codigo_generado' => $ordenPago->codigo_generado
            ], 201);

    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar la inscripción.',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
    

    public function registrarLista(Request $request)
{
    DB::beginTransaction();

    try {
        // 1. Registrar responsable una sola vez
        $responsable = ResponsableInscripcionModel::create($request->responsable_inscripcion);

        // 2. Calcular monto total por todas las áreas
        $totalAreas = 0;
        foreach ($request->inscripciones as $data) {
            $totalAreas += count($data['areas_competencia']);
        }

        $montoTotal = $totalAreas * 20;
        $year = date('Y');

        // 3. Crear una sola orden de pago
        $ordenPago = OrdenPago::create([
            'codigo_generado' => 'TEMP',
            'monto_total'     => $montoTotal,
            'fecha_emision'   => now(),
        ]);

        $codigoGenerado = sprintf('TSOL-%s-%04d', $year, $ordenPago->id);
        $ordenPago->codigo_generado = $codigoGenerado;
        $ordenPago->save();

        // 4. Recorrer las inscripciones
        foreach ($request->inscripciones as $data) {
            // Colegio
            $colegioData = $data['colegio'];
            $curso = $colegioData['curso'];
            unset($colegioData['curso']);

            $colegio = ColegioModel::firstOrCreate([
                'nombre_colegio' => $colegioData['nombre_colegio'],
                'departamento'   => $colegioData['departamento'],
                'provincia'      => $colegioData['provincia'],
            ]);

            // Tutor legal
            $tutorLegal = TutorLegalModel::firstOrCreate(
                ['ci' => $data['tutor_legal']['ci']],
                $data['tutor_legal']
            );

            // Grado
            $grado = GradoModel::firstOrCreate([
                'nombre_grado' => $curso
            ]);

            // Estudiante
            $estudiante = EstudianteModel::firstOrCreate(
                ['ci' => $data['estudiante']['ci']],
                [
                    'nombre'              => $data['estudiante']['nombre'],
                    'apellido_pa'         => $data['estudiante']['apellido_pa'],
                    'apellido_ma'         => $data['estudiante']['apellido_ma'],
                    'fecha_nacimiento'    => $data['estudiante']['fecha_nacimiento'],
                    'correo'              => $data['estudiante']['correo'],
                    'propietario_correo'  => $data['estudiante']['propietario_correo'],
                    'id_unidad'           => $colegio->id,
                    'id_grado'            => $grado->id,
                    'id_tutor_legal'      => $tutorLegal->id,
                ]
            );

            // Inscripción (usa la misma orden para todos)
            $inscripcion = InscripcionModel::create([
                'id_estudiante'   => $estudiante->id,
                'id_responsable'  => $responsable->id,
                'id_orden_pago'   => $ordenPago->id,
            ]);

            // Áreas y tutores
            foreach ($data['areas_competencia'] as $areaData) {
                $area = AreaModel::firstOrCreate([
                    'nombre_area' => $areaData['nombre_area']
                ]);

                $categoria = CategoriaModel::firstOrCreate([
                    'id_area'          => $area->id,
                    'nombre_categoria' => $areaData['categoria'] ?? 'General'
                ]);

                $tutorInfo = collect($data['tutores_academicos'])
                    ->firstWhere('nombre_area', $areaData['nombre_area']);

                $tutor = null;
                if ($tutorInfo && isset($tutorInfo['tutor'])) {
                    $tutor = TutorAcademicoModel::firstOrCreate(
                        ['ci' => $tutorInfo['tutor']['ci']],
                        $tutorInfo['tutor']
                    );
                }

                InscripcionCategoriaModel::create([
                    'id_inscripcion'    => $inscripcion->id,
                    'id_categoria'      => $categoria->id,
                    'id_tutor_academico'=> $tutor?->id,
                ]);
            }
        }

        DB::commit();

        return response()->json([
            'message' => 'Inscripciones registradas correctamente.',
            'codigo_generado' => $ordenPago->codigo_generado
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error'   => 'Error al registrar las inscripciones.',
            'detalle' => $e->getMessage()
        ], 500);
    }
}

    
    
    

}
