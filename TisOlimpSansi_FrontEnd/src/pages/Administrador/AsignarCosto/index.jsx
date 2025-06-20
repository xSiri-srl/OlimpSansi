import { useState, useEffect } from "react";
import HeaderSelector from "../components/HeaderSelector";
import AreaCosto from "../CrearOlimpiadas/AreasCompetencia/AreaCosto";
import AccionesFooter from "../components/AccionesFooter";
import { useVerificarInscripciones } from "../hooks/useVerificarInscripciones";
import ModalConfirmacion from "../../../components/Modales/ModalConfirmacion";
import ModalAlerta from "../../../components/Modales/ModalAlerta";
import { useNotificarProgreso } from "../hooks/useNotificarProgreso";
import ModalTareasPendientes from "../../../components/Modales/ModalTareasPendientes";
 
import { useOlimpiadas } from "./hooks/useOlimpiadas";
import { useAreasAsociadas } from "./hooks/useAreasAsociadas";
import { useModalEstado } from "./hooks/useModalEstado";
import { useGuardarCostos } from "./hooks/useGuardarCostos";

import { AlertaBloqueada } from "./components/AlertaBloqueada";
import { ContenidoPrincipal } from "./components/ContenidoPrincipal";

const AsignarCosto = () => {
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const { modalProgreso, mostrarProgreso, cerrarProgreso } = useNotificarProgreso();
  const { verificarInscripciones, verificando } = useVerificarInscripciones();
  const { modalEstado, cerrarModal, mostrarAlerta, mostrarConfirmacion } = useModalEstado();
  
  const { 
    olimpiadas, 
    cargandoOlimpiadas, 
    errorCarga 
  } = useOlimpiadas();
  
  const { 
    areasAsociadas, 
    setAreasAsociadas,
    cargando, 
    cargarAreasAsociadas,
    actualizarCosto 
  } = useAreasAsociadas({ 
    olimpiadaBloqueada, 
    cantidadInscripciones, 
    razonBloqueo, 
    fechaFin, 
    mostrarAlerta 
  });
  
  const { 
    guardarConfiguracion, 
    guardando, 
    mensajeExito 
  } = useGuardarCostos({
    olimpiadaSeleccionada,
    nombreOlimpiada,
    olimpiadaBloqueada,
    cantidadInscripciones,
    razonBloqueo,
    fechaFin,
    areasAsociadas,
    mostrarAlerta,
    mostrarConfirmacion,
    cargarAreasAsociadas,
    mostrarProgreso
  });

  useEffect(() => {
    if (olimpiadaSeleccionada) {
      const olimpiada = olimpiadas.find(
        (o) => o.id.toString() === olimpiadaSeleccionada
      );
      setNombreOlimpiada(olimpiada ? olimpiada.titulo : "");
 
      verificarInscripciones(olimpiadaSeleccionada).then(resultado => {
        setOlimpiadaBloqueada(resultado.estaBloqueada);
        setCantidadInscripciones(resultado.cantidad);
        setPeriodoTerminado(resultado.periodoTerminado);
        setRazonBloqueo(resultado.razonBloqueo);
        setFechaFin(resultado.fechaFin);
      });

      cargarAreasAsociadas(olimpiadaSeleccionada);
    } else {
      setNombreOlimpiada("");
      setAreasAsociadas([]);
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      setPeriodoTerminado(false);
      setRazonBloqueo(null);
      setFechaFin(null);
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">  
        Costo de Inscripción
      </h2>
      
      <HeaderSelector
        nombreOlimpiada={nombreOlimpiada}
        olimpiadas={olimpiadas}
        olimpiadaSeleccionada={olimpiadaSeleccionada}
        setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
        titulo="Asignación de Costos"
        subtitulo="Defina los costos de inscripción para las áreas de competencia"
        cargando={cargandoOlimpiadas}
        error={errorCarga}
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <AlertaBloqueada 
          olimpiadaBloqueada={olimpiadaBloqueada}
          cantidadInscripciones={cantidadInscripciones}
          razonBloqueo={razonBloqueo}
          fechaFin={fechaFin}
        />

        <ContenidoPrincipal
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          cargando={cargando}
          verificando={verificando}
          areasAsociadas={areasAsociadas}
          actualizarCosto={actualizarCosto}
          olimpiadaBloqueada={olimpiadaBloqueada}
        />

        <AccionesFooter
          guardarConfiguracion={guardarConfiguracion}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          guardando={guardando}
          mensajeExito={mensajeExito}
          textoBoton="Guardar Costos"
          bloqueado={olimpiadaBloqueada || areasAsociadas.length === 0} 
        />
      </div>

      {modalEstado.tipo === 'alerta' && (
        <ModalAlerta
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          type={modalEstado.tipoAlerta}
        />
      )}

      {modalEstado.tipo === 'confirmacion' && (
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

export default AsignarCosto;