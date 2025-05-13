<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Juan Pérez',
                'email' => 'josue',
                'password' => Hash::make('password'),
                'id_rol' => 2,
            ],
        ]);
    }
}
