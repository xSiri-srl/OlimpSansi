<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegistroRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    public function register(RegistroRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'id_rol' => 2 
        ]);

        
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => $user
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['errors' => ['El email o la contraseña son incorrectos']], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user()
        ]);
    }
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada']);
    }
    public function getPermisos()
    {
        $usuario = Auth::user();

        $permisos = DB::table('rol_accions')
            ->where('id_rol', $usuario->id_rol)
            ->join('acciones', 'rol_accions.id_accion', '=', 'acciones.id')
            ->pluck('acciones.nombreFuncion');

        return response()->json(['permisos' => $permisos]);
    }
}
