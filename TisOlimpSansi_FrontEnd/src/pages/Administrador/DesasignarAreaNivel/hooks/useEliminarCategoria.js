export const useEliminarCategoria = (
  olimpiadaSeleccionada,
  olimpiadaBloqueada,
  razonBloqueo,
  cantidadInscripciones,
  fechaFin,
  marcarCategoriaParaEliminar,
  mostrarAlerta,
  mostrarConfirmacion,
  setMensajeExito,
  cerrarModal
) => {
  const obtenerMensajeBloqueoCategoria = () => {
    switch (razonBloqueo) {
      case "inscripciones_y_periodo":
        return `No se pueden desasociar categorías de esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(
          fechaFin
        ).toLocaleDateString("es-ES")}.`;
      case "inscripciones":
        return `No se pueden desasociar categorías de esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para desasociar categorías, primero debe eliminar todas las inscripciones asociadas.`;
      case "periodo":
        return `No se pueden desasociar categorías de esta olimpiada porque el período de inscripción terminó el ${new Date(
          fechaFin
        ).toLocaleDateString("es-ES")}.`;
      default:
        return "No se pueden desasociar categorías de esta olimpiada.";
    }
  };

  const eliminarCategoriaIndividual = async (combo, categoria, index) => {
    if (!olimpiadaSeleccionada) {
      mostrarAlerta("Error", "No hay olimpiada seleccionada", "error");
      return;
    }

    if (olimpiadaBloqueada) {
      mostrarAlerta(
        "Olimpiada bloqueada",
        obtenerMensajeBloqueoCategoria(),
        "error"
      );
      return;
    }

    const confirmarEliminacion = () => {
      try {
        marcarCategoriaParaEliminar(combo.area, categoria);
        cerrarModal();
        setMensajeExito(
          "Categoría marcada para desasociar. Presione 'Guardar Configuración' para aplicar los cambios permanentemente."
        );
        setTimeout(() => setMensajeExito(""), 3000);
      } catch (error) {
        console.error("Error al marcar categoría para eliminar:", error);
        cerrarModal();
        mostrarAlerta(
          "Error",
          "Ocurrió un error al marcar la categoría para desasociar",
          "error"
        );
      }
    };

    mostrarConfirmacion(
      "Confirmar desasociación de categoría",
      `¿Está seguro que desea marcar para desasociar la categoría "${categoria.nombre}" del área "${combo.area}"?\n\nLos cambios se aplicarán al presionar "Guardar Configuración".`,
      confirmarEliminacion,
      "danger"
    );
  };

  return {
    eliminarCategoriaIndividual,
  };
};
