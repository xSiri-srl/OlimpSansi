<?php

namespace App\Models\GestionPagos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\GestionPagos\OrdenPagoModel;

class ComprobantePagoModel extends Model
{
    use HasFactory;
    protected $table = 'comprobante_pago';

    protected $fillable = [
        'id_orden_pago',
        'comprobante_url',
        'numero_comprobante',
        'nombre_pagador',
        'fecha_subida_imagen_comprobante',
    ];

    public function ordenPago(){
        return $this->belongsTo(OrdenPagoModel::class, 'id_orden_pago');
    }
}
