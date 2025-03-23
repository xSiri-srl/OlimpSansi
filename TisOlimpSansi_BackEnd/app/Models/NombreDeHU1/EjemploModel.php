<?php

namespace App\Models\NombreDeHU1;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoExpensas extends Model
{
    use HasFactory;
    use HasFactory;
    protected $table = 'preavisos';

    protected $fillable = [
        'departamento_id',
        'propietario_pagar',
        'fecha',
        'descripcion_servicios',
        'periodo',
        'servicio_pagar',
        'monto',
        'id_propietarioPagar'
    ];

    /*  para las relaciones
    public function pagosExpensas()
    {
        return $this->hasMany(PagoExpensas::class, 'residente_id', 'id');
        
    }

    public function expensaCorrespondiente(){
        return $this->hasOne(PagoExpensas::class, 'expensa_id', 'id');

    }*/
}
