<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GradoModel extends Model
{
    use HasFactory;
    protected $table = 'grado';
    protected $fillable = [
        'nombre_grado',
    ];
}