<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistroRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    public function register(RegistroRequest $request){
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);
    }
    public function login(LoginRequest $request){
        $data = $request->validated();
        //Revisar parssword
        if(!Auth::attemp($data)) {
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

    }
}
