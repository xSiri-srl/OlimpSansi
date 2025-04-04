<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenPago extends Model
{
    use HasFactory;

    // Especificar las columnas que se pueden llenar (mass assignment)
    protected $fillable = [
        'codigo_generado',
        'monto_total',
        'comprobante_url',
        'numero_comprobante',
        'nombre_pagador',
        'fecha_emision',
        'fecha_subida_imagen_comprobante',
    ];
}
