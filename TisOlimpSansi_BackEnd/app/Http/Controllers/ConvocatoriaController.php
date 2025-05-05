<?php

namespace App\Http\Controllers;

use App\Models\ConvocatoriaModel;
use App\Models\Inscripcion\AreaModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConvocatoriaController extends Controller
{
    public function index()
    {
        $convocatorias = ConvocatoriaModel::all();
    
        $convocatoriasConArchivos = $convocatorias->map(function($convocatoria) {
            return [
                'id' => $convocatoria->id,
                'titulo' => $convocatoria->titulo,
                'id_area' => $convocatoria->id_area,
                'documento_pdf' => asset('storage/' . $convocatoria->documento_pdf),
            ];
        });
    
        return response()->json($convocatoriasConArchivos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'id_area' => 'required|integer|exists:area,id',
            'documento_pdf' => 'required|file|mimes:pdf|max:5120',
        ]);
    
        $archivoPDF = $request->file('documento_pdf');
        $nombreOriginal = $archivoPDF->getClientOriginalName();
        
        // Guardar el archivo con el nombre original
        $rutaPDF = $archivoPDF->storeAs('convocatorias/docsPDF', $nombreOriginal, 'public');
    
        $convocatoria = ConvocatoriaModel::create([
            'titulo' => $request->titulo,
            'id_area' => $request->id_area,
            'documento_pdf' => $rutaPDF,
        ]);
    
        return response()->json($convocatoria, 201);
    }
    

    public function show(string $id)
    {
        $convocatoria = ConvocatoriaModel::with('areaConvocatoria')->findOrFail($id);
    
        $convocatoriaConArchivo = [
            'id' => $convocatoria->id,
            'titulo' => $convocatoria->titulo,
            'id_area' => $convocatoria->id_area,
            'documento_pdf' => asset('storage/' . $convocatoria->documento_pdf),
        ];
    
        return response()->json($convocatoriaConArchivo);
    }

    public function update(Request $request, string $id)
    {
        $convocatoria = ConvocatoriaModel::findOrFail($id);
    
        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'id_area' => 'sometimes|integer|exists:area,id',
            'documento_pdf' => 'sometimes|file|mimes:pdf|max:5120',
        ]);
    
        if ($request->hasFile('documento_pdf')) {
            Storage::disk('public')->delete($convocatoria->documento_pdf);
            $archivoPDF = $request->file('documento_pdf');
            $nombreOriginal = $archivoPDF->getClientOriginalName();
            $rutaPDF = $archivoPDF->storeAs('convocatorias/docsPDF', $nombreOriginal, 'public');
            $convocatoria->documento_pdf = $rutaPDF;
        }
    
        $convocatoria->update($request->only(['titulo', 'descripcion', 'id_area']));
        return response()->json($convocatoria);
    }
    

    public function destroy(string $id)
    {
        $convocatoria = ConvocatoriaModel::findOrFail($id);
        Storage::disk('public')->delete($convocatoria->documento_pdf);
        $convocatoria->delete();
        return response()->json(['mensaje' => 'Convocatoria eliminada correctamente']);
    }

    public function convocatoriaPorArea(string $id)
    {
        $convocatorias = ConvocatoriaModel::where('id_area', $id)->first();
        if ($convocatorias) {
            return response()->json([
                'status' => 200,
                'existe' => true,
                'data' => $convocatorias
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'existe' => false,
            ]);
        }
    }
}
