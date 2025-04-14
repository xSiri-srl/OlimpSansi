<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Orden de Pago</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 40px;
            font-size: 13px;
            line-height: 1.5;
        }

        .text-center { text-align: center; }
        .text-end { text-align: right; }
        .mt-4 { margin-top: 1.5rem; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mb-3 { margin-bottom: 1rem; }

        h4, h5, h6 {
            margin: 0;
            line-height: 1.2;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1.5rem;
        }

        table, th, td {
            border: 1px solid #000;
        }

        th, td {
            padding: 8px;
            font-size: 13px;
        }

        .firma {
            margin-top: 50px;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #555;
        }

        .section-label {
            font-weight: bold;
        }
    </style>
</head>
<body>

    <!-- Encabezado -->
    <div class="text-center mb-4">
        <h4>UNIVERSIDAD MAYOR DE SAN SIMÓN</h4>
        <h5>Facultad de Ciencias y Tecnología</h5>
        <h6>Secretaría Administrativa</h6>
    </div>

    <!-- Orden de Pago -->
    <h4 class="mb-3">Orden de Pago: {{ $ordenPago->codigo_generado }}</h4>

    <!-- Unidad -->
    <p><span class="section-label">Emitido por la Unidad:</span><br>
        Comité de las Olimpiadas Científicas San Simón, Facultad de Ciencias y Tecnología
    </p>

    <!-- Responsable -->
    <p><span class="section-label">Responsable:</span><br>
        @if($inscripcion->responsable)
            {{ $inscripcion->responsable->nombre }} {{ $inscripcion->responsable->apellido_pa }} {{ $inscripcion->responsable->apellido_ma }}
            (CI: {{ $inscripcion->responsable->ci }}{{ $inscripcion->responsable->complemento ? ' ' . $inscripcion->responsable->complemento : '' }})
        @else
            No registrado
        @endif
    </p>

    <!-- Fecha -->
    <p><span class="section-label">Fecha de Emisión:</span> {{ now()->format('d/m/Y') }}</p>

    <!-- Tabla de detalles -->
    <table>
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
                <td>{{ intval($ordenPago->monto_total / 20) }}</td>
                <td>Inscripción de un estudiante en un area</td>
                <td>20 </td>
                <td>{{ number_format($ordenPago->monto_total, 2) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr class="text-end">
                <th colspan="3">Total (Bs):</th>
                <th class="text-center">{{ number_format($ordenPago->monto_total, 2) }}</th>
            </tr>
        </tfoot>
    </table>

    <!-- Firma -->
    <div class="firma">
        <p>
            <strong>Responsable de Pago:</strong><br>
            {{ $inscripcion->responsable->nombre ?? 'No registrado' }} {{ $inscripcion->responsable->apellido_pa ?? '' }} {{ $inscripcion->responsable->apellido_ma ?? '' }}
        </p>
        <p>
            <strong>Firma:</strong> ___________________________
        </p>
    </div>

    <!-- Pie de página -->
    <div class="footer">
        Cochabamba, {{ now()->format('d/m/Y') }}
    </div>

</body>
</html>
