<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradoSeeder extends Seeder
{
    public function run(): void
    {
        $grados = [
            '1RO PRIMARIA',
            '2DO PRIMARIA',
            '3RO PRIMARIA',
            '4TO PRIMARIA',
            '5TO PRIMARIA',
            '6TO PRIMARIA',
            '1RO SECUNDARIA',
            '2DO SECUNDARIA',
            '3RO SECUNDARIA',
            '4TO SECUNDARIA',
            '5TO SECUNDARIA',
            '6TO SECUNDARIA',
        ];

        foreach ($grados as $grado) {
            DB::table('grado')->updateOrInsert(
                ['nombre_grado' => $grado],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}