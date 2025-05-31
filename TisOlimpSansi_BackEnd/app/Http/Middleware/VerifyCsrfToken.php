<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Si tienes problemas con CSRF, puedes comentar esta línea cuando termines de depurar
        // 'asociar-areas-olimpiada',
    ];
}