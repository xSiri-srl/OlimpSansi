<!-- resources/views/emails/inscripcion_completada.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Inscripción Completada</title>
</head>
<body>
    <h1>¡Felicidades!</h1>
    <p>Tu inscripción ha sido completada exitosamente.</p>
    <p>Tu código de preinscripción es: <strong>{{ $codigoPreinscripcion }}</strong>.</p>
    <p>Este código te permitirá generar tu orden de pago y subir tu comprobante de pago.</p>
    <p>¡Gracias por registrarte en la olimpiada <strong>{{ $nombreOlimpiada }}</strong>.</p>
    <p>NO RESPONDER A ESTE CORREO</p>
</body>
</html>
