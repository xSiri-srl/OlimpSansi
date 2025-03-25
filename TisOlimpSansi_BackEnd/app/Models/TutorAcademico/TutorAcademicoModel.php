<?php

namespace App\Models\TutorAcademico;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class TutorAcademicoModel extends Model
{
    use HasFactory;
    protected $table = 'tutor_academico';
    protected $fillable = [
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'complemento',
    ];
}
