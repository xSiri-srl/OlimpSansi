import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCompetencia from "./AreasCompetencia/AreaCompetencia";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { gradosDisponibles } from "./AreasCompetencia/constants";
import { API_URL } from "../../../utils/api";
import axios from "axios";
import { useVerificarInscripciones } from "../../Administrador/useVerificarInscripciones";

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

  // BASE DE DATOS DETERMINADA
  const [combinaciones, setCombinaciones] = useState([
    {
      area: "Astronomía-Astrofísica",
      habilitado: false,
      categorias: []
    },
    {
      area: "Biología",
      habilitado: false,
      categorias: []
    },
    {
      area: "Física",
      habilitado: false,
      categorias: []
    },
    {
      area: "Informática",
      habilitado: false,
      categorias: []
    },
    {
      area: "Matemáticas",
      habilitado: false,
      categorias: []
    },
    {
      area: "Química",
      habilitado: false,
      categorias: []
    },
    {
      area: "Robótica",
      habilitado: false,
      categorias: []
    },
  ]);

  // Cargar los grados desde el backend
  useEffect(() => {
    const cargarGrados = async () => {
      try {
        const response = await axios.get(`${API_URL}/grados`, {
          withCredentials: true
        });
        
        if (response.status === 200 && response.data.data) {
          setTodosLosGrados(response.data.data);
          console.log("Grados cargados:", response.data.data);
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
        // Obtener CSRF token para autenticación
        await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        
        const csrfToken = Cookies.get('XSRF-TOKEN');
        
        // Configurar headers para la solicitud
        const config = {
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        };
        
        // Usar la ruta correcta según web.php (protegida por middleware)
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
      
      // Verificar si la olimpiada tiene inscripciones
      verificarInscripciones(olimpiadaSeleccionada).then(resultado => {
        setOlimpiadaBloqueada(resultado.tieneInscripciones);
        setCantidadInscripciones(resultado.cantidad);
      });
      
      // Cargar áreas ya asociadas a esta olimpiada
      cargarAreasAsociadas(olimpiadaSeleccionada);
    } else {
      setNombreOlimpiada("");
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      
      // Restablecer todas las áreas a no habilitadas cuando no hay olimpiada seleccionada
      setCombinaciones(prev => 
        prev.map(combo => ({...combo, habilitado: false}))
      );
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargandoAreas(true);
    
    try {
      // Obtener CSRF token para autenticación
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      const csrfToken = Cookies.get('XSRF-TOKEN');
      
      // Configurar headers para la solicitud
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
        const areasAsociadas = response.data.data;
        
        // Función auxiliar para normalizar nombres
        const normalizarNombre = (nombre) => {
          if (!nombre) return '';
          return nombre.toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[^A-Z0-9\s\-]/g, ""); 
        };
        
        // Crear un mapa de áreas asociadas normalizadas para búsqueda eficiente
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
              console.log(`✅ COINCIDENCIA ENCONTRADA para "${combo.area}"`);
              
              // Usar las categorías del backend
              return {
                ...combo,
                habilitado: true,
                yaAsociada: true,
                categorias: areaAsociada.categorias || []
              };
            } else {
              console.log(`❌ NO HAY COINCIDENCIA para "${combo.area}"`);
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
      alert("Por favor seleccione una olimpiada");
      return;
    }

        if (olimpiadaBloqueada) {
      alert(`No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar las áreas de competencia, primero debe eliminar todas las inscripciones asociadas.`);
      return;
    }

    // Validar que haya al menos un área habilitada
    const areasHabilitadas = combinaciones.filter(combo => combo.habilitado);
    if (areasHabilitadas.length === 0) {
      alert("Debe habilitar al menos un área de competencia");
      return;
    }
    
    // Validar que todas las áreas tengan categorías
    const areasSinCategorias = areasHabilitadas.filter(combo => 
      !combo.categorias || combo.categorias.length === 0
    );
    
    if (areasSinCategorias.length > 0) {
      const areasNombres = areasSinCategorias.map(a => a.area).join(", ");
      alert(`Las siguientes áreas no tienen categorías definidas: ${areasNombres}. Debe definir al menos una categoría por área.`);
      return;
    }

    // Verificar categorías duplicadas
    let tieneCategoriaDuplicada = false;
    let areaDuplicada = "";
    let categoriaDuplicada = "";
    
    areasHabilitadas.forEach(combo => {
      // Crear un conjunto para rastrear categorías únicas
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
      alert(`Error: El área "${areaDuplicada}" tiene la categoría "${categoriaDuplicada}" duplicada. No se pueden asociar dos categorías iguales a la misma área.`);
      return;
    }

    setGuardando(true);

    try {
      // Obtener CSRF token para autenticación
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      const csrfToken = Cookies.get('XSRF-TOKEN');
      
      // Configurar headers para la solicitud
      const config = {
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      };
      
      // Preparar datos para enviar
      const datosAEnviar = {
        id_olimpiada: olimpiadaSeleccionada,
        areas: combinaciones
          .filter(combo => combo.habilitado)
          .map((combo) => {
            // Transformar las categorías al formato esperado por el backend
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

      console.log("Guardando configuración:", datosAEnviar);

      // Enviar la solicitud al servidor
      const response = await axios.post(
        `${API_URL}/asociar-areas-olimpiada`,
        datosAEnviar,
        config
      );

      if (response.status === 200) {
        setMensajeExito("¡Áreas asociadas exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
        
        // Recargar las áreas para mostrar el estado actualizado
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
      
      alert(mensaje);
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
              Esta olimpiada tiene {cantidadInscripciones} inscripción(es) registrada(s). 
              No se pueden realizar cambios en las áreas de competencia mientras existan inscripciones activas.
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
                bloqueado={olimpiadaBloqueada} // Pasar estado de bloqueo
              />
            ))}

            <AccionesFooter
              guardarConfiguracion={guardarConfiguracion}
              olimpiadaSeleccionada={olimpiadaSeleccionada}
              guardando={guardando}
              mensajeExito={mensajeExito}
              bloqueado={olimpiadaBloqueada} // Pasar estado de bloqueo
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SelectorAreaGrado;