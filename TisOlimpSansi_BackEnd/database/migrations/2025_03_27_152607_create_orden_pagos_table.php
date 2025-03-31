<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orden_pagos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_generado', 20);
            $table->decimal('monto_total', 10, 2); 
            $table->string('comprobante_url', 500)->nullable();
            $table->string('numero_comprobante', 50)->nullable();
            $table->string('nombre_pagador', 200)->nullable(); 
            $table->dateTime('fecha_emision'); 
            $table->dateTime('fecha_subida_imagen_comprobante')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_pagos');
    }
};
