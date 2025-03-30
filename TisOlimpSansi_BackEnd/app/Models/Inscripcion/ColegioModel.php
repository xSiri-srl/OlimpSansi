<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;

class ColegioModel extends Model
{
    use HasFactory;
    protected $table = 'colegio';
    protected $fillable = [
        'nombre_colegio',
        'departamento',
        'provincia',
    ];

    public function estudiante(){
        return $this->hasOne(EstudianteModel::class). 'id_unidad';
    }
}