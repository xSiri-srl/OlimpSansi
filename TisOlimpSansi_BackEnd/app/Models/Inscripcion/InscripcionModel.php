<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\OrdenPago;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\Inscripcion\OlimpiadaAreaCategoriaModel;
use App\Models\olimpiada_area_categoria;

class InscripcionModel extends Model
{
    use HasFactory;

    protected $table = 'inscripcion';

    protected $fillable = [
        'id_estudiante',
        'id_tutor_legal',
        'id_olimpiada_area_categoria',
        'id_tutor_academico',
        'id_orden_pago',
    ]; 

    public function estudiante()
    {
        return $this->belongsTo(EstudianteModel::class, 'id_estudiante');
    }

    public function tutorLegal()
    {
        return $this->belongsTo(TutorLegalModel::class, 'id_tutor_legal');
    }

    public function ordenPago()
    {
        return $this->belongsTo(OrdenPago::class, 'id_orden_pago');
    }

    public function olimpiadaAreaCategoria()
    {
        return $this->belongsTo(olimpiada_area_categoria::class, 'id_olimpiada_area_categoria');
    }

    public function tutorAcademico()
    {
        return $this->belongsTo(TutorAcademicoModel::class, 'id_tutor_academico');
    }

    public function tutorAcademicos()
    {
        return $this->belongsToMany(TutorAcademicoModel::class, 'inscripcion_tutor_academico', 'id_inscripcion', 'id_tutor_academico');
    }
}
