<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\OrdenPago;

class comprobantes_pago extends Model
{
    use HasFactory;

    // Especificar las columnas que se pueden llenar (mass assignment)
    protected $fillable = [
        'id_orden_pago',
        'comprobante_url',
        'numero_comprobante',
        'nombre_pagador',
        'fecha_subida_imagen_comprobante',
    ];

    public function ordenPago(){
        return $this->belongsTo(OrdenPago::class, 'id_orden_pago');
    }
}
