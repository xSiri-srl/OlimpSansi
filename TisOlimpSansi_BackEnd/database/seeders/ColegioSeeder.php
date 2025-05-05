<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ColegioSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = storage_path('app/public/colegios_departamentos_distritos.xlsx');
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Saltar encabezado (asumiendo que la primera fila lo es)
        foreach (array_slice($rows, 1) as $row) {
            DB::table('colegio')->insert([
                'nombre_colegio' => $row[2],
                'departamento' => $row[0],
                'distrito' => $row[1],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    
}
