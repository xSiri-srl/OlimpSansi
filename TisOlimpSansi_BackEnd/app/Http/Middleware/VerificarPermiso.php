<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VerificarPermiso
{
    public function handle(Request $request, Closure $next, $permiso)
    {
        $usuario = Auth::user();

        $tienePermiso = DB::table('rol_accions')
            ->where('id_rol', $usuario->id_rol)
            ->join('acciones', 'rol_accions.id_accion', '=', 'acciones.id')
            ->where('acciones.nombreFuncion', $permiso)
            ->exists();

        if (!$tienePermiso) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
