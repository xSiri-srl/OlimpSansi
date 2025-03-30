<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\OrdenPago;
use App\Models\Inscripcion\InscripcionAreaModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;

class InscripcionModel extends Model
{
    use HasFactory;
    protected $table = 'inscripcion';
    protected $fillable = [
        'id_inscripcion_area',
        'id_responsable',
        'id_estudiante',
        'id_orden_pago',
    ]; 
    public function inscripcionArea(){
        return $this->belongsTo(InscripcionAreaModel::class, 'id_inscripcion_area');
    }
    public function responsable(){
        return $this->belongsTo(ResponsableInscripcionModel::class, 'id_responsable');
    }
    public function estudiante(){
        return $this->belongsTo(EstudianteModel::class, 'id_estudiante');
    }
    public function ordenPago(){
        return $this->belongsTo(OrdenPago::class, 'id_orden_pago');
    }
}
