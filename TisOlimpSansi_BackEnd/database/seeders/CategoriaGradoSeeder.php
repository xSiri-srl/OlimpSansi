<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaGradoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = DB::table('categoria')->pluck('id', 'nombre_categoria')->toArray();
        $grados = DB::table('grado')->pluck('id', 'nombre_grado')->toArray();

        $data = [
            // ASTRONOMÍA - ASTROFÍSICA
            ['nombre_categoria' => '3P', 'nombre_grado' => '3RO PRIMARIA'],
            ['nombre_categoria' => '4P', 'nombre_grado' => '4TO PRIMARIA'],
            ['nombre_categoria' => '5P', 'nombre_grado' => '5TO PRIMARIA'],
            ['nombre_categoria' => '6P', 'nombre_grado' => '6TO PRIMARIA'],
            ['nombre_categoria' => '1S', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => '2S', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => '3S', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => '4S', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => '5S', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => '6S', 'nombre_grado' => '6TO SECUNDARIA'],

            // INFORMÁTICA
            ['nombre_categoria' => 'GUACAMAYO', 'nombre_grado' => '5TO PRIMARIA'],
            ['nombre_categoria' => 'GUACAMAYO', 'nombre_grado' => '6TO PRIMARIA'],
            ['nombre_categoria' => 'GUANACO', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => 'GUANACO', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => 'GUANACO', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => 'LONDRA', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => 'LONDRA', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => 'LONDRA', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => 'BUFEO', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => 'BUFEO', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => 'BUFEO', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => 'JUCUMARI', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => 'JUCUMARI', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => 'JUCUMARI', 'nombre_grado' => '6TO SECUNDARIA'],
            ['nombre_categoria' => 'PUMA', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => 'PUMA', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => 'PUMA', 'nombre_grado' => '6TO SECUNDARIA'],

            // MATEMÁTICAS
            ['nombre_categoria' => 'PRIMER NIVEL', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => 'SEGUNDO NIVEL', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => 'TERCER NIVEL', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => 'CUARTO NIVEL', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => 'QUINTO NIVEL', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => 'SEXTO NIVEL', 'nombre_grado' => '6TO SECUNDARIA'],

            // QUÍMICA
            ['nombre_categoria' => '2S', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => '3S', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => '4S', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => '5S', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => '6S', 'nombre_grado' => '6TO SECUNDARIA'],

            // ROBÓTICA
            ['nombre_categoria' => 'BUILDERS P', 'nombre_grado' => '5TO PRIMARIA'],
            ['nombre_categoria' => 'BUILDERS P', 'nombre_grado' => '6TO PRIMARIA'],
            ['nombre_categoria' => 'LEGO P', 'nombre_grado' => '5TO PRIMARIA'],
            ['nombre_categoria' => 'LEGO P', 'nombre_grado' => '6TO PRIMARIA'],
            ['nombre_categoria' => 'BUILDERS S', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => 'BUILDERS S', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => 'BUILDERS S', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => 'BUILDERS S', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => 'BUILDERS S', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => 'BUILDERS S', 'nombre_grado' => '6TO SECUNDARIA'],
            ['nombre_categoria' => 'LEGO S', 'nombre_grado' => '1RO SECUNDARIA'],
            ['nombre_categoria' => 'LEGO S', 'nombre_grado' => '2DO SECUNDARIA'],
            ['nombre_categoria' => 'LEGO S', 'nombre_grado' => '3RO SECUNDARIA'],
            ['nombre_categoria' => 'LEGO S', 'nombre_grado' => '4TO SECUNDARIA'],
            ['nombre_categoria' => 'LEGO S', 'nombre_grado' => '5TO SECUNDARIA'],
            ['nombre_categoria' => 'LEGO S', 'nombre_grado' => '6TO SECUNDARIA'],
        ];

        foreach ($data as $item) {
            $id_categoria = $categorias[$item['nombre_categoria']] ?? null;
            $id_grado = $grados[$item['nombre_grado']] ?? null;

            if ($id_categoria && $id_grado) {
                DB::table('categoria_grado')->updateOrInsert(
                    [
                    'id_categoria' => $id_categoria,
                    'id_grado' => $id_grado
                    ]
                );
            }
        }
    }
}
