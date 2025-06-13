<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Orden de Pago</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 20px;
            font-size: 12px;
            line-height: 1.3;
        }

        .text-center { text-align: center; }
        .text-end { text-align: right; }
        .mt-4 { margin-top: 0.8rem; }
        .mb-4 { margin-bottom: 0.8rem; }
        .mb-3 { margin-bottom: 0.5rem; }

        h4, h5, h6 {
            margin: 5px 0;
            line-height: 1.1;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.8rem;
        }

        table, th, td {
            border: 1px solid #000;
        }

        th, td {
            padding: 4px;
            font-size: 11px;
        }

        .firma {
            margin-top: 20px;
        }

        .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #555;
        }

        .section-label {
            font-weight: bold;
        }

        p {
            margin: 8px 0;
        }
    </style>
</head>
<body>
    @php
        use App\Helpers\OrdenPagoHelper;
        
        // Obtener información de costos usando el nuevo helper
        $costosOlimpiada = OrdenPagoHelper::obtenerCostosOlimpiada($ordenPago->codigo_generado);
        
        // Obtener inscripciones agrupadas por área
        $inscripcionesPorArea = $ordenPago->inscripcion()
            ->with(['olimpiadaAreaCategoria.area'])
            ->get()
            ->groupBy(function($inscripcion) {
                return $inscripcion->olimpiadaAreaCategoria->area->nombre_area;
            });
        
        $totalGeneral = 0;
        $detallesAreas = [];
        
        if ($costosOlimpiada['success'] && $costosOlimpiada['costo_unico']) {
            // Caso: Costo único para todas las áreas
            $totalInscritos = $ordenPago->inscripcion->count();
            $costoUnitario = $costosOlimpiada['costo'];
            $totalGeneral = $totalInscritos * $costoUnitario;
            $tieneCostoUnico = true;
        } else {
            // Caso: Costos diferentes por área
            $tieneCostoUnico = false;
            
            foreach ($inscripcionesPorArea as $nombreArea => $inscripciones) {
                $cantidadInscripciones = $inscripciones->count();
                
                // Buscar el costo para esta área específica
                $costoArea = 20; // Valor por defecto
                if ($costosOlimpiada['success'] && !empty($costosOlimpiada['costos_por_area'])) {
                    foreach ($costosOlimpiada['costos_por_area'] as $area) {
                        if ($area['nombre_area'] === $nombreArea) {
                            $costoArea = $area['costo'];
                            break;
                        }
                    }
                }
                
                $subtotal = $cantidadInscripciones * $costoArea;
                $totalGeneral += $subtotal;
                
                $detallesAreas[] = [
                    'area' => $nombreArea,
                    'cantidad' => $cantidadInscripciones,
                    'costo_unitario' => $costoArea,
                    'subtotal' => $subtotal
                ];
            }
        }
    @endphp

    <!-- Encabezado -->
    <div class="text-center mb-4">
        <h4>UNIVERSIDAD MAYOR DE SAN SIMÓN</h4>
        <h6>DIRECCION ADMINISTRATIVA Y FINANCIERA</h6>
    </div>

    <!-- Orden de Pago -->
    <h4 class="mb-3">Orden de Pago:{{ $ordenPago->numero_orden_pago }}</h4>

    <!-- Unidad -->
    <p><span class="section-label">Emitido por la Unidad:</span><br>
        Comité de las Olimpiadas Científicas San Simón, Facultad de Ciencias y Tecnología
    </p>
     <!-- Titulo -->
    <p><span class="section-label">Inscripcion a:</span><br>
       {{ $ordenPago->inscripcion->first()?->olimpiadaAreaCategoria?->olimpiada?->titulo ?? 'No disponible' }}
    </p>

    <!-- Responsable -->
    <p><span class="section-label">Responsable:</span><br>
        @if($ordenPago->responsable)
            {{ $ordenPago->responsable->nombre }} {{ $ordenPago->responsable->apellido_pa }} {{ $ordenPago->responsable->apellido_ma }}
            (CI: {{ $ordenPago->responsable->ci }}{{ $ordenPago->responsable->complemento ? ' ' . $ordenPago->responsable->complemento : '' }})
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
            @if($tieneCostoUnico)
                {{-- Costo único para todos los participantes --}}
                <tr class="text-center">
                    <td>{{ $totalInscritos }}</td>
                    <td>Inscripción de estudiante(s) para olimpiada asociado al código de preinscripción {{ $ordenPago->codigo_generado }}</td>
                    <td>{{ $costoUnitario }}</td>
                    <td>{{ $totalGeneral }}</td>
                </tr>
            @else
                {{-- Desglose por área con costos diferentes --}}
                @foreach($detallesAreas as $detalle)
                    <tr class="text-center">
                        <td>{{ $detalle['cantidad'] }}</td>
                        <td>Inscripción de estudiante(s) - Área: {{ $detalle['area'] }} (Código: {{ $ordenPago->codigo_generado }})</td>
                        <td>{{ $detalle['costo_unitario'] }}</td>
                        <td>{{ $detalle['subtotal'] }}</td>
                    </tr>
                @endforeach
            @endif
        </tbody>
        <tfoot>
            <tr class="text-end">
                <th colspan="3">Total (Bs):</th>
                <th class="text-center">{{ $totalGeneral }}</th>
            </tr>
        </tfoot>
    </table>

    <p><span class="section-label">La suma de:</span> {{ OrdenPagoHelper::mostrarOrdenPago($totalGeneral) }} 00/100 BOLIVIANOS</p>

    <!-- Firma -->
    <div class="firma">
        <p>
            <strong>Responsable de Pago:</strong> {{ $ordenPago->responsable->nombre ?? 'No registrado' }} {{ $ordenPago->responsable->apellido_pa ?? '' }} {{ $ordenPago->responsable->apellido_ma ?? '' }}
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