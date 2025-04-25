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
}
