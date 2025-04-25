<?php

namespace App\Models\Inscripcion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Inscripcion\AreaModel;

class CategoriaModel extends Model
{
    use HasFactory;
    protected $table = 'categoria';
    protected $fillable = [
        'id_area',
        'nombre_categoria',
    ];

    public function area(){
        return $this->belongsTo(AreaModel::class, 'id_area', 'id');
    }
    
}