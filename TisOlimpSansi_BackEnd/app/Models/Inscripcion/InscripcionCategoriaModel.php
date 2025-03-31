<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\CategoriaModel;

class InscripcionAreaModel extends Model
{
    use HasFactory;
    protected $table = 'inscripcion_area';
    protected $fillable = [
        'id_inscripcion',
        'id_categoria',
    ];

    public function inscripcion(){
        return $this->belongsTo(InscripcionModel::class, 'id_inscripcion', 'id');
    }
    public function categoria(){
        return $this->belongsTo(CategoriaModel::class, 'id_categoria', 'id');
    }
}