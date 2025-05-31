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
        Schema::create('olimpiada_area_categorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_olimpiada')->constrained('olimpiada')->onDelete('cascade');
            $table->foreignId('id_area')->constrained('area')->onDelete('cascade');
            $table->foreignId('id_categoria')->constrained('categoria')->onDelete('cascade');
            $table->decimal('precio', 10, 2);
            $table->timestamps();
            
            $table->unique(['id_olimpiada', 'id_area', 'id_categoria'], 'olimpiada_area_categoria_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('olimpiada_area_categorias');
    }
};
