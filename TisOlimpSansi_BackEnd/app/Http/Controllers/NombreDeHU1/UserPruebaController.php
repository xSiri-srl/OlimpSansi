<?php

namespace App\Http\Controllers\NombreDeHU1;

use App\Http\Controllers\Controller;
use App\Models\NombreDeHU1\UserPruebaModel;
use Illuminate\Http\Request;

class UserPruebaController extends Controller {
    public function store(Request $request) {

        $user = new UserPruebaModel();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password; 
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'El usuario se creo joya',
        ]);
    }
}
