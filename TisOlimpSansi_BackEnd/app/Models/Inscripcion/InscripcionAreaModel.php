<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InscripcionAreaModel extends Model
{
    use HasFactory;
    protected $table = 'inscripcion_area';
    protected $fillable = [
        'id_inscripcion',
        'id_area',
        'id_categoria',
    ];
}
