<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\olimpiada_area_categoria;


class AreaModel extends Model
{
    use HasFactory;
    protected $table = 'area';
    protected $fillable = [
        'nombre_area',
    ];
    public function olimpiadaAreaCategoria(){
        return $this->hasMany(olimpiada_area_categoria::class, 'id_area', 'id');
    }
}