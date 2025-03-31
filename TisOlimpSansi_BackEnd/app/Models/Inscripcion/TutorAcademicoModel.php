<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;


class TutorAcademicoModel extends Model
{
    use HasFactory;
    protected $table = 'tutor_academico';
    protected $fillable = [
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'complemento',
    ];
    public function estudiante(){
        return $this->hasMany(EstudianteModel::class, 'id_tutor_academico');
    }
    public static function registrarDesdeRequest($data)
{
    return self::create([
        'nombre' => $data['nombre'],
        'ci' => $data['ci'],
        'materia' => $data['materia'],
    ]);
}
}
