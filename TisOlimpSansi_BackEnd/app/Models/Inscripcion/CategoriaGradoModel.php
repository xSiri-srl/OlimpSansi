<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoriaGradoModel extends Model
{
    use HasFactory;
    
    protected $table = 'categoria_grado';
    
    protected $fillable = [
        'id_categoria',
        'id_grado',
    ];

    public function categoria()
    {
        return $this->belongsTo(CategoriaModel::class, 'id_categoria');
    }

    public function grado()
    {
        return $this->belongsTo(GradoModel::class, 'id_grado');
    }
}