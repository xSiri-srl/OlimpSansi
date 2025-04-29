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
                    'nombre_categoria' => $areaData['categoria']
                ]);
                
                // Buscar el tutor correspondiente para esta área (desde el JSON)
                $tutorData = collect($request->tutores_academicos)
                ->firstWhere('nombre_area', $areaData['nombre_area'])['tutor'] ?? null;
            
            $tutor = null;
            
            // Verificar si hay datos completos del tutor
            if ($tutorData && !empty($tutorData['nombre']) && !empty($tutorData['apellido_pa']) && !empty($tutorData['ci']) && !empty($tutorData['correo'])) {
                // Si los datos son completos, crear el tutor académico
                $tutor = TutorAcademicoModel::create([
                    'nombre' => $tutorData['nombre'],
                    'apellido_pa' => $tutorData['apellido_pa'],
                    'apellido_ma' => $tutorData['apellido_ma'],
                    'ci' => $tutorData['ci'],
                    'correo' => $tutorData['correo']
                ]);
            
                // Aquí puedes guardar si deseas una relación tutor ↔ categoría
                // Ejemplo: guardar en `categoria_tutor_academico` si lo necesitas
            }
            
            // Guardar inscripción-categoría, asignando null si no hay tutor
            InscripcionCategoriaModel::create([
                'id_inscripcion' => $inscripcion->id,
                'id_categoria' => $categoria->id,
                'id_tutor_academico' => $tutor ? $tutor->id : null,
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
                'distrito'      => $colegioData['distrito'],
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
                    'nombre_categoria' => $areaData['categoria']
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

    
public function listarInscritos()
{
    $inscripciones = InscripcionModel::with([
        'estudiante.colegio', 
        'estudiante.grado',
        'estudiante.tutorLegal',
        'responsable',
        'ordenPago',
        'inscripcionCategoria.categoria.area',
        'inscripcionCategoria.tutorAcademico',
    ])->get();

    $resultado = $inscripciones->map(function ($inscripcion) {
        $estudiante = $inscripcion->estudiante;
        $tutorLegal = $estudiante->tutorLegal;
        $colegio = $estudiante->colegio;
        $grado = $estudiante->grado;

        $datos = [
            'apellido_pa'         => $estudiante->apellido_pa,
            'apellido_ma'         => $estudiante->apellido_ma,
            'nombre'              => $estudiante->nombre,
            'ci'                  => $estudiante->ci,
            'fecha_nacimiento'    => $estudiante->fecha_nacimiento,
            'correo'              => $estudiante->correo,
            'propietario_correo'  => $estudiante->propietario_correo,
            'curso'               => $grado->nombre_grado ?? null,
            'colegio'             => $colegio->nombre_colegio ?? null,
            'departamento'        => $colegio->departamento ?? null,
            'provincia'           => $colegio->distrito ?? null,
            'rol_tutor_legal'     => 'Tutor Legal',
            'tutor_legal_apellido_pa' => $tutorLegal->apellido_pa ?? null,
            'tutor_legal_apellido_ma' => $tutorLegal->apellido_ma ?? null,
            'tutor_legal_nombre'      => $tutorLegal->nombre ?? null,
            'tutor_legal_ci'          => $tutorLegal->ci ?? null,
            'tutor_legal_correo'      => $tutorLegal->correo ?? null,
            'tutor_legal_telefono'    => $tutorLegal->numero_celular ?? null,
        ];

        $tutores = $inscripcion->inscripcionCategoria->map(function ($cat) {
            $tutor = $cat->tutorAcademico;
            $categoria = $cat->categoria;
            $area = $categoria?->area;
        
            return [
                'nombre_area' => $area?->nombre_area ?? null,
                'categoria'   => $categoria?->nombre_categoria ?? null,
                'tutor_academico_apellido_pa' => $tutor->apellido_pa ?? null,
                'tutor_academico_apellido_ma' => $tutor->apellido_ma ?? null,
                'tutor_academico_nombre'      => $tutor->nombre ?? null,
                'tutor_academico_ci'          => $tutor->ci ?? null,
                'tutor_academico_correo'      => $tutor->correo ?? null,
            ];
        });

        return $tutores->map(function ($tutor) use ($datos) {
            return array_merge($datos, $tutor);
        });
    })->flatten(1);

    return response()->json($resultado);
}


    public function contarPreinscritos()
    {
        $estudiantes = DB::table('inscripcion')
            ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
            ->join('estudiante', 'inscripcion.id_estudiante', '=', 'estudiante.id')
            ->whereNull('orden_pagos.fecha_subida_imagen_comprobante')
            ->select(
                'estudiante.nombre',
                'estudiante.apellido_pa',
                'estudiante.apellido_ma',
                'estudiante.ci as carnet_identidad',
                DB::raw("DATE(estudiante.fecha_nacimiento) as fecha_nacimiento"),
                'estudiante.correo',
                'estudiante.propietario_correo'
            )
            ->distinct()
            ->get();

        return response()->json([
            'estudiantes_no_pagados' => $estudiantes
        ]);
    }


    public function contarInscritos()
    {
        $estudiantes = DB::table('inscripcion')
            ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
            ->join('estudiante', 'inscripcion.id_estudiante', '=', 'estudiante.id')
            ->whereNotNull('orden_pagos.fecha_subida_imagen_comprobante')
            ->select(
                'estudiante.nombre',
                'estudiante.apellido_pa',
                'estudiante.apellido_ma',
                'estudiante.ci as carnet_identidad',
                DB::raw("DATE(estudiante.fecha_nacimiento) as fecha_nacimiento"),
                'estudiante.correo',
                'estudiante.propietario_correo'
            )
            ->distinct()
            ->get();

        return response()->json([
            'estudiantes_que_pagaron' => $estudiantes
        ]);
    }

    public function inscripcionesPorArea()
    {
        $areas = AreaModel::all();
        $resultado = [];
    
        foreach ($areas as $area) {
            // Contar inscritos (con comprobante) a través de categoria
            $inscritos = DB::table('inscripcion_categoria')
                ->join('categoria', 'inscripcion_categoria.id_categoria', '=', 'categoria.id')
                ->join('inscripcion', 'inscripcion_categoria.id_inscripcion', '=', 'inscripcion.id')
                ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
                ->where('categoria.id_area', $area->id)
                ->whereNotNull('orden_pagos.comprobante_url')
                ->count();
                
            // Contar preinscritos (sin comprobante pero con orden de pago) a través de categoria
            $preinscritos = DB::table('inscripcion_categoria')
                ->join('categoria', 'inscripcion_categoria.id_categoria', '=', 'categoria.id')
                ->join('inscripcion', 'inscripcion_categoria.id_inscripcion', '=', 'inscripcion.id')
                ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
                ->where('categoria.id_area', $area->id)
                ->whereNull('orden_pagos.comprobante_url')
                ->whereNotNull('orden_pagos.orden_pago_url')
                ->count();
                
            $resultado[] = [
                'area' => $area->nombre_area,
                'inscritos' => $inscritos,
                'preinscritos' => $preinscritos
            ];
        }
        
        return response()->json($resultado);
    }

public function inscripcionesPorCategoria()
{
    $categorias = CategoriaModel::with('area')->get();
    $resultado = [];

    foreach ($categorias as $categoria) {
        // Contar inscritos (con comprobante)
        $inscritos = DB::table('inscripcion_categoria')
            ->join('inscripcion', 'inscripcion_categoria.id_inscripcion', '=', 'inscripcion.id')
            ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
            ->where('inscripcion_categoria.id_categoria', $categoria->id)
            ->whereNotNull('orden_pagos.comprobante_url')
            ->count();
            
        // Contar preinscritos (sin comprobante pero con orden de pago)
        $preinscritos = DB::table('inscripcion_categoria')
            ->join('inscripcion', 'inscripcion_categoria.id_inscripcion', '=', 'inscripcion.id')
            ->join('orden_pagos', 'inscripcion.id_orden_pago', '=', 'orden_pagos.id')
            ->where('inscripcion_categoria.id_categoria', $categoria->id)
            ->whereNull('orden_pagos.comprobante_url')
            ->whereNotNull('orden_pagos.orden_pago_url')
            ->count();
            
        $resultado[] = [
            'categoria' => $categoria->nombre_categoria . ' (' . $categoria->area->nombre_area . ')',
            'inscritos' => $inscritos,
            'preinscritos' => $preinscritos
        ];
    }
    
    return response()->json($resultado);
}
        

}
