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
        Schema::create('categoria_grado', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_categoria')->constrained('categoria')->onDelete('cascade');
            $table->foreignId('id_grado')->constrained('grado')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categoria_grado');
    }
};
