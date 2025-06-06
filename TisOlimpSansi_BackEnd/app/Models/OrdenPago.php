<?php

namespace App\Models;

use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\comprobantes_pago;
use App\Models\Inscripcion\InscripcionModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenPago extends Model
{
    use HasFactory;

    // Especificar las columnas que se pueden llenar (mass assignment)
    protected $fillable = [
        'id_responsable',
        'codigo_generado',
        'monto_total',
        'orden_pago_url',
        'fecha_emision',
        'fecha_subida_imagen_comprobante',
        'estado'
    ];
    public function inscripcionArea(){
        return $this->belongsTo(ColegioModel::class, 'id_inscripcion_area', 'id');
    }
    public function inscripcion()
    {
        return $this->hasMany(InscripcionModel::class, 'id_orden_pago');
    }
     public function contarInscripciones()
    {
        return $this->inscripcion()->count();
    }
    public function responsable(){
        return $this->belongsTo(ResponsableInscripcionModel::class, 'id_responsable', 'id');
    }

    public function comprobantePago(){
        return $this->hasMany(comprobantes_pago::class, 'id_orden_pago');
    }
}
