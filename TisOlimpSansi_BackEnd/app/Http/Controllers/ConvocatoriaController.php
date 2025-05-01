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
                'descripcion' => $convocatoria->descripcion,
                'id_area' => $convocatoria->id_area,
                'imagen' => asset('storage/' . $convocatoria->imagen),
                'documento_pdf' => asset('storage/' . $convocatoria->documento_pdf),
            ];
        });
    
        return response()->json($convocatoriasConArchivos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'id_area' => 'required|integer|exists:area,id',
            'imagen' => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'documento_pdf' => 'required|file|mimes:pdf|max:5120',
        ]);

        // Guardar archivos
        $rutaImagen = $request->file('imagen')->store('convocatorias/imagenes', 'public');
        $rutaPDF = $request->file('documento_pdf')->store('convocatorias/docsPDF', 'public');

        $convocatoria = ConvocatoriaModel::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'id_area' => $request->id_area,
            'imagen' => $rutaImagen,
            'documento_pdf' => $rutaPDF,
        ]);

        return response()->json($convocatoria, 201);
    }

    // Mostrar una convocatoria específica
    public function show(string $id)
    {
        $convocatoria = ConvocatoriaModel::with('areaConvocatoria')->findOrFail($id);
        return response()->json($convocatoria);
    }


    // Actualizar una convocatoria
    public function update(Request $request, string $id)
    {
        $convocatoria = ConvocatoriaModel::findOrFail($id);

        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'id_area' => 'sometimes|integer|exists:area,id',
            'imagen' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
            'documento_pdf' => 'sometimes|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior
            Storage::disk('public')->delete($convocatoria->imagen);
            // Guardar nueva imagen
            $convocatoria->imagen = $request->file('imagen')->store('convocatorias/imagenes', 'public');
        }

        if ($request->hasFile('documento_pdf')) {
            // Eliminar PDF anterior
            Storage::disk('public')->delete($convocatoria->documento_pdf);
            // Guardar nuevo PDF
            $convocatoria->documento_pdf = $request->file('documento_pdf')->store('convocatorias/docsPDF', 'public');
        }

        $convocatoria->update($request->only(['titulo', 'descripcion', 'id_area']));

        return response()->json($convocatoria);
    }

    // Eliminar una convocatoria
    public function destroy(string $id)
    {
        $convocatoria = ConvocatoriaModel::findOrFail($id);

        // Eliminar archivos
        Storage::disk('public')->delete([$convocatoria->imagen, $convocatoria->documento_pdf]);

        $convocatoria->delete();

        return response()->json(['mensaje' => 'Convocatoria eliminada correctamente']);
    } 
}
