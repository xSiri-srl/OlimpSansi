<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
    public function index()
    {
        $usuarios = UserAdminModel::all();

        return response()->json([
            'status' => 200,
            'data' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        $usuario = new UserAdminModel();
        $usuario->username = $request->username;
        $usuario->password = bcrypt($request->password); // encriptar contraseña
        $usuario->save();

        return response()->json([
            'status' => 200,
            'message' => 'Usuario administrador creado exitosamente',
        ]);
    }

    public function show($id)
    {
        $usuario = UserAdminModel::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $usuario,
        ]);
    }

    public function update(Request $request, $id)
    {
        $usuario = UserAdminModel::findOrFail($id);
        $usuario->username = $request->username;
        if ($request->filled('password')) {
            $usuario->password = bcrypt($request->password);
        }
        $usuario->save();

        return response()->json([
            'status' => 200,
            'message' => 'Usuario administrador actualizado exitosamente',
        ]);
    }

    public function destroy($id)
    {
        $usuario = UserAdminModel::findOrFail($id);
        $usuario->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Usuario administrador eliminado exitosamente',
        ]);
    }

}
