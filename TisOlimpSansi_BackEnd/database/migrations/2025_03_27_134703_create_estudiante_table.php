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
        Schema::create('estudiante', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_unidad')->constrained('colegio')->onDelete('cascade');
            $table->foreignId('id_grado')->constrained('grado')->onDelete('cascade');
            $table->foreignId('id_tutor_legal')->constrained('tutor_legal')->onDelete('cascade');
            $table->string('nombre');
            $table->string('apellido_pa');
            $table->string('apellido_ma');
            $table->integer('ci');
            $table->timestamp('fecha_nacimiento')->nullable();
            $table->string('correo')->nullable();
            $table->string('propietario_correo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiante');
    }
};
