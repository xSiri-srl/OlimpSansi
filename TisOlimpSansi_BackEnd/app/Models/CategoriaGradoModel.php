<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\Gradomodel;
use App\Models\Inscripcion\CategoriaModel;

class CategoriaGradoModel extends Model
{
    use HasFactory;

    protected $table = 'categoria_grado';
    protected $fillable = [
        'id_categoria',
        'id_grado',
    ];

    public function categorias()
    {
        return $this->hasMany(CategoriaModel::class, 'id_categoria');
    }
    public function grados()
    {
        return $this->belongsTo(GradoModel::class, 'id_grado');
    }
}
