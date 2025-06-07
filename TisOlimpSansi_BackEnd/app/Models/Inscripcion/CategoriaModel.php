<?php


namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\GestionOlimpiadas\OlimpiadaAreaCategoriaModel;
use App\Models\Inscripcion\CategoriaGradoModel as InscripcionCategoriaGradoModel;

class CategoriaModel extends Model
{
    use HasFactory;
    protected $table = 'categoria';
    protected $fillable = [
        'nombre_categoria',
    ];

    public function olimpiadaAreaCategoria(){
        return $this->hasMany(OlimpiadaAreaCategoriaModel::class, 'id_categoria', 'id');
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
        public function areas(){
        return $this->belongsToMany(
            AreaModel::class,
            'olimpiada_area_categorias',
            'id_categoria',
            'id_area'
        );
    }
}