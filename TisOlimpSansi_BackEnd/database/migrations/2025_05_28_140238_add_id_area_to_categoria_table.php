<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('categoria', function (Blueprint $table) {
            // Añadir columna id_area si no existe
            if (!Schema::hasColumn('categoria', 'id_area')) {
                $table->unsignedBigInteger('id_area')->nullable();
                $table->foreign('id_area')->references('id')->on('area')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('categoria', function (Blueprint $table) {
            $table->dropForeign(['id_area']);
            $table->dropColumn('id_area');
        });
    }
};