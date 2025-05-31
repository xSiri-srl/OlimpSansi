<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolContadorSeeder extends Seeder
{
    public function run(): void
    {
        // Insertar rol "Contador"
        $rolId = DB::table('rol')->insertGetId([
            'nombreRol' => 'Contador',
            'descripcionRol' => 'Puede consultar reportes económicos y de inscripciones',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear módulo si no existe
        $moduloId = DB::table('modulos')->insertGetId([
            'nombreModulo' => 'Reportes',
            'descripcionModulo' => 'Consultas relacionadas con pagos e inscripciones',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Definir las acciones permitidas
        $acciones = [
            'ver_estado_ordenes_pago' => 'Ver estado de las órdenes de pago',
            'ver_evolucion_inscripciones' => 'Ver evolución de inscripciones',
            'ver_ordenes_pago' => 'Ver listado de órdenes de pago',
            'ver_preinscritos' => 'Ver lista de pre-inscritos',
            'ver_inscripciones_verificadas' => 'Ver inscripciones verificadas',
        ];

        // Insertar acciones y enlazarlas al rol
        foreach ($acciones as $nombre => $descripcion) {
            $accionId = DB::table('acciones')->insertGetId([
                'nombreFuncion' => $nombre,
                'descripcionFuncion' => $descripcion,
                'id_modulo' => $moduloId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('rol_accions')->insert([
                'id_rol' => $rolId,
                'id_accion' => $accionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
    }
}
