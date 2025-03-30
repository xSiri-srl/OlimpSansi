<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;

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
}