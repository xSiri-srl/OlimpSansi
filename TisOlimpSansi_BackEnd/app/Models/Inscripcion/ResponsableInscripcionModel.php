<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ResponsableInscripcionModel extends Model
{
    use HasFactory;
    protected $table = 'responsable_inscripcion';
    protected $fillable = [
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'complemento',
    ];
}
