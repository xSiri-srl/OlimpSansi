<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EstudianteModel extends Model
{
    use HasFactory;
    protected $table = 'estudiante';
    protected $fillable = [
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'fecha_registro',
        'id_unidad',
        'id_grado',
    ];
}