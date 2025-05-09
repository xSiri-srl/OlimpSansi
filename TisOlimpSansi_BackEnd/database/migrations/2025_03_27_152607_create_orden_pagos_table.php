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
            $table->foreignId('id_responsable')->constrained('responsable_inscripcion')->onDelete('cascade');
            $table->string('codigo_generado', 20);
            $table->decimal('monto_total', 10, 2); 
            $table->string('orden_pago_url', 500)->nullable(); 
            $table->dateTime('fecha_emision'); 
            $table->enum('estado', ['pendiente', 'pagado', 'anulado'])->default('pendiente');
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
