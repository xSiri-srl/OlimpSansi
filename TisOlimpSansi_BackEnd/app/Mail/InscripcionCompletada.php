<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InscripcionCompletada extends Mailable
{
    use Queueable, SerializesModels;

    public $codigoPreinscripcion;
    public $nombreOlimpiada;
    public $correoEstudiante;

    public function __construct($codigoPreinscripcion, $correoEstudiante, $nombreOlimpiada)
    {
        $this->codigoPreinscripcion = $codigoPreinscripcion;
        $this->correoEstudiante = $correoEstudiante;
        $this->nombreOlimpiada = $nombreOlimpiada;
    }

    public function build()
    {
        return $this->from('noreply@yourdomain.com', 'Sistema de Inscripciones')
                    ->subject('Inscripción Completada')
                    ->view('emails.inscripcion_completada')
                    ->with([
                        'codigoPreinscripcion' => $this->codigoPreinscripcion,
                        'nombreOlimpiada' => $this->nombreOlimpiada,
                    ]);
    }
}
