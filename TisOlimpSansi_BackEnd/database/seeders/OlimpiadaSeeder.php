<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OlimpiadaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('olimpiada')->insert([
            [
                'id_user' => 1,
                'titulo' => 'Olimpiada de Matemáticas 2024',
                'fecha_ini' => Carbon::create(2024, 6, 3),
                'fecha_fin' => Carbon::create(2024, 6, 30),
            ],

        ]);
    }
}
