<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\OrdenPago;


class ResponsableInscripcionModel extends Model
{
    use HasFactory;
    protected $table = 'responsable_inscripcion';
    protected $fillable = [
        'nombre',
        'apellido_pa',
        'apellido_ma',
        'ci',
        'complemento',
    ];
    public function ordenPago(){
        return $this->hasMany(OrdenPago::class, 'id_responsable', 'id');
    }

    public static function registrarDesdeRequest($data)
{
    return self::create([
        'nombre' => $data['nombre'],
        'ci' => $data['ci'],
        'telefono' => $data['telefono'],
        'direccion' => $data['direccion'],
    ]);
}
}
