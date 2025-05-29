<?php


namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\olimpiada_area_categoria;
use App\Models\Inscripcion\CategoriaGradoModel as InscripcionCategoriaGradoModel;

class CategoriaModel extends Model
{
    use HasFactory;
    protected $table = 'categoria';
    protected $fillable = [
        'nombre_categoria',
        'id_area',
    ];

    public function olimpiadaAreaCategoria(){
        return $this->hasMany(olimpiada_area_categoria::class, 'id_categoria', 'id');
    }
    public function grado(){
        return $this->hasMany(InscripcionCategoriaGradoModel::class, 'id_categoria', 'id');
    }
    
 
    public function grados(){
        return $this->belongsToMany(
            GradoModel::class,
            'categoria_grado',
            'id_categoria',
            'id_grado'
        );
    }
}