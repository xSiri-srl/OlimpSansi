<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistroRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    public function register(RegistroRequest $request){
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'id_rol' => null
        ]);
        return [
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user
        ];
    }
    public function login(LoginRequest $request){
        $data = $request->validated();
        //Revisar parssword
        if(!Auth::attempt($data)) {
            return response([
                'errors' => ['El email o el password son incorrectos']
            ],422);
        }
        //Autenticar usuario
        $user = Auth::user();
        return [
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user
        ];

    }
    public function logout(Request $request){
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return [
            'user' => null
        ];
    }
    public function getPermisos() {
        $usuario = Auth::user();
    
        $permisos = DB::table('rol_accions')
            ->where('id_rol', $usuario->id_rol)
            ->join('acciones', 'rol_accions.id_accion', '=', 'acciones.id')
            ->pluck('acciones.nombreFuncion');
    
        return response()->json(['permisos' => $permisos]);
    }
}
