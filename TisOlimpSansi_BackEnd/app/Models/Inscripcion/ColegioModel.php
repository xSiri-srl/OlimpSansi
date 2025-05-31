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
        'distrito',
    ];

    public function estudiante(){
        return $this->hasOne(EstudianteModel::class, 'id_unidad');
    }

    public static function registrarDesdeRequest($data)
{
    return self::create([
        'nombre_colegio' => $data['nombre_colegio'],
        'departamento' => $data['departamento'],
        'distrito' => $data['distrito'],
    ]);
}
}