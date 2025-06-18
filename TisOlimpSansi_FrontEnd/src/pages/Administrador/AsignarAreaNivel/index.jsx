import React, { useState, useEffect } from "react";

// Components
import AreaCompetencia from "../components/AreaCompetencia";
import AccionesFooter from "../components/AccionesFooter";
import HeaderSelector from "../components/HeaderSelector";
import SelectorOlimpiada from "./components/SelectorOlimpiada";
import MensajeBloqueo from "./components/MensajeBloqueo";
import Cargando from "./components/Cargando";
import ErrorDisplay from "./components/ErrorDisplay";
import ModalesContainer from "./components/ModalesContainer";

// Hooks
import { useOlimpiadas } from "./hooks/useOlimpiadas";
import { useAreasCompetencia } from "./hooks/useAreasCompetencia";
import { useGrados } from "./hooks/useGrados";
import { useModalEstado } from "./hooks/useModalEstado";
import { useGuardarConfiguracion } from "./hooks/useGuardarConfiguracion";
import { useNotificarProgreso } from "../hooks/useNotificarProgreso";
import { useVerificarInscripciones } from "../hooks/useVerificarInscripciones";

// Constants
import { gradosDisponibles } from "../components/constants";

const SelectorAreaGrado = () => {
  // Estados básicos
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Custom hooks
  const { olimpiadas, cargandoOlimpiadas, errorCarga } = useOlimpiadas();
  const {
    combinaciones,
    setCombinaciones,
    cargandoAreas,
    cargarAreasAsociadas,
    resetAreas,
  } = useAreasCompetencia();
  const { todosLosGrados } = useGrados();
  const {
    modalEstado,
    cerrarModal,
    mostrarAlerta,
    mostrarConfirmacion,
    mostrarValidacion,
  } = useModalEstado();
  const { guardando, mensajeExito, ejecutarGuardado } =
    useGuardarConfiguracion();
  const { verificarInscripciones, verificando } = useVerificarInscripciones();
  const { modalProgreso, mostrarProgreso, cerrarProgreso } =
    useNotificarProgreso();

  // Efecto para manejar cambios en la olimpiada seleccionada
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
      resetAreas();
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  // Función para validar y guardar configuración
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
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar las áreas de competencia, primero debe eliminar todas las inscripciones asociadas.`;
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

    const areasHabilitadas = combinaciones.filter((combo) => combo.habilitado);
    if (areasHabilitadas.length === 0) {
      mostrarAlerta(
        "Áreas requeridas",
        "Debe habilitar al menos un área de competencia",
        "warning"
      );
      return;
    }

    const areasSinCategorias = areasHabilitadas.filter(
      (combo) => !combo.categorias || combo.categorias.length === 0
    );

    if (areasSinCategorias.length > 0) {
      const areasNombres = areasSinCategorias.map((a) => a.area);
      mostrarValidacion(
        "Áreas sin categorías",
        "Las siguientes áreas no tienen categorías definidas. Debe definir al menos una categoría por área:",
        "areas-sin-categorias",
        areasNombres
      );
      return;
    }

    let tieneCategoriaDuplicada = false;
    let areaDuplicada = "";
    let categoriaDuplicada = "";

    areasHabilitadas.forEach((combo) => {
      const categoriasVistas = new Set();

      combo.categorias.forEach((cat) => {
        if (categoriasVistas.has(cat.nombre)) {
          tieneCategoriaDuplicada = true;
          areaDuplicada = combo.area;
          categoriaDuplicada = cat.nombre;
        } else {
          categoriasVistas.add(cat.nombre);
        }
      });
    });

    if (tieneCategoriaDuplicada) {
      mostrarValidacion(
        "Categoría duplicada",
        `Error: El área "${areaDuplicada}" tiene la categoría "${categoriaDuplicada}" duplicada. No se pueden asociar dos categorías iguales a la misma área.`,
        "categoria-duplicada"
      );
      return;
    }

    mostrarConfirmacion(
      "Confirmar guardado",
      `¿Está seguro que desea guardar la configuración de áreas para la olimpiada "${nombreOlimpiada}"?\n\nSe asociarán ${areasHabilitadas.length} área(s) de competencia.`,
      () => {
        cerrarModal();
        ejecutarGuardado(
          olimpiadaSeleccionada,
          combinaciones,
          mostrarAlerta,
          mostrarProgreso,
          nombreOlimpiada,
          cargarAreasAsociadas
        );
      },
      "info"
    );
  };

  // Determinar mensaje de carga
  const obtenerMensajeCarga = () => {
    if (cargandoOlimpiadas) return "Cargando olimpiadas...";
    if (verificando) return "Verificando inscripciones...";
    if (cargandoAreas) return "Cargando áreas asociadas...";
    return "";
  };

  const estaCargando = cargandoOlimpiadas || cargandoAreas || verificando;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Áreas de Competencia
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
        <MensajeBloqueo
          olimpiadaBloqueada={olimpiadaBloqueada}
          razonBloqueo={razonBloqueo}
          cantidadInscripciones={cantidadInscripciones}
          fechaFin={fechaFin}
        />

        {estaCargando ? (
          <Cargando mensaje={obtenerMensajeCarga()} />
        ) : errorCarga ? (
          <ErrorDisplay error={errorCarga} />
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
                modoAsociacion={true}
                todosLosGrados={todosLosGrados}
                bloqueado={olimpiadaBloqueada}
              />
            ))}

            <AccionesFooter
              guardarConfiguracion={guardarConfiguracion}
              olimpiadaSeleccionada={olimpiadaSeleccionada}
              guardando={guardando}
              mensajeExito={mensajeExito}
              bloqueado={olimpiadaBloqueada}
            />
          </>
        )}
      </div>

      <ModalesContainer
        modalEstado={modalEstado}
        cerrarModal={cerrarModal}
        modalProgreso={modalProgreso}
        cerrarProgreso={cerrarProgreso}
      />
    </div>
  );
};

export default SelectorAreaGrado;
