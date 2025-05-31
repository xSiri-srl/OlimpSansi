<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Inscripcion\AreaModel;

class ConvocatoriaModel extends Model
{
    use HasFactory;
    protected $table = 'convocatoria';
    protected $fillable = [
        'titulo',
        'id_area',
        'documento_pdf'
    ];
    public function areaConvocatoria(){
        return $this->belongsTo(AreaModel::class, 'id_area', 'id');
    }
}
