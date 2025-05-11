<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            'ASTRONOMIA Y ASTROFISICA',
            'BIOLOGIA',
            'FISICA',
            'INFORMATICA',
            'MATEMATICAS',
            'QUIMICA',
            'ROBOTICA',
        ];

        foreach ($areas as $nombre) {
            DB::table('area')->insert([
                'nombre_area' => $nombre,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}