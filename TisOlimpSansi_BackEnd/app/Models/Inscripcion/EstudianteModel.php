<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\ColegioModel;
use App\Models\Inscripcion\GradoModel;
use App\Models\Inscripcion\TutorLegalModel;



class EstudianteModel extends Model
{
    use HasFactory;
    protected $table = 'estudiante';
    protected $fillable = [
        'id_unidad',
        'id_grado',
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'fecha_nacimiento',
        'correo',
        'propietario_correo',
    ];

    public function colegio(){
        return $this->belongsTo(ColegioModel::class, 'id_unidad', 'id');
    }
    public function grado(){
        return $this->belongsTo(GradoModel::class, 'id_grado', 'id');
    }

    public static function registrarDesdeRequest($data, $colegio_id, $grado_id)
    {
        return self::create([
            'nombre' => $data['nombre'],
            'apellido_pa' => $data['apellido_pa'],
            'apellido_ma' => $data['apellido_ma'],
            'ci' => $data['ci'],
            'fecha_nacimiento' => $data['fecha_nacimiento'],
            'correo' => $data['correo'],
            'propietario_correo' => $data['propietario_correo'],
            'id_unidad' => $colegio_id,
            'id_grado' => $grado_id,
        ]);
    }

}