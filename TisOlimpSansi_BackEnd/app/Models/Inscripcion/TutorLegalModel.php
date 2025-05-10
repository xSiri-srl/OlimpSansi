<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\EstudianteModel;

class TutorLegalModel extends Model
{
    use HasFactory;
    protected $table = 'tutor_legal';
    protected $fillable = [
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'complemento',
        'correo',
        'numero_celular',
        'tipo',
    ];

 public function inscripciones()
{
    return $this->hasMany(InscripcionModel::class, 'id_tutor_legal');
}

public static function registrarDesdeRequest($data)
{
    return self::create([
        'nombre' => $data['nombre'],
        'apellido_pa' => $data['apellido_pa'],
        'apellido_ma' => $data['apellido_ma'],
        'ci' => $data['ci'],
        'complemento' => $data['complemento'] ?? null,
        'correo' => $data['correo'],
        'numero_celular' => $data['numero_celular'],
        'tipo' => $data['tipo'], // en lugar de 'parentesco'
    ]);
}
}
