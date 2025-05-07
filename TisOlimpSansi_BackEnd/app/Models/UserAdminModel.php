<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaModel;

class UserAdminModel extends Model
{
    use HasFactory;
    protected $table = 'user_admin';
    protected $fillable = [
        'username',
        'password',
    ];

    public function olimpiada(){
        return $this->hasMany(OlimpiadaModel::class, 'id_user_admin');
    }
}