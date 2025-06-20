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
        Schema::create('accion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_funcion');
            $table->string('descripcion_funcion');
            $table->foreignId('id_modulo')->constrained('modulo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accion');
    }
};
