<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orden de Pago</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .firma {
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-10">

                <!-- Encabezado institucional -->
                <div class="text-center mb-4">
                    <h4>UNIVERSIDAD MAYOR DE SAN SIMÓN</h4>
                    <h5>Facultad de Ciencias y Tecnología</h5>
                    <h6>Secretaría Administrativa</h6>
                </div>

                <!-- Información de la Orden de Pago -->
                <div class="card">
                    <div class="card-header">
                        <strong>Orden de Pago: {{ $ordenPago->codigo_generado }}</strong>
                    </div>
                    <div class="card-body">

                        <!-- Datos del responsable -->
                        <div class="mb-3">
                            <label class="form-label">Emitido por la Unidad:</label>
                            <div>Comité de las Olimpiadas Científicas San Simón, Facultad de Ciencias y Tecnología</div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Responsable:</label>
                            <div>
                                @if($inscripcion->responsable)
                                    {{ $inscripcion->responsable->nombre }} {{ $inscripcion->responsable->apellido_pa }} {{ $inscripcion->responsable->apellido_ma }}
                                    (CI: {{ $inscripcion->responsable->ci }}{{ $inscripcion->responsable->complemento ? ' ' . $inscripcion->responsable->complemento : '' }})
                                @else
                                    No registrado
                                @endif
                            </div>
                        </div>

                        <!-- Fecha y código de seguimiento -->
                        <div class="mb-3">
                            <label class="form-label">Fecha de Emisión:</label>
                            <div>{{ now()->format('d/m/Y') }}</div>
                        </div>
                        
                        <!-- Detalles de la inscripción -->
                        <table class="table table-bordered mt-4">
                            <thead>
                                <tr class="text-center">
                                    <th>Cantidad</th>
                                    <th>Concepto</th>
                                    <th>Precio Unitario (Bs)</th>
                                    <th>Subtotal (Bs)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center">
                                    <td>1</td>
                                    <td>Inscripción de un estudiante</td>
                                    <td>20.00</td>
                                    <td>20.00</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="text-end">
                                    <th colspan="3">Total (Bs):</th>
                                    <th class="text-center">20.00</th>
                                </tr>
                            </tfoot>
                        </table>

                        <!-- Responsable y firma -->
                        <div class="firma">
                            <div>
                                <strong>Responsable de Pago:</strong>
                                {{ $inscripcion->responsable->nombre ?? 'No registrado' }} {{ $inscripcion->responsable->apellido_pa ?? '' }} {{ $inscripcion->responsable->apellido_ma ?? '' }}
                            </div>
                            <div>
                                <strong>Firma:</strong> ___________________________
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-muted text-center">
                        Cochabamba, {{ now()->format('d/m/Y') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scripts de Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
