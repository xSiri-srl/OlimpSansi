<?php

namespace App\Http\Controllers\NombreDeHU1;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\NombreDeHU1\EjemploModel;


class NombreController extends Controller
{
    public function store(Request $request)
    {
        $preavisos = new NombreController();
        $preavisos->departamento_id = $request->departamento_id;
        $preavisos->fecha = $request->fecha;
        $preavisos->propietario_pagar = $request->propietario_pagar; 
        $preavisos->descripcion_servicios = $request->descripcion_servicios;
        $preavisos->periodo = $request->periodo;
        $preavisos->servicio_pagar = $request->servicio_pagar; 
        $preavisos->monto = $request->monto;
        $preavisos->save();
        
        return response()->json([
            'status' => 200,
            'message' => 'Preaviso de Expensa generado exitosamente',
            'id' => $preavisos->id,
        ]);
    
    }
}
