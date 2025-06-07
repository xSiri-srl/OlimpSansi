import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCosto from "./AreasCompetencia/AreaCosto";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { API_URL } from "../../../utils/api";
import { useVerificarInscripciones } from "../../Administrador/useVerificarInscripciones";
import ModalConfirmacion from "./Modales/ModalConfirmacion";
import ModalAlerta from "./Modales/ModalAlerta";
import { useNotificarProgreso } from "./hooks/useNotificarProgreso";
import ModalTareasPendientes from "./Modales/ModalTareasPendientes";

const AsociarCosto = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [areasAsociadas, setAreasAsociadas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoOlimpiadas, setCargandoOlimpiadas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const { modalProgreso, mostrarProgreso, cerrarProgreso } = useNotificarProgreso();

  const { verificarInscripciones, verificando } = useVerificarInscripciones();

  // Estados para modales
  const [modalEstado, setModalEstado] = useState({
    tipo: null, // 'confirmacion', 'alerta'
    titulo: "",
    mensaje: "",
    isOpen: false,
    onConfirm: null,
    datos: null
  });

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalEstado({
      tipo: null,
      titulo: "",
      mensaje: "",
      isOpen: false,
      onConfirm: null,
      datos: null
    });
  };

  // Función para mostrar alerta
  const mostrarAlerta = (titulo, mensaje, tipo = "error") => {
    setModalEstado({
      tipo: 'alerta',
      titulo,
      mensaje,
      isOpen: true,
      tipoAlerta: tipo,
      onConfirm: null,
      datos: null
    });
  };

  // Función para mostrar confirmación
  const mostrarConfirmacion = (titulo, mensaje, onConfirm, tipo = "warning") => {
    setModalEstado({
      tipo: 'confirmacion',
      titulo,
      mensaje,
      isOpen: true,
      tipoConfirmacion: tipo,
      onConfirm,
      datos: null
    });
  };

  // Función para obtener el mensaje de bloqueo apropiado
  const obtenerMensajeBloqueo = () => {
    switch(razonBloqueo) {
      case 'inscripciones_y_periodo':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden modificar los costos de inscripción.`;
      case 'inscripciones':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden modificar los costos de inscripción mientras existan inscripciones activas.`;
      case 'periodo':
        return `El período de inscripción para esta olimpiada terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden modificar los costos de inscripción.`;
      default:
        return '';
    }
  };

  // Cargar la lista de olimpiadas disponibles
  useEffect(() => {
    const cargarOlimpiadas = async () => {
      setCargandoOlimpiadas(true);
      setErrorCarga("");
      
      try {
        await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        
        const csrfToken = Cookies.get('XSRF-TOKEN');
        
        const config = {
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        };
        
        const response = await axios.get(`${API_URL}/getOlimpiadas`, config);
        
        if (response.status === 200) {
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            setOlimpiadas(response.data.data);
          } else if (response.data && Array.isArray(response.data)) {
            setOlimpiadas(response.data);
          } else {
            throw new Error("Formato de datos inesperado");
          }
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error al cargar olimpiadas:", error);
        
        let mensajeError = "Error al conectar con el servidor.";
        
        if (error.response) {
          if (error.response.status === 401) {
            mensajeError = "No tienes autorización para acceder a esta información.";
          } else if (error.response.status === 403) {
            mensajeError = "No tienes permisos suficientes para ver las olimpiadas.";
          } else {
            mensajeError = `Error ${error.response.status}: ${error.response.data?.message || "Error del servidor"}`;
          }
        } else if (error.message) {
          mensajeError = error.message;
        }
        
        setErrorCarga(mensajeError);
      } finally {
        setCargandoOlimpiadas(false);
      }
    };

    cargarOlimpiadas();
  }, []);

  // Actualizar nombre de olimpiada cuando se selecciona una
  useEffect(() => {
    if (olimpiadaSeleccionada) {
      const olimpiada = olimpiadas.find(
        (o) => o.id.toString() === olimpiadaSeleccionada
      );
      setNombreOlimpiada(olimpiada ? olimpiada.titulo : "");
      
      // Verificar si la olimpiada tiene inscripciones o período terminado
      verificarInscripciones(olimpiadaSeleccionada).then(resultado => {
        setOlimpiadaBloqueada(resultado.estaBloqueada);
        setCantidadInscripciones(resultado.cantidad);
        setPeriodoTerminado(resultado.periodoTerminado);
        setRazonBloqueo(resultado.razonBloqueo);
        setFechaFin(resultado.fechaFin);
      });
      
      // Cargar las áreas asociadas a esta olimpiada
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

  // Función para cargar las áreas ya asociadas a una olimpiada
  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargando(true);
    try {
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      const csrfToken = Cookies.get('XSRF-TOKEN');
      
      const config = {
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      };
      
      const response = await axios.get(`${API_URL}/areas-olimpiada/${idOlimpiada}`, config);
      
      console.log("Áreas asociadas:", response.data);
      
      if (response.status === 200 && response.data.data) {
        setAreasAsociadas(response.data.data.map(area => ({
          ...area,
          // Asegurar que costoInscripcion sea un string vacío o el valor existente
          costoInscripcion: area.costoInscripcion !== null && area.costoInscripcion !== undefined ? 
            area.costoInscripcion.toString() : 
            ""
        })));
      } else {
        throw new Error("Error al obtener áreas asociadas");
      }
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      mostrarAlerta("Error", "Error al cargar las áreas asociadas a la olimpiada", "error");
    } finally {
      setCargando(false);
    }
  };

  // Actualizar el costo de un área
  const actualizarCosto = (areaId, nuevoCosto) => {
    if (olimpiadaBloqueada) {
      let mensaje = "No se pueden realizar cambios en esta olimpiada.";
      
      switch(razonBloqueo) {
        case 'inscripciones_y_periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
        case 'inscripciones':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar los costos, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }
    
    setAreasAsociadas(prev => 
      prev.map(area => 
        area.id === areaId 
          ? { ...area, costoInscripcion: nuevoCosto } 
          : area
      )
    );
  };

  // Guardar todas las configuraciones de costo
  const guardarConfiguracion = async () => {
    if (!olimpiadaSeleccionada) {
      mostrarAlerta("Error", "Por favor seleccione una olimpiada", "warning");
      return;
    }

    // Verificar si la olimpiada tiene inscripciones o período terminado antes de proceder
    if (olimpiadaBloqueada) {
      let mensaje = "No se pueden realizar cambios en esta olimpiada.";
      
      switch(razonBloqueo) {
        case 'inscripciones_y_periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
        case 'inscripciones':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar los costos, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }

    // Mostrar confirmación antes de guardar
    const totalAreas = areasAsociadas.length;
    const areasConCosto = areasAsociadas.filter(area => area.costoInscripcion && parseFloat(area.costoInscripcion) > 0).length;
    
    mostrarConfirmacion(
      "Confirmar actualización de costos",
      `¿Está seguro que desea actualizar los costos de inscripción para la olimpiada "${nombreOlimpiada}"?\n\nSe actualizarán ${totalAreas} área(s) de competencia.\n${areasConCosto} área(s) tendrán costo de inscripción.`,
      () => {
        cerrarModal();
        ejecutarGuardado();
      },
      "info"
    );
  };

  const ejecutarGuardado = async () => {
    setGuardando(true);

    try {
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      const csrfToken = Cookies.get('XSRF-TOKEN');
      axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
      
      // Preparar datos para enviar - solo enviamos los datos de costo
      const datosAEnviar = {
        id_olimpiada: olimpiadaSeleccionada,
        areas: areasAsociadas.map(area => ({
          id: area.id,
          costoInscripcion: area.costoInscripcion || "0"
        }))
      };

      console.log("Guardando configuración de costos:", datosAEnviar);

      const response = await axios.post(
        `${API_URL}/actualizar-costos-olimpiada`,
        datosAEnviar,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMensajeExito("¡Costos asignados exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
        
        // Recargar áreas para mostrar datos actualizados
        cargarAreasAsociadas(olimpiadaSeleccionada);
        setTimeout(() => mostrarProgreso(olimpiadaSeleccionada, nombreOlimpiada), 1000);
      } else {
        throw new Error("Error al guardar los costos");
      }
    } catch (error) {
      console.error("Error al guardar costos:", error);
      let mensaje = "Error al guardar la configuración de costos";
      
      if (error.response) {
        if (error.response.status === 401) {
          mensaje = "No tienes autorización para realizar esta acción.";
        } else if (error.response.status === 403) {
          mensaje = "No tienes permisos suficientes para esta acción.";
        } else if (error.response.status === 419) {
          mensaje = "Error de validación CSRF. Por favor, recarga la página e intenta nuevamente.";
        } else if (error.response.status === 422) {
          const errores = error.response.data?.errors;
          if (errores) {
            const mensajesError = Object.values(errores).flat();
            mensaje = `Errores de validación:\n${mensajesError.join("\n")}`;
          } else {
            mensaje = `Error de validación: ${
              error.response.data?.message || "Datos inválidos"
            }`;
          }
        } else {
          mensaje = error.response.data?.message || mensaje;
        }
      }
      
      mostrarAlerta("Error al guardar", mensaje, "error");
    } finally {
      setGuardando(false);
    }
  };

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
        {/* Mostrar alerta si la olimpiada está bloqueada */}
        {olimpiadaBloqueada && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              <strong className="font-bold">Olimpiada bloqueada para modificaciones</strong>
            </div>
            <span className="block mt-1">
              {obtenerMensajeBloqueo()}
            </span>
          </div>
        )}

        {!olimpiadaSeleccionada ? (
          <div className="p-8 text-center text-gray-600">
            Seleccione una olimpiada para administrar los costos de sus áreas de competencia
          </div>
        ) : cargando || verificando ? (
          <div className="p-8 text-center text-gray-600">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            {cargando ? "Cargando áreas de competencia..." : "Verificando inscripciones..."}
          </div>
        ) : areasAsociadas.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No hay áreas de competencia asociadas a esta olimpiada. 
            Primero debe asignar áreas de competencia en la sección "Asignar Áreas".
          </div>
        ) : (
          <div className="space-y-6">
            {areasAsociadas.map((area) => (
              <AreaCosto
                key={area.id}
                area={area}
                actualizarCosto={(nuevoCosto) => actualizarCosto(area.id, nuevoCosto)}
                bloqueado={olimpiadaBloqueada} 
              />
            ))}
          </div>
        )}

        <AccionesFooter
          guardarConfiguracion={guardarConfiguracion}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          guardando={guardando}
          mensajeExito={mensajeExito}
          textoBoton="Guardar Costos"
          bloqueado={olimpiadaBloqueada} // Pasar estado de bloqueo
        />
      </div>

      {/* Modales */}
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

export default AsociarCosto;