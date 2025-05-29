<?php

namespace App\Http\Controllers\Inscripcion;
use App\Http\Controllers\Controller;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\CategoriaGradoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriaController extends Controller
{
    public function index(){
        $categorias = CategoriaModel::with(['area', 'grados'])->get();

        return response()->json([
            'status' => 200,
            'data' => $categorias,
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'id_area' => 'required|exists:area,id',
            'nombre_categoria' => 'required|string|max:255',
            'grados' => 'sometimes|array',
            'grados.*' => 'exists:grado,id',
        ]);

        DB::beginTransaction();
        try {
            $categoria = CategoriaModel::create([
                'id_area' => $request->id_area,
                'nombre_categoria' => $request->nombre_categoria,
            ]);

            // Asociar grados si se proporcionan
            if ($request->has('grados') && is_array($request->grados)) {
                foreach ($request->grados as $gradoId) {
                    CategoriaGradoModel::create([
                        'id_categoria' => $categoria->id,
                        'id_grado' => $gradoId,
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Categoría agregada exitosamente',
                'data' => $categoria->load(['area', 'grados']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Error al crear la categoría: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id){
        $categoria = CategoriaModel::with(['area', 'grados'])->findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $categoria,
        ]);
    }

    public function update(Request $request, $id){
        $request->validate([
            'id_area' => 'required|exists:area,id',
            'nombre_categoria' => 'required|string|max:255',
            'grados' => 'sometimes|array',
            'grados.*' => 'exists:grado,id',
        ]);

        DB::beginTransaction();
        try {
            $categoria = CategoriaModel::findOrFail($id);
            $categoria->update([
                'id_area' => $request->id_area,
                'nombre_categoria' => $request->nombre_categoria,
            ]);

            // Actualizar grados asociados
            if ($request->has('grados')) {
                // Eliminar asociaciones existentes
                CategoriaGradoModel::where('id_categoria', $categoria->id)->delete();
                
                // Crear nuevas asociaciones
                foreach ($request->grados as $gradoId) {
                    CategoriaGradoModel::create([
                        'id_categoria' => $categoria->id,
                        'id_grado' => $gradoId,
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Categoría actualizada exitosamente',
                'data' => $categoria->load(['area', 'grados']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Error al actualizar la categoría: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id){
        $categoria = CategoriaModel::findOrFail($id);
        $categoria->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Categoría eliminada exitosamente',
        ]);
    }

    // Método para obtener categorías con sus grados por área
    public function getCategoriasPorArea($idArea){
        $categorias = CategoriaModel::with('grados')
            ->where('id_area', $idArea)
            ->get();
            
        return response()->json([
            'status' => 200,
            'data' => $categorias,
        ]);
    }
}