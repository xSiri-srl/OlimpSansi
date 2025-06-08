<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GestionOlimpiadas\OlimpiadaAreaCategoriaModel;
use App\Models\Inscripcion\CategoriaGradoModel as InscripcionCategoriaGradoModel;

class CategoriaGradoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_categoria' => 'required|exists:categoria,id',
            'id_grado' => 'required|exists:grado,id',
        ]);

        $registro = InscripcionCategoriaGradoModel::create([
            'id_categoria' => $request->id_categoria,
            'id_grado' => $request->id_grado,
        ]);

        return response()->json([
            'message' => 'Relación categoría-grado creada correctamente.',
            'data' => $registro
        ], 201);
    }

    public function obtenerCategoriasPorGrado(Request $request)
    {
        $olimpiadaId = $request->id;

        $datos = OlimpiadaAreaCategoriaModel::with([
            'area',
            'categoria.grado.grado'
        ])->where('id_olimpiada', $olimpiadaId)->get();

        $resultado = [];

        foreach ($datos as $registro) {
            $categoria = $registro->categoria;
            $area = $registro->area;

            foreach ($categoria->grado as $categoriaGrado) {
                $grado = $categoriaGrado->grado;

                if (!$grado) continue;

                $nombreGrado = $grado->nombre_grado;
                $nombreArea = $area->nombre_area;
                $nombreCategoria = $categoria->nombre_categoria;

                $resultado[$nombreGrado]['areas'][$nombreArea][] = $nombreCategoria;
            }
        }

        return response()->json($resultado);
    }
    public function obtenerCategoriasPorGradoPost(Request $request)
{
    $olimpiadaId = $request->olimpiadaId; // Cambié de $request->id a $request->olimpiadaId

    $datos = OlimpiadaAreaCategoriaModel::with([
        'area',
        'categoria.grados' // Usando la relación belongsToMany correcta
    ])->where('id_olimpiada', $olimpiadaId)->get();

    $resultado = [];

    foreach ($datos as $registro) {
        $categoria = $registro->categoria;
        $area = $registro->area;

        // Verificar que existan los datos necesarios
        if (!$categoria || !$area || !$categoria->grados) {
            continue;
        }

        $nombreArea = $area->nombre_area;
        $nombreCategoria = $categoria->nombre_categoria;

        // Iterar sobre los grados relacionados con la categoría
        foreach ($categoria->grados as $grado) {
            $nombreGrado = $grado->nombre_grado;
            
            // Evitar duplicados en el array
            if (!isset($resultado[$nombreGrado]['areas'][$nombreArea])) {
                $resultado[$nombreGrado]['areas'][$nombreArea] = [];
            }
            
            if (!in_array($nombreCategoria, $resultado[$nombreGrado]['areas'][$nombreArea])) {
                $resultado[$nombreGrado]['areas'][$nombreArea][] = $nombreCategoria;
            }
        }
    }

    return response()->json($resultado);
}
}
