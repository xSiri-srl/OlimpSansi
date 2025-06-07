<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaModel;
use App\Models\Inscripcion\AreaModel as InscripcionAreaModel;

class OlimpiadaAreaModel extends Model
{
    use HasFactory;
    protected $table = 'olimpiada_area';
    protected $fillable = [
        'id_olimpiada',
        'id_area',
        'monto',
    ];
    public function olimpiadaArea(){
        return $this->belongsTo(OlimpiadaModel::class, 'id_olimpiada', 'id');
    }
    public function areaOlimpiada(){
        return $this->belongsTo(InscripcionAreaModel::class, 'id_area', 'id');
    }
}