import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCompetencia from "./AreasCompetencia/AreaCompetencia";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { gradosDisponibles } from "./AreasCompetencia/constants";
import { API_URL } from "../../../utils/api";
import axios from "axios";
import { useVerificarInscripciones } from "../useVerificarInscripciones";

const DesasignarAreaNivel = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [olimpiadaDesasociada, setOlimpiadaDesasociada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargandoOlimpiadas, setCargandoOlimpiadas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [todosLosGrados, setTodosLosGrados] = useState([]);
  const [olimpiadaBloqueada, setOlimpiadaBloqueada] = useState(false);
  const [cantidadInscripciones, setCantidadInscripciones] = useState(0);
  const [periodoTerminado, setPeriodoTerminado] = useState(false);
  const [razonBloqueo, setRazonBloqueo] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const { verificarInscripciones, verificando } = useVerificarInscripciones();

  // Función para obtener el mensaje de bloqueo apropiado
  const obtenerMensajeBloqueo = () => {
    switch(razonBloqueo) {
      case 'inscripciones_y_periodo':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden desasociar áreas ni categorías.`;
      case 'inscripciones':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden desasociar áreas ni categorías mientras existan inscripciones activas.`;
      case 'periodo':
        return `El período de inscripción para esta olimpiada terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden desasociar áreas ni categorías.`;
      default:
        return '';
    }
  };

  // BASE DE DATOS DETERMINADA
  const [combinaciones, setCombinaciones] = useState([
    {
      area: "Astronomía-Astrofísica",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
    },
    {
      area: "Biología",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
    },
    {
      area: "Física",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
    },
    {
      area: "Informática",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
    },
    {
      area: "Matemáticas",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
    },
    {
      area: "Química",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
    },
    {
      area: "Robótica",
      habilitado: false,
      categorias: [],
      categoriasEliminadas: []
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
        
        console.log("Respuesta de olimpiadas:", response);
        
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
      
      // Verificar si la olimpiada tiene inscripciones o período terminado
      verificarInscripciones(olimpiadaSeleccionada).then(resultado => {
        setOlimpiadaBloqueada(resultado.estaBloqueada);
        setCantidadInscripciones(resultado.cantidad);
        setPeriodoTerminado(resultado.periodoTerminado);
        setRazonBloqueo(resultado.razonBloqueo);
        setFechaFin(resultado.fechaFin);
      });
      
      // Cargar áreas ya asociadas a esta olimpiada
      cargarAreasAsociadas(olimpiadaSeleccionada);
    } else {
      setNombreOlimpiada("");
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      setPeriodoTerminado(false);
      setRazonBloqueo(null);
      setFechaFin(null);

      // Restablecer todas las áreas a no habilitadas cuando no hay olimpiada seleccionada
      setCombinaciones(prev => 
        prev.map(combo => ({...combo, habilitado: false, yaAsociada: false, categorias: [], categoriasEliminadas: []}))
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
      
      console.log("Áreas asociadas (respuesta del backend):", response.data);
      
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
              console.log(`Categorías asociadas:`, areaAsociada.categorias);
              
              return {
                ...combo,
                habilitado: true, // Inicialmente, habilitar todas las áreas asociadas
                yaAsociada: true,
                // Limpiar cualquier marca de eliminación previa Y categoriasEliminadas
                categorias: (areaAsociada.categorias || []).map(cat => ({
                  ...cat,
                  marcadaParaEliminar: false
                })),
                categoriasEliminadas: [] // Limpiar lista de categorías eliminadas
              };
            } else {
              console.log(`❌ NO HAY COINCIDENCIA para "${combo.area}"`);
              return {
                ...combo,
                habilitado: false,
                yaAsociada: false,
                categorias: [],
                categoriasEliminadas: [] // Limpiar lista de categorías eliminadas
              };
            }
          });
          
          return nuevasCombinaciones;
        });
      }
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setCombinaciones(prev => 
        prev.map(combo => ({
          ...combo, 
          habilitado: false, 
          yaAsociada: false, 
          categorias: [],
          categoriasEliminadas: [] // Limpiar lista de categorías eliminadas
        }))
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

    // Verificar si la olimpiada tiene inscripciones o período terminado antes de proceder
    if (olimpiadaBloqueada) {
      let mensaje = "No se pueden realizar cambios en esta olimpiada.";
      
      switch(razonBloqueo) {
        case 'inscripciones_y_periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
        case 'inscripciones':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para desasociar áreas, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      alert(mensaje);
      return;
    }

    // Identificar áreas completas para desasociar (marcadas como ya asociadas pero no habilitadas)
    const areasParaDesasociar = combinaciones.filter(combo => 
      combo.yaAsociada && !combo.habilitado
    );
    
    // Identificar categorías individuales marcadas para eliminar usando categoriasEliminadas
    const categoriasParaEliminar = [];
    combinaciones.forEach(combo => {
      if (combo.yaAsociada && combo.habilitado && combo.categoriasEliminadas && combo.categoriasEliminadas.length > 0) {
        categoriasParaEliminar.push({
          combo: combo,
          categorias: combo.categoriasEliminadas
        });
      }
    });

    // Verificar si hay cambios para aplicar
    if (areasParaDesasociar.length === 0 && categoriasParaEliminar.length === 0) {
      alert("No hay cambios para guardar. Seleccione áreas para desasociar o marque categorías para eliminar.");
      return;
    }

    // Mostrar resumen de cambios
    let mensaje = "Se aplicarán los siguientes cambios:\n\n";
    
    if (areasParaDesasociar.length > 0) {
      mensaje += `• ${areasParaDesasociar.length} área(s) completa(s) se desasociarán:\n`;
      areasParaDesasociar.forEach(area => {
        mensaje += `  - ${area.area}\n`;
      });
      mensaje += "\n";
    }

    if (categoriasParaEliminar.length > 0) {
      mensaje += `• Categorías individuales que se desasociarán:\n`;
      categoriasParaEliminar.forEach(item => {
        mensaje += `  - ${item.combo.area}: `;
        mensaje += item.categorias.map(cat => cat.nombre).join(", ");
        mensaje += "\n";
      });
    }

    mensaje += "\n¿Está seguro que desea continuar? Esta acción es irreversible.";

    // Confirmar la acción con el usuario
    if (!confirm(mensaje)) {
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

      // Primero, desasociar áreas completas si las hay
      if (areasParaDesasociar.length > 0) {
        const datosAreasDesasociar = {
          id_olimpiada: olimpiadaSeleccionada,
          areas: areasParaDesasociar.map((combo) => ({
            area: combo.area,
            habilitado: false
          }))
        };
        
        console.log("Desasociando áreas completas:", datosAreasDesasociar);

        const responseAreas = await axios.post(
          `${API_URL}/desasociar-areas-olimpiada`, 
          datosAreasDesasociar,
          config
        );

        if (responseAreas.status !== 200) {
          throw new Error("Error al desasociar áreas completas");
        }
      }

      // Luego, desasociar categorías individuales si las hay
      if (categoriasParaEliminar.length > 0) {
        // Obtener todas las áreas para encontrar los IDs
        const responseAreas = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaSeleccionada}`, config);
        const areasAsociadas = responseAreas.data.data || [];

        for (const item of categoriasParaEliminar) {
          // Buscar el ID del área
          const nombreAreaNormalizado = item.combo.area.toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^A-Z0-9\s\-]/g, "");

          const areaEncontrada = areasAsociadas.find(area => {
            const nombreNormalizado = area.area.toUpperCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/[^A-Z0-9\s\-]/g, "");
            return nombreNormalizado === nombreAreaNormalizado;
          });

          if (!areaEncontrada) {
            throw new Error(`No se pudo encontrar el área "${item.combo.area}" en el servidor`);
          }

          // Preparar datos para enviar
          const datosCategorias = {
            id_olimpiada: olimpiadaSeleccionada,
            id_area: areaEncontrada.id,
            categorias_eliminar: item.categorias.map(cat => ({
              id: cat.id,
              nombre: cat.nombre
            }))
          };

          console.log("Desasociando categorías de", item.combo.area, ":", datosCategorias);

          const responseCategorias = await axios.post(
            `${API_URL}/desasociar-categorias-olimpiada`,
            datosCategorias,
            config
          );

          if (responseCategorias.status !== 200) {
            throw new Error(`Error al desasociar categorías del área "${item.combo.area}"`);
          }
        }
      }

      // Éxito - mostrar mensaje y recargar datos
      setMensajeExito("¡Cambios aplicados exitosamente!");
      setTimeout(() => setMensajeExito(""), 3000);
      
      // Recargar las áreas para mostrar el estado actualizado y limpiar categoriasEliminadas
      cargarAreasAsociadas(olimpiadaSeleccionada);

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

  const eliminarCategoriaIndividual = async (combo, categoria, index) => {
    if (!olimpiadaSeleccionada) {
      alert("Error: No hay olimpiada seleccionada");
      return;
    }

    // Verificar si la olimpiada tiene inscripciones o período terminado antes de proceder
    if (olimpiadaBloqueada) {
      let mensaje = "No se pueden desasociar categorías de esta olimpiada.";
      
      switch(razonBloqueo) {
        case 'inscripciones_y_periodo':
          mensaje = `No se pueden desasociar categorías de esta olimpiada porque tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
        case 'inscripciones':
          mensaje = `No se pueden desasociar categorías de esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para desasociar categorías, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden desasociar categorías de esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      alert(mensaje);
      return;
    }

    // Confirmar la eliminación
    if (!confirm(`¿Está seguro que desea marcar para desasociar la categoría "${categoria.nombre}" del área "${combo.area}"? Los cambios se aplicarán al presionar "Guardar Configuración".`)) {
      return;
    }

    // ELIMINAR la categoría del frontend inmediatamente (no solo marcarla)
    setCombinaciones(prev => 
      prev.map(combinacion => {
        if (combinacion.area === combo.area) {
          return {
            ...combinacion,
            // Filtrar la categoría eliminada y guardar una referencia para la persistencia
            categorias: combinacion.categorias.filter(cat => cat.id !== categoria.id),
            // Agregar las categorías eliminadas para el guardado posterior
            categoriasEliminadas: [
              ...(combinacion.categoriasEliminadas || []),
              categoria
            ]
          };
        }
        return combinacion;
      })
    );

    // Mostrar mensaje temporal
    setMensajeExito("Categoría eliminada del frontend. Presione 'Guardar Configuración' para aplicar los cambios permanentemente.");
    setTimeout(() => setMensajeExito(""), 3000);
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
              textoBoton="Desasociar Áreas Seleccionadas"
              bloqueado={olimpiadaBloqueada}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DesasignarAreaNivel;