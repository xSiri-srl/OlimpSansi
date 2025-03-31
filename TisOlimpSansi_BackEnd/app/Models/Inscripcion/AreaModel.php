<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\CategoriaModel;
use App\Models\Inscripcion\InscripcionModel;

class AreaModel extends Model
{
    use HasFactory;
    protected $table = 'area';
    protected $fillable = [
        'nombre_area',
    ];

    public function categoria(){
        return $this->hasMany(CategoriaModel::class, 'id_area');
    }
}