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
        Schema::create('tutor_legal', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido_pa');
            $table->string('apellido_ma');
            $table->integer('ci');
            $table->string('complemento')->nullable();
            $table->string('correo');
            $table->integer('numero_celular');
            $table->string('tipo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutor_legal');
    }
};
