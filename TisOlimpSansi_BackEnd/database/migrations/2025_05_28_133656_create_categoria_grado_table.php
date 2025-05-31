<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categoria_grado', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_categoria');
            $table->unsignedBigInteger('id_grado');
            $table->timestamps();

            $table->foreign('id_categoria')->references('id')->on('categoria')->onDelete('cascade');
            $table->foreign('id_grado')->references('id')->on('grado')->onDelete('cascade');
            
            // Índice único para evitar duplicados
            $table->unique(['id_categoria', 'id_grado']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('categoria_grado');
    }
};