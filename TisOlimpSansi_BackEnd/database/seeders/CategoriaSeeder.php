<?php

namespace Database\Seeders;

use App\Models\Inscripcion\CategoriaModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            'BUILDERS P', 'BUILDERS S', 'LEGO P', 'LEGO S',

            'PRIMER NIVEL', 'SEGUNDO NIVEL', 'TERCER NIVEL',
            'CUARTO NIVEL', 'QUINTO NIVEL', 'SEXTO NIVEL',

            'GUACAMAYO', 'GUANACO', 'LONDRA', 'JCUMARI', 'BUFEO', 'PUMA',

            '3P', '4P', '5P', '6P', '1S', '2S', '3S', '4S', '5S', '6S',
        ];

        foreach (array_unique($categorias) as $nombre) {
            CategoriaModel::firstOrCreate(['nombre_categoria' => $nombre]);
        }
    }
}
