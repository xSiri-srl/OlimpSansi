<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaModel;
use App\Models\AreaModel;

class OlimpiadaAreaModel extends Model
{
    use HasFactory;
    protected $table = 'olimpiada_area';
    protected $fillable = [
        'id_olimpiada',
        'id_area',
    ];
    public function olimpiadaArea(){
        return $this->belongsTo(OlimpiadaModel::class, 'id_olimpiada', 'id');
    }
    public function areaOlimpiada(){
        return $this->belongsTo(AreaModel::class, 'id_area', 'id');
    }
}