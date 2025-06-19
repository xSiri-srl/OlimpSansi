<?php

namespace App\Models\GestionPagos;

use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\ResponsableInscripcionModel;
use App\Models\GestionPagos\ComprobantePagoModel
;
use App\Models\Inscripcion\InscripcionModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrdenPagoModel extends Model
{
    use HasFactory;
    protected $table = 'orden_pago';
    protected $fillable = [
        'id_responsable',
        'numero_orden_pago',
        'codigo_generado',
        'monto_total',
        'orden_pago_url',
        'fecha_emision',
        'fecha_subida_imagen_comprobante',
        'estado'
    ];

    protected static function boot()
    {
        parent::boot();
        
        // Evento que se ejecuta ANTES de crear un registro
        static::creating(function ($ordenPago) {
            // Si no tiene número asignado, generarlo
            if (empty($ordenPago->numero_orden_pago)) {
                $ordenPago->numero_orden_pago = self::generarNumeroOrdenSecuencial();
            }
        });
    }
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
        return $this->hasOne(ComprobantePagoModel::class, 'id_orden_pago');
    }
     public static function generarNumeroOrdenSecuencial()
    {
        return DB::transaction(function () {
            $ultimaOrden = self::whereNotNull('numero_orden_pago')
                              ->where('numero_orden_pago', '!=', '')
                              ->orderBy('numero_orden_pago', 'desc')
                              ->lockForUpdate() 
                              ->first();
            
            if (!$ultimaOrden) {
                $siguienteNumero = 1;
            } else {
                $ultimoNumero = (int) $ultimaOrden->numero_orden_pago;
                $siguienteNumero = $ultimoNumero + 1;
            }
            
            return str_pad($siguienteNumero, 8, '0', STR_PAD_LEFT);
        });
    }
}
