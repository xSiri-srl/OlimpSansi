<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;
use App\Models\Inscripcion\CategoriaGradoModel as InscripcionCategoriaGradoModel;

class GradoModel extends Model
{
    use HasFactory;
    protected $table = 'grado';
    protected $fillable = [
        'nombre_grado',
    ];

    public function estudiante(){
        return $this->hasOne(EstudianteModel::class, 'id_grado');
    }
    public function categoriaGrados(){
        return $this->hasMany(InscripcionCategoriaGradoModel::class, 'id_grado', 'id');
    }
}