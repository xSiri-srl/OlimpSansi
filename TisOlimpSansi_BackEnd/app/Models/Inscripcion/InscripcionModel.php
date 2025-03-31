<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\OrdenPago;
use App\Models\Inscripcion\InscripcionAreaModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\Inscripcion\AreaModel;

class InscripcionModel extends Model
{
    use HasFactory;
    protected $table = 'inscripcion';
    protected $fillable = [
        'id_responsable',
        'id_estudiante',
        'id_orden_pago',
    ]; 
    public function responsable(){
        return $this->belongsTo(ResponsableInscripcionModel::class, 'id_responsable');
    }
    public function estudiante(){
        return $this->belongsTo(EstudianteModel::class, 'id_estudiante');
    }
    public function ordenPago(){
        return $this->belongsTo(OrdenPago::class, 'id_orden_pago');
    }
    public function inscripcionCategoria(){
        return $this->belongsToMany(AreaModel::class, 'inscripcion_area', 'id_inscripcion', 'id_categoria');
    }
}
