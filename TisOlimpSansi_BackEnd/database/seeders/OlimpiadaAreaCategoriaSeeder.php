<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // <- Esta línea es obligatoria

class OlimpiadaAreaCategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $id_olimpiada = 1;

        for ($area = 1; $area <= 7; $area++) {
            for ($categoria = 1; $categoria <= 26; $categoria++) {
                DB::table('olimpiada_area_categorias')->insert([
                    'id_olimpiada' => $id_olimpiada,
                    'id_area' => $area,
                    'id_categoria' => $categoria,
                    'precio' => rand(20, 40),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
