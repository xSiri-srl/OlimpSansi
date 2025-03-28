<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ColegioModel extends Model
{
    use HasFactory;
    protected $table = 'colegio';
    protected $fillable = [
        'nombre_colegio',
        'departamento',
        'provincia',
    ];
}