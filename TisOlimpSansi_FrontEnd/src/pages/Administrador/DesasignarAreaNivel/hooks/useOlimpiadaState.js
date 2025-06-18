import { useState, useEffect } from "react";

export const useOlimpiadaState = (
  olimpiadas,
  verificarInscripciones,
  cargarAreasAsociadas,
  resetearAreas
) => {
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const obtenerMensajeBloqueo = () => {
    switch (razonBloqueo) {
      case "inscripciones_y_periodo":
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(
          fechaFin
        ).toLocaleDateString(
          "es-ES"
        )}. No se pueden desasociar áreas ni categorías.`;
      case "inscripciones":
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden desasociar áreas ni categorías mientras existan inscripciones activas.`;
      case "periodo":
        return `El período de inscripción para esta olimpiada terminó el ${new Date(
          fechaFin
        ).toLocaleDateString(
          "es-ES"
        )}. No se pueden desasociar áreas ni categorías.`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (olimpiadaSeleccionada) {
      const olimpiada = olimpiadas.find(
        (o) => o.id.toString() === olimpiadaSeleccionada
      );
      setNombreOlimpiada(olimpiada ? olimpiada.titulo : "");

      verificarInscripciones(olimpiadaSeleccionada).then((resultado) => {
        setOlimpiadaBloqueada(resultado.estaBloqueada);
        setCantidadInscripciones(resultado.cantidad);
        setPeriodoTerminado(resultado.periodoTerminado);
        setRazonBloqueo(resultado.razonBloqueo);
        setFechaFin(resultado.fechaFin);
      });

      cargarAreasAsociadas(olimpiadaSeleccionada);
    } else {
      setNombreOlimpiada("");
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      setPeriodoTerminado(false);
      setRazonBloqueo(null);
      setFechaFin(null);
      resetearAreas();
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  return {
    olimpiadaSeleccionada,
    setOlimpiadaSeleccionada,
    nombreOlimpiada,
    olimpiadaBloqueada,
    cantidadInscripciones,
    periodoTerminado,
    razonBloqueo,
    fechaFin,
    obtenerMensajeBloqueo,
  };
};
