<?php

namespace App\Models\NombreDeHU1;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPruebaModel extends Model {
    use HasFactory;
    protected $table = 'users_prueba';
    protected $fillable = ['name', 'email', 'password'];
}
