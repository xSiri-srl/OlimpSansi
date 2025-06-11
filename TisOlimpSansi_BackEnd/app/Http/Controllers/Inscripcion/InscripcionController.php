<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\Inscripcion\TutorAcademicoModel;
use App\Models\GestionOlimpiadas\OlimpiadaAreaCategoriaModel;
use App\Models\Inscripcion\TutorLegalModel;
use App\Models\GestionOlimpiadas\OlimpiadaModel;
use App\Models\GestionPagos\OrdenPagoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InscripcionController extends Controller
{
public function registrar(Request $request)
{
    DB::beginTransaction();

    try {
        $data = $request->json()->all();

        // RESPONSABLE_INSCRIPCION
        $responsable = ResponsableInscripcionModel::firstOrCreate(
            ['ci' => $data['responsable_inscripcion']['ci']],
            $data['responsable_inscripcion']
        );

        if (!$responsable || !$responsable->id) {
            throw new \Exception("No se pudo registrar o recuperar el responsable de inscripción.");
        }

        // COLEGIO y GRADO
        $colegio = ColegioModel::firstOrCreate(
            ['nombre_colegio' => $data['colegio']['nombre_colegio']],
            [
                'departamento' => $data['colegio']['departamento'],
                'distrito' => $data['colegio']['distrito'],
            ]
        );
        $grado = GradoModel::where('nombre_grado', $data['colegio']['curso'])->firstOrFail();

       
        // ESTUDIANTE (verificar si ya existe)
        $estudiante = EstudianteModel::where([
            'nombre' => $data['estudiante']['nombre'],
            'apellido_pa' => $data['estudiante']['apellido_pa'],
            'apellido_ma' => $data['estudiante']['apellido_ma'],
            'ci' => $data['estudiante']['ci'],
            'id_grado' => $grado->id,
        ])->first();

        if (!$estudiante) {
            $estudiante = EstudianteModel::create([
                ...$data['estudiante'],
                'id_unidad' => $colegio->id,
                'id_grado' => $grado->id,
            ]);
        }

     
        $olimpiada = OlimpiadaModel::findOrFail($data['olimpiada']['id']);
        $limiteAreas = $olimpiada->max_materias;
        
        $cantidadInscripciones = InscripcionModel::where('id_estudiante', $estudiante->id)->count();
        if ($cantidadInscripciones + count($data['areas_competencia']) > $limiteAreas) {
                return response()->json([
                    'status' => 422,
                    'error' => "Este estudiante ya está inscrito en el límite de áreas permitidas ($limiteAreas)."
                ], 422);
            }

        // TUTOR LEGAL
        $tutorLegal = TutorLegalModel::firstOrCreate(
            ['ci' => $data['tutor_legal']['ci']],
            $data['tutor_legal']
        );

        if (!$tutorLegal || !$tutorLegal->id) {
            throw new \Exception("No se pudo registrar o recuperar el tutor legal.");
        }

        $ordenPago = OrdenPagoModel::create([
            'id_responsable' => $responsable->id,
            'codigo_generado' => '',
            'monto_total' => 0,
            'estado' => 'pendiente',
        ]);
       

        $total = 0;
        $inscripcionesPorArea = [];

        foreach ($data['areas_competencia'] as $item) {
            $area = AreaModel::where('nombre_area', $item['nombre_area'])->firstOrFail();
            $categoria = CategoriaModel::where('nombre_categoria', $item['categoria'])->firstOrFail();
            
            $yaInscrito = InscripcionModel::join('olimpiada_area_categoria as oac', 'inscripcion.id_olimpiada_area_categoria', '=', 'oac.id')->where([
                        ['inscripcion.id_estudiante', $estudiante->id],
                        ['oac.id_olimpiada', $olimpiada->id],
                        ['oac.id_area', $area->id],
                        ['oac.id_categoria', $categoria->id],
                    ])->exists();

                if ($yaInscrito) {
                    
                     return response()->json([
                    'status' => 500,
                    'error' => "El estudiante '{$estudiante->nombre} {$estudiante->apellido_pa}' ya está inscrito en el área '{$area->nombre_area}' y categoría '{$categoria->nombre_categoria}' para esta olimpiada."
                ], 500);
                    
                }
                
            $oac = DB::table('olimpiada_area_categoria')
                ->where([
                    ['id_olimpiada', '=', $data['olimpiada']['id']],
                    ['id_area', '=', $area->id],
                    ['id_categoria', '=', $categoria->id],
                ])
                ->first();

            if (!$oac) {
                
                throw new \Exception("Combinación inválida de área/categoría para la olimpiada.");
            }

            $inscripcion = InscripcionModel::create([
                'id_estudiante' => $estudiante->id,
                'id_tutor_legal' => $tutorLegal->id,
                'id_olimpiada_area_categoria' => $oac->id,
                'id_orden_pago' => $ordenPago->id,
                'id_tutor_academico' => null,
            ]);

            $inscripcionesPorArea[$area->id] = $inscripcion;
            $total += floatval($oac->precio);
        }
        $year = date('Y');
        $ordenPago->update([
            'monto_total' => $total,
            'codigo_generado' => sprintf('TSOL-%s-%04d', $year, $ordenPago->id),
        ]);

        if (!empty($data['tutores_academicos']) && is_array($data['tutores_academicos'])) {
            foreach ($data['tutores_academicos'] as $item) {
                if (!empty($item['checkbox_activo'])) {
                    $area = AreaModel::where('nombre_area', $item['nombre_area'])->firstOrFail();

                    $tutor = TutorAcademicoModel::firstOrCreate(
                        ['ci' => $item['tutor']['ci']],
                        $item['tutor']
                    );

                    if (isset($inscripcionesPorArea[$area->id])) {
                        $inscripcionesPorArea[$area->id]->update([
                            'id_tutor_academico' => $tutor->id,
                        ]);
                    }
                }
            }
        }


        DB::commit();

        return response()->json([
            'status' => 200,
            'message' => 'Inscripción registrada exitosamente.',
            'codigo_generado' => $ordenPago->codigo_generado
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function registrarLista(Request $request) 
{
    DB::beginTransaction();

    try {
        $data = $request->all();

        // Registrar Responsable (una vez)
        $responsable = ResponsableInscripcionModel::firstOrCreate(
            ['ci' => $data['responsable_inscripcion']['ci']],
            $data['responsable_inscripcion']
        );

        if (!$responsable || !$responsable->id) {
            throw new \Exception("No se pudo registrar o recuperar el responsable de inscripción.");
        }

        // Crear orden de pago temporal
        $ordenPago = OrdenPagoModel::create([
            'id_responsable' => $responsable->id,
            'codigo_generado' => '',
            'monto_total' => 0,
            'estado' => 'pendiente',
        ]);

        $total = 0;

        foreach ($data['estudiantes'] as $item) {
            // Colegio y grado
            $colegio = ColegioModel::firstOrCreate(
                ['nombre_colegio' => $item['colegio']['nombre_colegio']],
                [
                    'departamento' => $item['colegio']['departamento'],
                    'distrito'     => $item['colegio']['distrito'],
                ]
            );

            $grado = GradoModel::where('nombre_grado', $item['colegio']['curso'])->firstOrFail();

            // Estudiante
            $estudiante = EstudianteModel::firstOrCreate(
                ['ci' => $item['estudiante']['ci']],
                [
                    ...$item['estudiante'],
                    'id_unidad' => $colegio->id,
                    'id_grado'  => $grado->id,
                ]
            );

            // Validar límite de áreas permitidas
            $olimpiadaId = $data['olimpiada'];
            $olimpiada = OlimpiadaModel::findOrFail($olimpiadaId);
            $limiteAreas = $olimpiada->max_materias;
            
            // Contar inscripciones existentes EN LA MISMA OLIMPIADA
            $inscritasEnOlimpiada = InscripcionModel::join('olimpiada_area_categoria as oac', 'inscripcion.id_olimpiada_area_categoria', '=', 'oac.id')
                ->where([
                    ['inscripcion.id_estudiante', $estudiante->id],
                    ['oac.id_olimpiada', $olimpiadaId]
                ])->count();

            if ($inscritasEnOlimpiada + count($item['areas_competencia']) > $limiteAreas) {
                
                throw new \Exception("El estudiante '{$estudiante->nombre} {$estudiante->apellido_pa}' supera el límite de áreas permitidas para esta olimpiada.");
            }

            // Tutor legal
            $tutorLegal = TutorLegalModel::firstOrCreate(
                ['ci' => $item['tutor_legal']['ci']],
                $item['tutor_legal']
            );

            $inscripcionesPorArea = [];

            foreach ($item['areas_competencia'] as $areaItem) {
                // Buscar IDs de área y categoría
                $area = AreaModel::where('nombre_area', $areaItem['nombre_area'])->firstOrFail();
                $categoria = CategoriaModel::where('nombre_categoria', $areaItem['categoria'])->firstOrFail();

                // Obtener combinación válida
                $oac = OlimpiadaAreaCategoriaModel::where([
                    ['id_olimpiada', $olimpiadaId],
                    ['id_area', $area->id],
                    ['id_categoria', $categoria->id],
                ])->first();

                if (!$oac) {
                    $combinacionesValidas = DB::table('olimpiada_area_categoria as oac')
                        ->join('area as a', 'a.id', '=', 'oac.id_area')
                        ->join('categoria as c', 'c.id', '=', 'oac.id_categoria')
                        ->where('oac.id_olimpiada', $olimpiadaId)
                        ->select('a.nombre_area', 'c.nombre_categoria')
                        ->get();

                    $mensaje = "No está asociada esta área y/o categoría en la olimpiada. Combinaciones válidas:\n";

                    foreach ($combinacionesValidas as $combo) {
                        $mensaje .= "- {$combo->nombre_area} / {$combo->nombre_categoria}\n";
                    }
                    
                    throw new \Exception($mensaje);
                }

                // Validar si ya está inscrito en la misma área y categoría EN LA MISMA OLIMPIADA
                $yaInscrito = InscripcionModel::join('olimpiada_area_categoria as oac', 'inscripcion.id_olimpiada_area_categoria', '=', 'oac.id')
                    ->where([
                        ['inscripcion.id_estudiante', $estudiante->id],
                        ['oac.id_olimpiada', $olimpiadaId],
                        ['oac.id_area', $area->id],
                        ['oac.id_categoria', $categoria->id],
                    ])->exists();

                if ($yaInscrito) {
                   
                    throw new \Exception("El estudiante '{$estudiante->nombre} {$estudiante->apellido_pa}' ya está inscrito en el área '{$area->nombre_area}' y categoría '{$categoria->nombre_categoria}' para esta olimpiada.");
                }

                // Registrar inscripción
                $inscripcion = InscripcionModel::create([
                    'id_estudiante' => $estudiante->id,
                    'id_tutor_legal' => $tutorLegal->id,
                    'id_olimpiada_area_categoria' => $oac->id,
                    'id_orden_pago' => $ordenPago->id,
                    'id_tutor_academico' => null,
                ]);

                $inscripcionesPorArea[$area->id] = $inscripcion;
                $total += floatval($oac->precio ?? 0); // si existe columna precio
            }

            // Registrar tutores académicos
            if (!empty($item['tutores_academicos']) && is_array($item['tutores_academicos'])) {
                foreach ($item['tutores_academicos'] as $tutorItem) {
                    $area = AreaModel::where('nombre_area', $tutorItem['nombre_area'])->firstOrFail();

                    $tutor = TutorAcademicoModel::firstOrCreate(
                        ['ci' => $tutorItem['tutor']['ci']],
                        $tutorItem['tutor']
                    );

                    if (isset($inscripcionesPorArea[$area->id])) {
                        $inscripcionesPorArea[$area->id]->update([
                            'id_tutor_academico' => $tutor->id,
                        ]);
                    }
                }
            }
        }
        
        // Actualizar orden de pago final
        $year = date('Y');
        $ordenPago->update([
            'monto_total' => $total,
            'codigo_generado' => sprintf('TSOL-%s-%04d', $year, $ordenPago->id),
        ]);

        DB::commit();

        return response()->json([
            'status' => 200,
            'message' => 'Lista de inscripciones registrada exitosamente.',
            'codigo_generado' => $ordenPago->codigo_generado,
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => $e->getMessage(),
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



    public function inscripcionesPorArea(Request $request)
    {
        $olimpiadaId = $request->input('olimpiada_id');
        
        if (!$olimpiadaId) {
            return response()->json(['error' => 'ID de olimpiada requerido'], 400);
        }

        $areas = AreaModel::all();
        $resultado = [];

        foreach ($areas as $area) {
            // Contar inscritos (con comprobante) a través de olimpiada_area_categoria
            $inscritos = DB::table('inscripcion')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->join('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_area', $area->id)
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->whereNotNull('comprobante_pago.comprobante_url')
                ->count();
                
            // Contar preinscritos (sin comprobante pero con orden de pago)
            $preinscritos = DB::table('inscripcion')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->leftJoin('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_area', $area->id)
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->whereNull('comprobante_pago.comprobante_url')
                ->whereNotNull('orden_pago.orden_pago_url')
                ->count();
                
            // Solo incluir áreas que tengan al menos una inscripción o preinscripción
            if ($inscritos > 0 || $preinscritos > 0) {
                $resultado[] = [
                    'area' => $area->nombre_area,
                    'inscritos' => $inscritos,
                    'preinscritos' => $preinscritos
                ];
            }
        }
        
        return response()->json($resultado);
    }

    public function inscripcionesPorCategoria(Request $request)
    {
        $olimpiadaId = $request->input('olimpiada_id');
        
        if (!$olimpiadaId) {
            return response()->json(['error' => 'ID de olimpiada requerido'], 400);
        }

        $categorias = CategoriaModel::all();
        $resultado = [];

        foreach ($categorias as $categoria) {
            // Contar inscritos (con comprobante)
            $inscritos = DB::table('inscripcion')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->join('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_categoria', $categoria->id)
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->whereNotNull('comprobante_pago.comprobante_url')
                ->count();
                
            // Contar preinscritos (sin comprobante pero con orden de pago)
            $preinscritos = DB::table('inscripcion')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->leftJoin('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_categoria', $categoria->id)
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->whereNull('comprobante_pago.comprobante_url')
                ->whereNotNull('orden_pago.orden_pago_url')
                ->count();
                
            // Solo incluir categorías que tengan al menos una inscripción o preinscripción
            if ($inscritos > 0 || $preinscritos > 0) {
                $resultado[] = [
                    'categoria' => $categoria->nombre_categoria,
                    'inscritos' => $inscritos,
                    'preinscritos' => $preinscritos
                ];
            }
        }
        
        return response()->json($resultado);
    }
            
public function registrosPorCodigo(Request $request)
{
    try {
        $codigo = $request->input('codigo');

        $ordenPago = OrdenPagoModel::where('codigo_generado', $codigo)->first();

        if (!$ordenPago) {
            return response()->json([
                'status' => 404,
                'message' => 'Código no encontrado.'
            ], 404);
        }

        $inscripciones = InscripcionModel::with([
            'estudiante.grado',
            'estudiante.colegio',
            'tutorLegal',
            'tutorAcademico',
            'olimpiadaAreaCategoria.area',
            'olimpiadaAreaCategoria.categoria'
        ])->where('id_orden_pago', $ordenPago->id)->get();

        if ($inscripciones->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No se encontraron inscripciones asociadas a este código.'
            ], 404);
        }

        $resultados = [];

        foreach ($inscripciones as $inscripcion) {
            $estudiante = $inscripcion->estudiante;
            $grado = $estudiante->grado;
            $colegio = $estudiante->colegio;
            $tutorLegal = $inscripcion->tutorLegal ?? null;
            $tutorAcademico = $inscripcion->tutorAcademico ?? null;
            $responsable = $ordenPago->responsable;
            $areaCategoria = $inscripcion->olimpiadaAreaCategoria;
            $area = $areaCategoria->area;
            $categoria = $areaCategoria->categoria;
            $idOlimpiada = $areaCategoria->id_olimpiada;

            $resultados[] = [
                'id_inscripcion' => $inscripcion->id,
                'id_olimpiada' => $idOlimpiada,
                'responsable_inscripcion' => [
                    'nombre' => $responsable->nombre,
                    'apellido_pa' => $responsable->apellido_pa,
                    'apellido_ma' => $responsable->apellido_ma,
                    'ci' => $responsable->ci
                ],
                'estudiante' => [
                    'nombre' => $estudiante->nombre,
                    'apellido_pa' => $estudiante->apellido_pa,
                    'apellido_ma' => $estudiante->apellido_ma,
                    'ci' => $estudiante->ci,
                    'correo' => $estudiante->correo,
                    'fecha_nacimiento' => $estudiante->fecha_nacimiento,
                    'propietario_correo' => $estudiante->propietario_correo,
                ],
                'colegio' => [
                    'nombre_colegio' => $colegio->nombre_colegio,
                    'curso' => $grado->nombre_grado,
                    'departamento' => $colegio->departamento,
                    'distrito' => $colegio->distrito,
                ],
                'tutor_legal' => [
                    'nombre' => $tutorLegal->nombre ?? '',
                    'apellido_pa' => $tutorLegal->apellido_pa ?? '',
                    'apellido_ma' => $tutorLegal->apellido_ma ?? '',
                    'ci' => $tutorLegal->ci ?? '',
                    'correo' => $tutorLegal->correo ?? '',
                    'numero_celular' => $tutorLegal->numero_celular ?? '',
                    'tipo' => $tutorLegal->tipo ?? '',
                ],
                'areas_competencia' => [[
                    'nombre_area' => $area->nombre_area,
                    'categoria' => $categoria->nombre_categoria
                ]],
                'tutores_academicos' => [[
                    'nombre_area' => $area->nombre_area,
                    'tutor' => [
                        'nombre' => $tutorAcademico->nombre ?? '',
                        'apellido_pa' => $tutorAcademico->apellido_pa ?? '',
                        'apellido_ma' => $tutorAcademico->apellido_ma ?? '',
                        'ci' => $tutorAcademico->ci ?? '',
                        'correo' => $tutorAcademico->correo ?? '',
                    ]
                ]]
            ];
        }

        return response()->json($resultados);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function actualizarLista(Request $request)
{
    DB::beginTransaction();

    try {
        $data = $request->all();

        // Validar que existan estudiantes
        if (!isset($data['estudiantes']) || empty($data['estudiantes'])) {
            throw new \Exception("No se encontraron estudiantes para actualizar.");
        }

        // Procesar cada estudiante
        foreach ($data['estudiantes'] as $item) {
            // Validar que existe el id_inscripcion
            if (!isset($item['id_inscripcion'])) {
                throw new \Exception("Falta el id_inscripcion para actualizar el estudiante.");
            }

            // Buscar la inscripción existente
            $inscripcion = InscripcionModel::find($item['id_inscripcion']);
            if (!$inscripcion) {
                throw new \Exception("No se encontró la inscripción con ID: {$item['id_inscripcion']}");
            }

            $colegio = ColegioModel::where('nombre_colegio', $item['colegio']['nombre_colegio'])->first();

            // Buscar grado por nombre del curso
            $grado = GradoModel::where('nombre_grado', $item['colegio']['curso'])->first();
            if (!$grado) {
                throw new \Exception("No se encontró el grado: {$item['colegio']['curso']}");
            }

            // Actualizar Estudiante
            $estudiante = EstudianteModel::find($inscripcion->id_estudiante);
            if ($estudiante) {
                $estudiante->update([
                    'nombre'           => $item['estudiante']['nombre'],
                    'apellido_pa'      => $item['estudiante']['apellido_pa'],
                    'apellido_ma'      => $item['estudiante']['apellido_ma'],
                    'ci'               => $item['estudiante']['ci'],
                    'fecha_nacimiento' => $item['estudiante']['fecha_nacimiento'],
                    'correo'           => $item['estudiante']['correo'],
                    'propietario_correo' => $item['estudiante']['propietario_correo'],
                    'id_unidad'        => $colegio->id,
                    'id_grado'         => $grado->id,
                ]);
            } else {
                throw new \Exception("No se encontró el estudiante asociado a la inscripción ID: {$item['id_inscripcion']}");
            }

            // Si ya tiene un tutor legal asignado, actualizarlo
            $tutorLegal = TutorLegalModel::find($inscripcion->id_tutor_legal);
            if ($tutorLegal) {
                // Preparar datos para actualización
                $datosActualizacion = [
                    'nombre'         => $item['tutor_legal']['nombre'],
                    'apellido_pa'    => $item['tutor_legal']['apellido_pa'],
                    'apellido_ma'    => $item['tutor_legal']['apellido_ma'],
                    'ci'             => $item['tutor_legal']['ci'],
                    'complemento'    => $item['tutor_legal']['complemento'] ?? null,
                    'correo'         => $item['tutor_legal']['correo'],
                    'numero_celular' => $item['tutor_legal']['numero_celular'],
                    'tipo'           => $item['tutor_legal']['tipo'],
                ];
                                    
                $resultado = $tutorLegal->update($datosActualizacion);
            } else {
                throw new \Exception("No se encontró el tutor legal con ID: {$inscripcion->id_tutor_legal}");
            }
            

            // Actualizar área de competencia de la inscripción
            if (!empty($item['areas_competencia']) && is_array($item['areas_competencia']) && count($item['areas_competencia']) > 0) {
                $areaItem = $item['areas_competencia'][0]; // Tomamos la primera área
                
                $area = AreaModel::where('nombre_area', $areaItem['nombre_area'])->first();
                if (!$area) {
                    throw new \Exception("No se encontró el área: {$areaItem['nombre_area']}");
                }
                
                $categoria = CategoriaModel::where('nombre_categoria', $areaItem['categoria'])->first();
                if (!$categoria) {
                    throw new \Exception("No se encontró la categoría: {$areaItem['categoria']}");
                }

                // Buscar la combinación olimpiada-area-categoria
                $oac = DB::table('olimpiada_area_categoria')
                    ->where([
                        ['id_olimpiada', '=', $item['id_olimpiada']],
                        ['id_area', '=', $area->id],
                        ['id_categoria', '=', $categoria->id],
                    ])
                    ->first();

                if (!$oac) {
                    throw new \Exception("Combinación inválida de área/categoría para la olimpiada. Área: {$areaItem['nombre_area']}, Categoría: {$areaItem['categoria']}");
                }

                // Actualizar la inscripción con la nueva área/categoría
                $inscripcion->update([
                    'id_olimpiada_area_categoria' => $oac->id,
                ]);
            }

            // CORRECCIÓN: Actualizar Tutores Académicos
            if (!empty($item['tutores_academicos']) && is_array($item['tutores_academicos'])) {
                foreach ($item['tutores_academicos'] as $tutorItem) {
                    $area = AreaModel::where('nombre_area', $tutorItem['nombre_area'])->first();
                    if (!$area) {
                        throw new \Exception("No se encontró el área del tutor académico: {$tutorItem['nombre_area']}");
                    }
                    
                    // Verificar si la inscripción actual corresponde al área del tutor
                    $inscripcionActual = InscripcionModel::join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                        ->where('inscripcion.id', $inscripcion->id)
                        ->where('olimpiada_area_categoria.id_area', $area->id)
                        ->first();

                    if ($inscripcionActual) {
                        // Solo procesar si la inscripción ya tiene un tutor académico asignado
                        if ($inscripcion->id_tutor_academico) {
                            // Verificar si el CI está vacío o es cadena vacía
                            if (empty($tutorItem['tutor']['ci']) || $tutorItem['tutor']['ci'] === '') {
                                // Si el CI está vacío, remover la asignación del tutor académico
                                $inscripcion->update([
                                    'id_tutor_academico' => null,
                                ]);
                            } else {
                                // Verificar si el tutor tiene datos válidos (no vacíos)
                                if (!empty($tutorItem['tutor']['nombre'])) {
                                    // Actualizar el tutor académico existente
                                    $tutorAcademico = TutorAcademicoModel::find($inscripcion->id_tutor_academico);
                                    if ($tutorAcademico) {
                                        $tutorAcademico->update([
                                            'nombre'      => $tutorItem['tutor']['nombre'],
                                            'apellido_pa' => $tutorItem['tutor']['apellido_pa'],
                                            'apellido_ma' => $tutorItem['tutor']['apellido_ma'],
                                            'ci'          => $tutorItem['tutor']['ci'],
                                            'correo'      => $tutorItem['tutor']['correo'],
                                        ]);
                                    } else {
                                        throw new \Exception("No se encontró el tutor académico con ID: {$inscripcion->id_tutor_academico}");
                                    }
                                }
                            }
                        }
                        // Si id_tutor_academico es null, mantenerlo null (no hacer nada)
                    }
                }
            }
        }

        DB::commit();

        return response()->json([
            'status' => 200,
            'message' => 'Lista de inscripciones actualizada exitosamente.',
        ], 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 500,
            'message' => $e->getMessage(),
        ], 500);
    }
}
    public function contarPreinscritosPorOlimpiada(Request $request)
    {
        $olimpiadaId = $request->input('olimpiada_id');
        
        if (!$olimpiadaId) {
            return response()->json(['error' => 'ID de olimpiada requerido'], 400);
        }

        try {
            $estudiantes = DB::table('inscripcion')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->leftJoin('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->whereNull('comprobante_pago.numero_comprobante')
                ->count('inscripcion.id_estudiante');

            return response()->json([
                'estudiantes_no_pagados' => $estudiantes
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al contar pre-inscritos por olimpiada: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'estudiantes_no_pagados' => 0
            ], 500);
        }
    }

    public function contarInscritosPorOlimpiada(Request $request)
    {
        $olimpiadaId = $request->input('olimpiada_id');
        
        if (!$olimpiadaId) {
            return response()->json(['error' => 'ID de olimpiada requerido'], 400);
        }

        try {
            $estudiantes = DB::table('inscripcion')
                ->join('olimpiada_area_categoria', 'inscripcion.id_olimpiada_area_categoria', '=', 'olimpiada_area_categoria.id')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->join('comprobante_pago', 'orden_pago.id', '=', 'comprobante_pago.id_orden_pago')
                ->where('olimpiada_area_categoria.id_olimpiada', $olimpiadaId)
                ->whereNotNull('comprobante_pago.numero_comprobante')
                ->distinct('inscripcion.id_estudiante')
                ->count('inscripcion.id_estudiante');

            return response()->json([
                'estudiantes_que_pagaron' => $estudiantes
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al contar inscritos por olimpiada: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'estudiantes_que_pagaron' => 0
            ], 500);
        }
    }

    public function contarPreinscritos()
    {
        try {
            $estudiantes = DB::table('inscripcion')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->whereNull('orden_pago.numero_comprobante')
                ->distinct('inscripcion.id_estudiante')
                ->count('inscripcion.id_estudiante');

            return response()->json([
                'estudiantes_no_pagados' => $estudiantes
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al contar pre-inscritos: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'estudiantes_no_pagados' => 0
            ], 500);
        }
    }

    public function contarInscritos()
    {
        try {
            $estudiantes = DB::table('inscripcion')
                ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
                ->whereNotNull('orden_pago.numero_comprobante')
                ->distinct('inscripcion.id_estudiante')
                ->count('inscripcion.id_estudiante');

            return response()->json([
                'estudiantes_que_pagaron' => $estudiantes
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al contar inscritos: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'estudiantes_que_pagaron' => 0
            ], 500);
        }
    }


}
