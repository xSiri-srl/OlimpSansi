import { useState, useEffect } from "react";
import HeaderSelector from "../components/HeaderSelector";
import AccionesFooter from "../components/AccionesFooter";
import ModalAlerta from "../../../components/Modales/ModalAlerta";
import ModalTareasPendientes from "../../../components/Modales/ModalTareasPendientes";
import ModalConfirmacion from "../../../components/Modales/ModalConfirmacion";
import { useNotificarProgreso } from "../hooks/useNotificarProgreso";
import { useVerificarInscripciones } from "../hooks/useVerificarInscripciones";

import { useOlimpiadas } from "./hooks/useOlimpiadas";
import { useAreasAsociadas } from "./hooks/useAreasAsociadas";
import { useLimiteAreas } from "./hooks/useLimiteAreas";
import { useModales } from "./hooks/useModales";

import ContadorAreas from "./components/ContadorAreas";
import EstadoCarga from "./components/EstadoCarga";
import MensajeSeleccion from "./components/MensajeSeleccion";
import AlertasInformativas from "./components/AlertasInformativas ";


const AsignarLimiteAreas = () => {
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const { olimpiadas, cargandoOlimpiadas, errorCarga } = useOlimpiadas();
  const { cantidadAreasAsociadas, cargandoAreas, obtenerCantidadAreasAsociadas } = useAreasAsociadas();
  const maximoPermitido = cantidadAreasAsociadas > 0 ? Math.min(7, cantidadAreasAsociadas) : 7;

  const {
    contador,
    guardando,
    mensajeExito,
    cargarNumeroMaximo,
    ejecutarGuardado,
    incrementar,
    decrementar,
    resetearContador,
  } = useLimiteAreas(maximoPermitido);

  const { modalEstado, cerrarModal, mostrarAlerta, mostrarConfirmacion } = useModales();
  const { modalProgreso, mostrarProgreso, cerrarProgreso } = useNotificarProgreso();
  const { verificarInscripciones, verificando } = useVerificarInscripciones();

  const obtenerMensajeBloqueo = () => {
    switch (razonBloqueo) {
      case "inscripciones_y_periodo":
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString("es-ES")}. No se pueden modificar el límite de áreas.`;
      case "inscripciones":
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden modificar el límite de áreas mientras existan inscripciones activas.`;
      case "periodo":
        return `El período de inscripción para esta olimpiada terminó el ${new Date(fechaFin).toLocaleDateString("es-ES")}. No se pueden modificar el límite de áreas.`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (olimpiadaSeleccionada) {
      const olimpiada = olimpiadas.find((o) => o.id.toString() === olimpiadaSeleccionada);
      setNombreOlimpiada(olimpiada ? olimpiada.titulo : "");

      obtenerCantidadAreasAsociadas(olimpiadaSeleccionada);
      cargarNumeroMaximo(olimpiadaSeleccionada);

      verificarInscripciones(olimpiadaSeleccionada).then((resultado) => {
        setOlimpiadaBloqueada(resultado.estaBloqueada);
        setCantidadInscripciones(resultado.cantidad);
        setPeriodoTerminado(resultado.periodoTerminado);
        setRazonBloqueo(resultado.razonBloqueo);
        setFechaFin(resultado.fechaFin);
      });
    } else {
      setNombreOlimpiada("");
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      setPeriodoTerminado(false);
      setRazonBloqueo(null);
      setFechaFin(null);
      resetearContador();
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  const manejarIncrementar = () => {
    const incrementado = incrementar(maximoPermitido);

    if (!incrementado && cantidadAreasAsociadas > 0) {
      mostrarAlerta(
        "Límite máximo alcanzado",
        `No puede establecer más de ${cantidadAreasAsociadas} ${
          cantidadAreasAsociadas === 1 ? "área" : "áreas"
        } porque es la cantidad total de áreas asociadas a esta olimpiada.`,
        "warning"
      );
    }
  };

  const manejarDecrementar = () => {
    decrementar();
  };

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
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar el límite de áreas, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case "periodo":
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString("es-ES")}.`;
          break;
      }

      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }

    if (cantidadAreasAsociadas === 0) {
      mostrarAlerta(
        "Sin áreas asociadas",
        "Esta olimpiada no tiene áreas asociadas. Primero debe configurar las áreas de competencia antes de establecer el límite por participante.",
        "warning"
      );
      return;
    }

    if (contador > cantidadAreasAsociadas) {
      mostrarAlerta(
        "Límite excedido",
        `No puede establecer un límite de ${contador} ${
          contador === 1 ? "área" : "áreas"
        } cuando la olimpiada solo tiene ${cantidadAreasAsociadas} ${
          cantidadAreasAsociadas === 1 ? "área asociada" : "áreas asociadas"
        }. El límite máximo permitido es ${cantidadAreasAsociadas}.`,
        "error"
      );
      return;
    }

    mostrarConfirmacion(
      "Confirmar cambio de límite",
      `¿Está seguro que desea establecer el límite de áreas por participante en ${contador} ${
        contador === 1 ? "área" : "áreas"
      } para la olimpiada "${nombreOlimpiada}"?`,
      () => {
        cerrarModal();
        manejarEjecucionGuardado();
      },
      "info"
    );
  };

  const manejarEjecucionGuardado = async () => {
    const resultado = await ejecutarGuardado(olimpiadaSeleccionada);

    if (resultado.success) {
      setTimeout(() => mostrarProgreso(olimpiadaSeleccionada, nombreOlimpiada), 1000);
    } else {
      mostrarAlerta("Error al guardar", resultado.error, "error");
    }
  };

  const renderizarContenido = () => {
    if (!olimpiadaSeleccionada) return <MensajeSeleccion />;

    if (cargandoOlimpiadas || verificando || cargandoAreas) {
      return (
        <EstadoCarga
          cargandoOlimpiadas={cargandoOlimpiadas}
          verificando={verificando}
          cargandoAreas={cargandoAreas}
        />
      );
    }

    return (
      <ContadorAreas
        contador={contador}
        maximoPermitido={maximoPermitido}
        olimpiadaBloqueada={olimpiadaBloqueada}
        onIncrementar={manejarIncrementar}
        onDecrementar={manejarDecrementar}
      />
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <HeaderSelector
        nombreOlimpiada={nombreOlimpiada}
        olimpiadas={olimpiadas}
        olimpiadaSeleccionada={olimpiadaSeleccionada}
        setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
        titulo="Asignación de límite de áreas por participante"
        subtitulo="Defina el límite de áreas por participante"
        cargando={cargandoOlimpiadas}
        error={errorCarga}
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <AlertasInformativas
          olimpiadaBloqueada={olimpiadaBloqueada}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          cantidadAreasAsociadas={cantidadAreasAsociadas}
          cargandoAreas={cargandoAreas}
          maximoPermitido={maximoPermitido}
          obtenerMensajeBloqueo={obtenerMensajeBloqueo}
        />

        {renderizarContenido()}

        <AccionesFooter
          guardarConfiguracion={guardarConfiguracion}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          guardando={guardando}
          mensajeExito={mensajeExito}
          textoBoton="Guardar Número de Áreas"
          bloqueado={olimpiadaBloqueada}
        />
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

      <ModalTareasPendientes
        isOpen={modalProgreso.isOpen}
        onClose={cerrarProgreso}
        onContinue={cerrarProgreso}
        nombreOlimpiada={modalProgreso.nombreOlimpiada}
        olimpiadaId={modalProgreso.olimpiadaId}
        esPrimeraVez={true}
      />
    </div>
  );
};

export default AsignarLimiteAreas;
