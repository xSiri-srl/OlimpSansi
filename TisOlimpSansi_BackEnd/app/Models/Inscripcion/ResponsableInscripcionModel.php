<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\GestionPagos\OrdenPagoModel;


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
        'correo_responsable'
    ];
    public function ordenPago(){
        return $this->hasMany(OrdenPagoModel::class, 'id_responsable', 'id');
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
