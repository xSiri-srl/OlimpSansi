import React from "react";

const MensajeBloqueo = ({
  olimpiadaBloqueada,
  razonBloqueo,
  cantidadInscripciones,
  fechaFin,
}) => {
  const obtenerMensajeBloqueo = () => {
    switch (razonBloqueo) {
      case "inscripciones_y_periodo":
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(
          fechaFin
        ).toLocaleDateString(
          "es-ES"
        )}. No se pueden realizar cambios en las áreas de competencia.`;
      case "inscripciones":
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden realizar cambios en las áreas de competencia mientras existan inscripciones activas.`;
      case "periodo":
        return `El período de inscripción para esta olimpiada terminó el ${new Date(
          fechaFin
        ).toLocaleDateString(
          "es-ES"
        )}. No se pueden realizar cambios en las áreas de competencia.`;
      default:
        return "";
    }
  };

  if (!olimpiadaBloqueada) return null;

  return (
    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <strong className="font-bold">
          Olimpiada bloqueada para modificaciones
        </strong>
      </div>
      <span className="block mt-1">{obtenerMensajeBloqueo()}</span>
    </div>
  );
};

export default MensajeBloqueo;