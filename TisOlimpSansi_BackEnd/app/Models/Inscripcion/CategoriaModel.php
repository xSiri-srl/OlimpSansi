<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\AreaModel;
use App\Models\olimpiada_area_categoria;
use App\Models\CategoriaGradoModel;

class CategoriaModel extends Model
{
    use HasFactory;
    protected $table = 'categoria';
    protected $fillable = [
        'nombre_categoria',
    ];

    public function olimpiadaAreaCategoria(){
        return $this->hasMany(olimpiada_area_categoria::class, 'id_categoria', 'id');
    }
    public function categoriaGrados(){
        return $this->hasMany(CategoriaGradoModel::class, 'id_categoria', 'id');
    }
}