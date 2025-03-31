<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\Inscripcion\TutorAcademicoModel;

class InscripcionCategoriaModel extends Model
{
    use HasFactory;
    protected $table = 'inscripcion_categoria';
    protected $fillable = [
        'id_inscripcion',
        'id_categoria',
        'id_tutor_academico',
    ];

    public function inscripcion(){
        return $this->belongsTo(InscripcionModel::class, 'id_inscripcion', 'id');
    }
    public function categoria(){
        return $this->belongsTo(CategoriaModel::class, 'id_categoria', 'id');
    }
    public function tutorAcademico(){
        return $this->belongsTo(TutorAcademicoModel::class, 'id_tutor_academico', 'id');
    }
}