<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\olimpiada_area_categoria;
use App\Models\CategoriaGradoModel;

class CategoriaGradoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_categoria' => 'required|exists:categoria,id',
            'id_grado' => 'required|exists:grado,id',
        ]);

        $registro = CategoriaGradoModel::create([
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

        $datos = olimpiada_area_categoria::with([
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
}
