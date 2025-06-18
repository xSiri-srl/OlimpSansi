import HeaderSelector from "../components/HeaderSelector";
import AreaCompetencia from "../components/AreaCompetencia";
import AccionesFooter from "../components/AccionesFooter";
import { gradosDisponibles } from "../CrearOlimpiadas/AreasCompetencia/constants";
import { useVerificarInscripciones } from "../hooks/useVerificarInscripciones";

import ModalConfirmacion from "../../../components/Modales/ModalConfirmacion";
import ModalAlerta from "../../../components/Modales/ModalAlerta";
import ModalResumenCambios from "../../../components/Modales/ModalResumenCambios";

import { useOlimpiadas } from "./hooks/useOlimpiadas";
import { useAreasOlimpiada } from "./hooks/useAreasCompetencia";
import { useGrados } from "./hooks/useGrados";
import { useModalState } from "./hooks/useModalState";
import { useOlimpiadaState } from "./hooks/useOlimpiadaState";
import { useGuardarConfiguracion } from "./hooks/useGuardarConfiguracion";
import { useEliminarCategoria } from "./hooks/useEliminarCategoria";

const DesasignarAreaNivel = () => {
  const { olimpiadas, cargandoOlimpiadas, errorCarga } = useOlimpiadas();
  const {
    combinaciones,
    setCombinaciones,
    cargandoAreas,
    cargarAreasAsociadas,
    resetearAreas,
    marcarCategoriaParaEliminar,
  } = useAreasOlimpiada();
  const { verificarInscripciones, verificando } = useVerificarInscripciones();
  const { todosLosGrados, cargandoGrados, errorGrados } = useGrados();

  const {
    modalEstado,
    cerrarModal,
    mostrarAlerta,
    mostrarConfirmacion,
    mostrarResumenCambios,
  } = useModalState();

  const {
    olimpiadaSeleccionada,
    setOlimpiadaSeleccionada,
    nombreOlimpiada,
    olimpiadaBloqueada,
    cantidadInscripciones,
    razonBloqueo,
    fechaFin,
    obtenerMensajeBloqueo,
  } = useOlimpiadaState(
    olimpiadas,
    verificarInscripciones,
    cargarAreasAsociadas,
    resetearAreas
  );

  const { guardando, mensajeExito, setMensajeExito, ejecutarGuardado } =
    useGuardarConfiguracion(cargarAreasAsociadas);

  const { eliminarCategoriaIndividual } = useEliminarCategoria(
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
  );
  const guardarConfiguracion = async () => {
    if (!olimpiadaSeleccionada) {
      mostrarAlerta("Error", "Por favor seleccione una olimpiada", "warning");
      return;
    }

    if (olimpiadaBloqueada) {
      let mensaje = "No se pueden realizar cambios en esta olimpiada.";

      switch (razonBloqueo) {
        case "inscripciones_y_periodo":
          mensaje = `No se pueden realizar cambios en esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(
            fechaFin
          ).toLocaleDateString("es-ES")}.`;
          break;
        case "inscripciones":
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para desasociar áreas, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case "periodo":
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(
            fechaFin
          ).toLocaleDateString("es-ES")}.`;
          break;
      }

      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }

    const areasParaDesasociar = combinaciones.filter(
      (combo) => combo.yaAsociada && !combo.habilitado
    );

    const categoriasParaEliminar = [];
    combinaciones.forEach((combo) => {
      if (
        combo.yaAsociada &&
        combo.habilitado &&
        combo.categoriasEliminadas &&
        combo.categoriasEliminadas.length > 0
      ) {
        categoriasParaEliminar.push({
          combo: combo,
          categorias: combo.categoriasEliminadas,
        });
      }
    });

    if (
      areasParaDesasociar.length === 0 &&
      categoriasParaEliminar.length === 0
    ) {
      mostrarAlerta(
        "Sin cambios",
        "No hay cambios para guardar. Seleccione áreas para desasociar o marque categorías para desasociar.",
        "warning"
      );
      return;
    }

    mostrarResumenCambios(
      areasParaDesasociar,
      categoriasParaEliminar,
      async () => {
        cerrarModal();
        const resultado = await ejecutarGuardado(
          olimpiadaSeleccionada,
          areasParaDesasociar,
          categoriasParaEliminar
        );

        if (!resultado.success) {
          mostrarAlerta("Error al guardar", resultado.error, "error");
        }
      }
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Desasignar Area/Nivel
      </h2>
      <HeaderSelector
        nombreOlimpiada={nombreOlimpiada}
        olimpiadas={olimpiadas}
        olimpiadaSeleccionada={olimpiadaSeleccionada}
        setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
        cargando={cargandoOlimpiadas}
        error={errorCarga}
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        {olimpiadaBloqueada && (
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
                ></path>
              </svg>
              <strong className="font-bold">
                Olimpiada bloqueada para modificaciones
              </strong>
            </div>
            <span className="block mt-1">{obtenerMensajeBloqueo()}</span>
          </div>
        )}

        {cargandoOlimpiadas ||
        cargandoAreas ||
        verificando ||
        cargandoGrados ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <p className="mt-2 text-gray-600">
              {cargandoOlimpiadas
                ? "Cargando olimpiadas..."
                : verificando
                ? "Verificando inscripciones..."
                : cargandoGrados
                ? "Cargando grados..."
                : "Cargando áreas asociadas..."}
            </p>
          </div>
        ) : errorCarga || errorGrados ? (
          <div className="text-center py-8 text-red-600">
            <p>{errorCarga}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {combinaciones.map((combo, comboIndex) => (
              <AreaCompetencia
                key={comboIndex}
                combo={combo}
                comboIndex={comboIndex}
                gradosDisponibles={gradosDisponibles}
                combinaciones={combinaciones}
                setCombinaciones={setCombinaciones}
                eliminarCombinacion={() => {}}
                olimpiadaSeleccionada={olimpiadaSeleccionada}
                modoAsociacion={false}
                todosLosGrados={todosLosGrados}
                onEliminarCategoria={eliminarCategoriaIndividual}
                bloqueado={olimpiadaBloqueada}
              />
            ))}

            <AccionesFooter
              guardarConfiguracion={guardarConfiguracion}
              olimpiadaSeleccionada={olimpiadaSeleccionada}
              guardando={guardando}
              mensajeExito={mensajeExito}
              textoBoton="Guardar Configuración"
              bloqueado={olimpiadaBloqueada}
            />
          </>
        )}
      </div>

      {modalEstado.tipo === "alerta" && (
        <ModalAlerta
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          type={modalEstado.tipoAlerta}
        />
      )}

      {modalEstado.tipo === "confirmacion" && (
        <ModalConfirmacion
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          onConfirm={modalEstado.onConfirm}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          type={modalEstado.tipoConfirmacion}
        />
      )}

      {modalEstado.tipo === "resumenCambios" && (
        <ModalResumenCambios
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          onConfirm={modalEstado.onConfirm}
          areasParaDesasociar={modalEstado.datos?.areasParaDesasociar || []}
          categoriasParaEliminar={
            modalEstado.datos?.categoriasParaEliminar || []
          }
        />
      )}
    </div>
  );
};

export default DesasignarAreaNivel;
