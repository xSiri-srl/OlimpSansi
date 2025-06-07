<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;


class AreaCategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $areasCategorias = [
            'ASTRONOMIA ASTROFISICA' => ['3P', '4P', '5P', '6P', '1S', '2S', '3S', '4S', '5S', '6S'],
            'BIOLOGIA' => ['2S', '3S', '4S', '5S', '6S'],
            'FISICA' => ['4S', '5S', '6S'],
            'INFORMATICA' => ['Guacamayo', 'Guanaco', 'Londra', 'Jucumari', 'Bufeo', 'Puma'],
            'MATEMATICAS' => [
                'Primer Nivel', 'Segundo Nivel', 'Tercer Nivel', 
                'Cuarto Nivel', 'Quinto Nivel', 'Sexto Nivel'
            ],
            'QUIMICA' => ['2S', '3S', '4S', '5S', '6S'],
            'ROBOTICA' => ['Builders P', 'Builders S', 'Lego P', 'Lego S'],
        ];

        foreach ($areasCategorias as $area => $categorias) {
            $areaModel = AreaModel::create(['nombre_area' => $area]);

            foreach ($categorias as $categoria) {
            
                $exists = CategoriaModel::where('nombre_categoria', $categoria)
                    ->where('id_area', $areaModel->id)
                    ->exists();

                if (!$exists) {
                    CategoriaModel::create([
                        'id_area' => $areaModel->id,
                        'nombre_categoria' => $categoria,
                    ]);
                }
            }
        }
    }
}