<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'registro','*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://xsiri.tis.cs.umss.edu.bo','http://localhost:5173',],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];