<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\TutorLegalModel;
use App\Models\Inscripcion\TutorAcademicoModel;


class EstudianteModel extends Model
{
    use HasFactory;
    protected $table = 'estudiante';
    protected $fillable = [
        'id_unidad',
        'id_grado',
        'id_tutor_legal',
        'id_tutor_academico',
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'fecha_nacimiento',
        'correo',
        'propietario_correo',
    ];

    public function colegio(){
        return $this->belongsTo(ColegioModel::class, 'id_unidad', 'id');
    }
    public function grado(){
        return $this->belongsTo(GradoModel::class, 'id_grado', 'id');
    }
    public function tutorLegal(){
        return $this->belongsTo(TutorLegalModel::class, 'id_tutor_legal', 'id');
    }
    public function tutorAcademico(){
        return $this->belongsTo(TutorAcademicoModel::class, 'id_tutor_academico', 'id');
    }
}