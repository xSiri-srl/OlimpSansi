import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCompetencia from "./AreasCompetencia/AreaCompetencia";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { gradosDisponibles } from "./AreasCompetencia/constants";
import { API_URL } from "../../../utils/api";
import axios from "axios";
import { useVerificarInscripciones } from "../useVerificarInscripciones";
import ModalConfirmacion from "./Modales/ModalConfirmacion";
import ModalAlerta from "./Modales/ModalAlerta";
import ModalValidacion from "./Modales/ModalValidacion";
import { useNotificarProgreso } from "./hooks/useNotificarProgreso";
import ModalTareasPendientes from "./Modales/ModalTareasPendientes";

const SelectorAreaGrado = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargandoOlimpiadas, setCargandoOlimpiadas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [todosLosGrados, setTodosLosGrados] = useState([]);
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const { verificarInscripciones, verificando } = useVerificarInscripciones();
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const { modalProgreso, mostrarProgreso, cerrarProgreso } = useNotificarProgreso();

  const [modalEstado, setModalEstado] = useState({
    tipo: null,
    titulo: "",
    mensaje: "",
    isOpen: false,
    onConfirm: null,
    datos: null
  });

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

  const mostrarValidacion = (titulo, mensaje, validationType, areas = [], onConfirm = null) => {
    setModalEstado({
      tipo: 'validacion',
      titulo,
      mensaje,
      isOpen: true,
      validationType,
      areas,
      onConfirm,
      datos: null
    });
  };

  const obtenerMensajeBloqueo = () => {
    switch(razonBloqueo) {
      case 'inscripciones_y_periodo':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden realizar cambios en las áreas de competencia.`;
      case 'inscripciones':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden realizar cambios en las áreas de competencia mientras existan inscripciones activas.`;
      case 'periodo':
        return `El período de inscripción para esta olimpiada terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden realizar cambios en las áreas de competencia.`;
      default:
        return '';
    }
  };

const [combinaciones, setCombinaciones] = useState([
  {
    area: "ASTRONOMIA Y ASTROFISICA",
    habilitado: false,
    categorias: []
  },
  {
    area: "BIOLOGIA",
    habilitado: false,
    categorias: []
  },
  {
    area: "FISICA",
    habilitado: false,
    categorias: []
  },
  {
    area: "INFORMATICA",
    habilitado: false,
    categorias: []
  },
  {
    area: "MATEMATICAS",
    habilitado: false,
    categorias: []
  },
  {
    area: "QUIMICA",
    habilitado: false,
    categorias: []
  },
  {
    area: "ROBOTICA",
    habilitado: false,
    categorias: []
  },
]);


  useEffect(() => {
    const cargarGrados = async () => {
      try {
        const response = await axios.get(`${API_URL}/grados`, {
          withCredentials: true
        });
        
        if (response.status === 200 && response.data.data) {
          setTodosLosGrados(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar grados:", error);
      }
    };
    
    cargarGrados();
  }, []);

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
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      setPeriodoTerminado(false);
      setRazonBloqueo(null);
      
      setCombinaciones(prev => 
        prev.map(combo => ({...combo, habilitado: false}))
      );
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargandoAreas(true);
    
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
      
      if (response.status === 200 && response.data.data) {
        const areasAsociadas = response.data.data;

        const normalizarNombre = (nombre) => {
          if (!nombre) return '';
          return nombre.toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[^A-Z0-9\s\-]/g, ""); 
        };

        const areasNormalizadasMap = new Map();
        
        areasAsociadas.forEach(area => {
          const nombreNormalizado = normalizarNombre(area.area);
          areasNormalizadasMap.set(nombreNormalizado, area);
        });
        
        setCombinaciones(prev => {
          const nuevasCombinaciones = prev.map(combo => {
            const nombreNormalizado = normalizarNombre(combo.area);
            const areaAsociada = areasNormalizadasMap.get(nombreNormalizado);
            
            if (areaAsociada) {
   
              return {
                ...combo,
                habilitado: true,
                yaAsociada: true,
                categorias: areaAsociada.categorias || []
              };
            } else {
              return {
                ...combo,
                habilitado: false,
                yaAsociada: false,
                categorias: []
              };
            }
          });
          
          return nuevasCombinaciones;
        });
      }
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setCombinaciones(prev => 
        prev.map(combo => ({...combo, habilitado: false, yaAsociada: false, categorias: []}))
      );
    } finally {
      setCargandoAreas(false);
    }
  };

  const guardarConfiguracion = async () => {
    if (!olimpiadaSeleccionada) {
      mostrarAlerta("Error", "Por favor seleccione una olimpiada", "warning");
      return;
    }

    if (olimpiadaBloqueada) {
      let mensaje = "No se pueden realizar cambios en esta olimpiada.";
      
      switch(razonBloqueo) {
        case 'inscripciones_y_periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
        case 'inscripciones':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar las áreas de competencia, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }
    const areasHabilitadas = combinaciones.filter(combo => combo.habilitado);
    if (areasHabilitadas.length === 0) {
      mostrarAlerta("Áreas requeridas", "Debe habilitar al menos un área de competencia", "warning");
      return;
    }
    const areasSinCategorias = areasHabilitadas.filter(combo => 
      !combo.categorias || combo.categorias.length === 0
    );
    
    if (areasSinCategorias.length > 0) {
      const areasNombres = areasSinCategorias.map(a => a.area);
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
    
    areasHabilitadas.forEach(combo => {
      const categoriasVistas = new Set();
      
      combo.categorias.forEach(cat => {
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
      
      const config = {
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      };
      
      const datosAEnviar = {
        id_olimpiada: olimpiadaSeleccionada,
        areas: combinaciones
          .filter(combo => combo.habilitado)
          .map((combo) => {
            const categoriasFormateadas = combo.categorias.map(cat => ({
              nivel: cat.nombre,
              desde: cat.desde,
              hasta: cat.hasta
            }));
            
            return {
              area: combo.area,
              habilitado: true,
              rangos: categoriasFormateadas
            };
          })
      };
      const response = await axios.post(
        `${API_URL}/asociar-areas-olimpiada`,
        datosAEnviar,
        config
      );

      if (response.status === 200) {
        setMensajeExito("¡Áreas asociadas exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
        setTimeout(() => mostrarProgreso(olimpiadaSeleccionada, nombreOlimpiada), 1000);
        cargarAreasAsociadas(olimpiadaSeleccionada);
      } else {
        throw new Error("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      
      let mensaje = "Error al guardar la configuración";
      
      if (error.response) {
        if (error.response.status === 401) {
          mensaje = "No tienes autorización para realizar esta acción.";
        } else if (error.response.status === 403) {
          mensaje = "No tienes permisos suficientes para esta acción.";
        } else if (error.response.status === 419) {
          mensaje = "Error de validación CSRF. Por favor, recarga la página e intenta nuevamente.";
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

        {cargandoOlimpiadas || cargandoAreas || verificando ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <p className="mt-2 text-gray-600">
              {cargandoOlimpiadas ? "Cargando olimpiadas..." : 
               verificando ? "Verificando inscripciones..." :
               "Cargando áreas asociadas..."}
            </p>
          </div>
        ) : errorCarga ? (
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

      {modalEstado.tipo === 'validacion' && (
        <ModalValidacion
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          onConfirm={modalEstado.onConfirm}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          validationType={modalEstado.validationType}
          areas={modalEstado.areas}
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

export default SelectorAreaGrado;