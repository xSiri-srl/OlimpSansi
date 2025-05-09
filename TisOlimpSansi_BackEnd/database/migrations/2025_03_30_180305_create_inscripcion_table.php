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
            $table->foreignId('id_estudiante')->constrained('estudiante')->onDelete('cascade');
            $table->foreignId('id_olimpiada_area_categoria')->constrained('olimpiada_area_categoria')->onDelete('cascade');
            $table->foreignId('id_tutor_academico')->nullable()->constrained('tutor_academico')->onDelete('set null');
            $table->foreignId('id_orden_pago')->nullable()->constrained('orden_pagos')->onDelete('cascade');
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
