<?php

namespace App\Http\Controllers\Inscripcion;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion\ColegioModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ColegioController extends Controller
{
    public function index()
    {
        $colegios = ColegioModel::all();

        return response()->json([
            'status' => 200,
            'data' => $colegios
        ]);
    }

    public function store(Request $request)
    {
        $colegio = new ColegioModel();
        
        $colegio->nombre_colegio = $request->nombre_colegio;
        $colegio->departamento = $request->departamento;
        $colegio->provincia = $request->provincia;
        
        $colegio->save();
  
        return response()->json([
            'status' => 200,
            'message' => 'Colegio agregado exitosamente',
        ]);
    }

    public function show($id)
    {
        $colegio = ColegioModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $colegio,
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $colegio = ColegioModel::findOrFail($id);

        $colegio->nombre_colegio = $request->nombre_colegio;
        $colegio->departamento = $request->departamento;
        $colegio->provincia = $request->provincia;

        $colegio->save();

        return response()->json([
            'status' => 200,
            'message' => 'Colegio actualizado exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $colegio = ColegioModel::findOrFail($id);
        $colegio->delete();
       
        return response()->json([
            'status' => 200,
            'message' => 'Colegio eliminado exitosamente',
        ]);
    }


    public function getByFiltro(Request $request)
    {
        $query = DB::table('colegio')
            ->select('nombre_colegio', 'departamento', 'distrito');
    
        if ($request->filled('departamento')) {
            $query->whereRaw('UPPER(departamento) LIKE ?', ['%' . strtoupper($request->departamento) . '%']);
        }
    
        if ($request->filled('distrito')) {
            $query->whereRaw('UPPER(distrito) LIKE ?', ['%' . strtoupper($request->distrito) . '%']);
        }
    
        if ($request->filled('nombre_colegio')) {
            $query->where('nombre_colegio', 'like', '%' . $request->nombre_colegio . '%');
        }
    
        return response()->json($query->get());
    }
    
    public function contarPorDepartamento(Request $request)
    {
        $departamento = $request->input('departamento');

        $cantidad = DB::table('estudiante')
            ->join('colegio', 'estudiante.id_unidad', '=', 'colegio.id')
            ->where('colegio.departamento', $departamento)
            ->count();

        return response()->json([
            'departamento' => $departamento,
            'cantidad_estudiantes' => $cantidad
        ]);
    }
    
    public function contarPorColegio(Request $request)
    {
        $nombreColegio = $request->input('colegio');

        $cantidad = DB::table('estudiante')
            ->join('colegio', 'estudiante.id_unidad', '=', 'colegio.id')
            ->where('colegio.nombre_colegio', $nombreColegio)
            ->count();

        return response()->json([
            'colegio' => $nombreColegio,
            'cantidad_estudiantes' => $cantidad
        ]);
    }
    
    public function contarPorGrado(Request $request)
    {
        $gradoEstudiante = $request->input('grado');

        $cantidad = DB::table('estudiante')
            ->join('grado', 'estudiante.id_grado', '=', 'grado.id')
            ->where('grado.nombre_grado', $gradoEstudiante)
            ->count();

        return response()->json([
            'grado' => $gradoEstudiante,
            'cantidad_estudiantes' => $cantidad
        ]);
    }



    public function filtrarPorCategoriaArea(Request $request)
    {
        $nombreArea = $request->input('nombre_area');
    
        if (!$nombreArea) {
            return response()->json(['error' => 'Debe proporcionar el nombre del área.'], 400);
        }
    
        $cantidad = DB::table('inscripcion_categoria')
            ->join('inscripcion', 'inscripcion.id', '=', 'inscripcion_categoria.id_inscripcion')
            ->join('estudiante', 'estudiante.id', '=', 'inscripcion.id_estudiante')
            ->join('categoria', 'categoria.id', '=', 'inscripcion_categoria.id_categoria')
            ->join('area', 'area.id', '=', 'categoria.id_area')
            ->where('area.nombre_area', $nombreArea)
            ->distinct('estudiante.id')
            ->count('estudiante.id');
    
        return response()->json([
            'nombre_area' => $nombreArea,
            'cantidad_estudiantes' => $cantidad
        ]);
    }
    public function contarInscritosPorDepartamento(Request $request)
{
    $departamento = $request->input('departamento');

    $cantidad = DB::table('estudiante')
        ->join('colegio', 'estudiante.id_unidad', '=', 'colegio.id')
        ->join('inscripcion', 'estudiante.id', '=', 'inscripcion.id_estudiante')
        ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
        ->where('colegio.departamento', $departamento)
        ->whereNotNull('orden_pago.comprobante_url') 
        ->count();

    return response()->json([
        'cantidad_estudiantes' => $cantidad
    ]);
}
public function contarPreinscritosPorDepartamento(Request $request)
{
    $departamento = $request->input('departamento');

    $cantidad = DB::table('estudiante')
        ->join('colegio', 'estudiante.id_unidad', '=', 'colegio.id')
        ->join('inscripcion', 'estudiante.id', '=', 'inscripcion.id_estudiante')
        ->join('orden_pago', 'inscripcion.id_orden_pago', '=', 'orden_pago.id')
        ->where('colegio.departamento', $departamento)
        ->whereNull('orden_pago.comprobante_url') 
        ->whereNotNull('orden_pago.orden_pago_url') 
        ->count();

    return response()->json([
        'cantidad_estudiantes' => $cantidad
    ]);
}
    
}
