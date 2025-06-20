<?php

namespace App\Models\GestionOlimpiadas;

use App\Models\Inscripcion\InscripcionModel as InscripcionInscripcionModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\GestionOlimpiadas\OlimpiadaAreaModel;
use App\Models\Usuarios\UserModel;

class OlimpiadaModel extends Model
{
    use HasFactory;
    protected $table = 'olimpiada';
    protected $fillable = [
        'id_user',
        'titulo',
        'max_materias',
        'fecha_ini',
        'fecha_fin'
    ];
    
    public function olimpiadaArea(){
        return $this->hasMany(OlimpiadaAreaModel::class, 'id_olimpiada');
    }
    public function inscripciones(){
        return $this->hasMany(InscripcionInscripcionModel::class, 'id_olimpiada');
    }
    public function user(){
        return $this->belongsTo(UserModel::class, 'id_user');
    }
}
