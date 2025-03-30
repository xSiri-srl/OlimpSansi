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
        Schema::create('inscripcion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_inscripcion_area')->constrained('inscripcion_area')->onDelete('cascade');
            $table->foreignId('id_responsable')->constrained('responsable_inscripcion')->onDelete('cascade');
            $table->foreignId('id_estudiante')->constrained('estudiante')->onDelete('cascade');
            $table->foreignId('id_orden_pago')->constrained('orden_pagos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripcion');
    }
};
