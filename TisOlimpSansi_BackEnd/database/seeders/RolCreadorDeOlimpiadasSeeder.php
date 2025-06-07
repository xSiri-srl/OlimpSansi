<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolCreadorDeOlimpiadasSeeder extends Seeder
{
    public function run(): void
    {

         // Crear el rol
        $rolId = DB::table('rol')->insertGetId([
            'nombreRol' => 'CreadorDeOlimpiada',
            'descripcionRol' => 'Puede crear olimpiadas académicas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear el módulo
        $moduloId = DB::table('modulos')->insertGetId([
            'nombreModulo' => 'Gestión de Olimpiadas',
            'descripcionModulo' => 'Permite gestionar la creación de olimpiadas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear acción: crear_olimpiada
        $accionId = DB::table('acciones')->insertGetId([
            'nombreFuncion' => 'crear_olimpiada',
            'descripcionFuncion' => 'Permite crear nuevas olimpiadas',
            'id_modulo' => $moduloId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Relacionar acción con el rol
        DB::table('rol_accion')->insert([
            'id_rol' => $rolId,
            'id_accion' => $accionId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
