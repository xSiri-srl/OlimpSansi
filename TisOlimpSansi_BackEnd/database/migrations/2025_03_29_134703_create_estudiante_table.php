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
            $table->unsignedBigInteger('id_unidad');          
            $table->unsignedBigInteger('id_grado');  
            $table->unsignedBigInteger('id_tutor_legal'); 
            $table->string('nombre');
            $table->string('apellido_pa');
            $table->string('apellido_ma');
            $table->integer('ci');
            $table->timestamp('fecha_nacimiento');
            $table->string('correo');
            $table->string('propietario_correo');
            $table->timestamps();
            $table->foreign('id_unidad')->references('id')->on('colegio')->onDelete('cascade');
            $table->foreign('id_grado')->references('id')->on('grado')->onDelete('cascade');
            $table->foreign('id_tutor_legal')->references('id')->on('tutor_legal')->onDelete('cascade');        
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
