<?php

use NumberToWords\NumberToWords;

function mostrarOrdenPago($numero) {
    $numberToWords = new NumberToWords();
    $numberTransformer = $numberToWords->getNumberTransformer('es'); // 'es' para español

    $literal = $numberTransformer->toWords($numero); // convierte a palabras
    return mb_strtoupper($literal, 'UTF-8');
}