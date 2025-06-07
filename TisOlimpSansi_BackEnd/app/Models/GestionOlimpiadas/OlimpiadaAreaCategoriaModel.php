<?php

namespace App\Models\GestionOlimpiadas;

use Illuminate\Database\Eloquent\Model;
use App\Models\Inscripcion\InscripcionModel;
use App\Models\Inscripcion\AreaModel;
use App\Models\Inscripcion\CategoriaModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OlimpiadaAreaCategoriaModel extends Model
{
    use HasFactory;

    protected $table = 'olimpiada_area_categorias';
    protected $fillable = [
        'id_olimpiada',
        'id_area',
        'id_categoria',
        'precio',
    ];


    public function inscripcion()
    {
        return $this->hasMany(InscripcionModel::class, 'id_olimpiada_area_categoria');
    }
    public function area()
    {
        return $this->belongsTo(AreaModel::class, 'id_area');
    }
    public function categoria()
    {
        return $this->belongsTo(CategoriaModel::class, 'id_categoria');
    }
}
