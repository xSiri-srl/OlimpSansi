<!-- resources/views/emails/inscripcion_completada.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Preinscripción Completada</title>
</head>
<body>
    <h1>¡Su inscripción aún NO ha terminado!</h1>
    <p>Tu código de preinscripción es: <strong>{{ $codigoPreinscripcion }}</strong></p>
    <p>Este código te permitirá generar tu orden de pago y subir tu comprobante de pago.</p>
    <p>¡Gracias por registrarte en la olimpiada <strong>{{ $nombreOlimpiada }}</strong>.</p>
    <p>NO RESPONDER A ESTE CORREO</p>
</body>
</html>
