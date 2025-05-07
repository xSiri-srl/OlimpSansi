<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaModel;

class OlimpiadaModel extends Model
{
    use HasFactory;
    protected $table = 'olimpiada';
    protected $fillable = [
        'id_user_admin',
        'titulo',
        'fecha_ini',
        'fecha_fin'
    ];
    
    public function olimpiada(){
        return $this->hasMany(OlimpiadaAreaModel::class, 'id_olimpiada');
    }
}
