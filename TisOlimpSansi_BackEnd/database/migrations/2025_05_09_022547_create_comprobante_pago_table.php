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
        Schema::create('comprobante_pago', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_orden_pago')->constrained('orden_pagos')->onDelete('cascade');
            $table->string('comprobante_url', 500)->nullable();
            $table->string('numero_comprobante', 50)->nullable();
            $table->string('nombre_pagador', 200)->nullable();
            $table->dateTime('fecha_subida_imagen_comprobante')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobante_pago');
    }
};
