import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCompetencia from "./AreasCompetencia/AreaCompetencia";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { gradosDisponibles } from "./AreasCompetencia/constants";
import { todasLasCategoriasPorArea } from "./todasLasCategoriasPorArea";
import { categoriasPredefinidasMap } from "./todasLasCategoriasPorArea";
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
  
    const obtenerOpcionesPorArea = (area) => {
      // BASE DE DATOS DETERMINADA
      const opciones = {
        Informática: [
          "3ro Primaria",
          "4to Primaria",
          "5to Primaria",
          "6to Primaria",
          "1ro Secundaria",
          "2do Secundaria",
          "3ro Secundaria",
          "4to Secundaria",
          "5to Secundaria",
          "6to Secundaria",
        ],
        Robótica: [
          "3ro Primaria",
          "4to Primaria",
          "5to Primaria",
          "6to Primaria",
          "1ro Secundaria",
          "2do Secundaria",
          "3ro Secundaria",
          "4to Secundaria",
          "5to Secundaria",
          "6to Secundaria",
        ],
      };
      return opciones[area] || [];
    };
    // BASE DE DATOS DETERMINADA
    const [combinaciones, setCombinaciones] = useState([
      {
        area: "Astronomía-Astrofísica",
        modoRango: false,
        niveles: [
          { nivel: "3P", grado: "3ro Primaria" },
          { nivel: "4P", grado: "4to Primaria" },
          { nivel: "5P", grado: "5to Primaria" },
          { nivel: "6P", grado: "6to Primaria" },
          { nivel: "1S", grado: "1ro Secundaria" },
          { nivel: "2S", grado: "2do Secundaria" },
          { nivel: "3S", grado: "3ro Secundaria" },
          { nivel: "4S", grado: "4to Secundaria" },
          { nivel: "5S", grado: "5to Secundaria" },
          { nivel: "6S", grado: "6to Secundaria" },
        ],
        categoriasRango: [],
        checkboxesNivel: Array(10).fill(true),
        habilitado: false,
      },
      {
        area: "Biología",
        modoRango: false,
        niveles: [
          { nivel: "2S", grado: "2do Secundaria" },
          { nivel: "3S", grado: "3ro Secundaria" },
          { nivel: "4S", grado: "4to Secundaria" },
          { nivel: "5S", grado: "5to Secundaria" },
          { nivel: "6S", grado: "6to Secundaria" },
        ],
        categoriasRango: [],
        checkboxesNivel: Array(5).fill(true),
        habilitado: false,
      },
      {
        area: "Física",
        modoRango: false,
        niveles: [
          { nivel: "4S", grado: "4to Secundaria" },
          { nivel: "5S", grado: "5to Secundaria" },
          { nivel: "6S", grado: "6to Secundaria" },
        ],
        categoriasRango: [],
        checkboxesNivel: Array(3).fill(true),
        habilitado: false,
      },
      {
        area: "Informática",
        modoRango: false,
        niveles: [
          { nivel: "Guacamayo", grado: "Guacamayo" },
          { nivel: "Guanaco", grado: "Guanaco" },
          { nivel: "Londra", grado: "Londra" },
          { nivel: "Jucumari", grado: "Jucumari" },
          { nivel: "Bufeo", grado: "Bufeo" },
          { nivel: "Puma", grado: "Puma" },
        ],
        rangos: [
          { nivel: "Guacamayo", desde: "5to Primaria", hasta: "6to Primaria" },
          { nivel: "Guanaco", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
          { nivel: "Londra", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
          { nivel: "Jucumari", desde: "4to Secundaria", hasta: "6to Secundaria" },
          { nivel: "Bufeo", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
          { nivel: "Puma", desde: "4to Secundaria", hasta: "6to Secundaria" },
        ],
  
        categoriasRango: [],
        habilitado: false,
      },
      {
        area: "Matemáticas",
        modoRango: false,
        niveles: [
          { nivel: "Primer Nivel", grado: "1ro Secundaria" },
          { nivel: "Segundo Nivel", grado: "2do Secundaria" },
          { nivel: "Tercer Nivel", grado: "3ro Secundaria" },
          { nivel: "Cuarto Nivel", grado: "4to Secundaria" },
          { nivel: "Quinto Nivel", grado: "5to Secundaria" },
          { nivel: "Sexto Nivel", grado: "6to Secundaria" },
        ],
        categoriasRango: [],
        checkboxesNivel: Array(7).fill(true),
        habilitado: false,
      },
      {
        area: "Química",
        modoRango: false,
        niveles: [
          { nivel: "2S", grado: "2do Secundaria" },
          { nivel: "3S", grado: "3ro Secundaria" },
          { nivel: "4S", grado: "4to Secundaria" },
          { nivel: "5S", grado: "5to Secundaria" },
          { nivel: "6S", grado: "6to Secundaria" },
        ],
        categoriasRango: [],
        checkboxesNivel: Array(5).fill(true),
        habilitado: false,
      },
      {
        area: "Robótica",
        modoRango: false,
        niveles: [
          { nivel: "Builders P", grado: "Builders Primaria" },
          { nivel: "Builders S", grado: "Builders Secundaria" },
          { nivel: "Lego P", grado: "Lego Primaria" },
          { nivel: "Lego S", grado: "Lego Secundaria" },
        ],
        rangos: [
          { nivel: "BuildersP", desde: "5to Primaria", hasta: "6to Primaria" },
          {
            nivel: "BuildersS",
            desde: "1ro Secundaria",
            hasta: "6to Secundaria",
          },
          { nivel: "LegoP", desde: "5to Primaria", hasta: "6to Primaria" },
          { nivel: "LegoS", desde: "1ro Secundaria", hasta: "6to Secundaria" },
        ],
        categoriasRango: [],
        habilitado: false,
      },
    ]);
  
    useEffect(() => {
      const cargarOlimpiadas = async () => {
        setCargandoOlimpiadas(true);
        setErrorCarga("");
        
        try {
          // Obtener CSRF token para autenticación
          await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
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
          const response = await axios.get('http://localhost:8000/getOlimpiadas', config);
          
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
        
        // Cargar áreas ya asociadas a esta olimpiada
        cargarAreasAsociadas(olimpiadaSeleccionada);
      } else {
        setNombreOlimpiada("");
        
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
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
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
    
    const response = await axios.get(`http://localhost:8000/areas-olimpiada/${idOlimpiada}`, config);
    
    console.log("Áreas asociadas (respuesta del backend):", response.data);
    
    if (response.status === 200 && response.data.data) {
      const areasAsociadas = response.data.data;
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
            
            // Convertir las categorías del backend al formato que espera el frontend
            const categorias = [];
            
            if (areaAsociada.categorias && Array.isArray(areaAsociada.categorias)) {
              areaAsociada.categorias.forEach(cat => {
                const infoCategoria = categoriasPredefinidasMap[cat.nombre] || {
                  nombre: cat.nombre,
                  desde: determinarDesde(cat.nombre),
                  hasta: determinarHasta(cat.nombre)
                };
                
                categorias.push({
                  nombre: cat.nombre,
                  desde: infoCategoria.desde,
                  hasta: infoCategoria.hasta,
                  id: cat.id
                });
              });
            }
            
            return {
              ...combo,
              habilitado: true,
              yaAsociada: true,
              categorias: categorias
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
const determinarDesde = (categoriaNombre) => {
  const mapeo = {
    // Primaria
    "1P": "1ro Primaria",
    "2P": "2do Primaria",
    "3P": "3ro Primaria",
    "4P": "4to Primaria",
    "5P": "5to Primaria",
    "6P": "6to Primaria",
    // Secundaria
    "1S": "1ro Secundaria",
    "2S": "2do Secundaria",
    "3S": "3ro Secundaria",
    "4S": "4to Secundaria",
    "5S": "5to Secundaria",
    "6S": "6to Secundaria",
    // Niveles de Matemáticas
    "PRIMER NIVEL": "1ro Secundaria",
    "SEGUNDO NIVEL": "2do Secundaria",
    "TERCER NIVEL": "3ro Secundaria",
    "CUARTO NIVEL": "4to Secundaria",
    "QUINTO NIVEL": "5to Secundaria",
    "SEXTO NIVEL": "6to Secundaria",
    // Informática
    "GUACAMAYO": "5to Primaria",
    "GUANACO": "1ro Secundaria",
    "LONDRA": "1ro Secundaria",
    "JUCUMARI": "4to Secundaria",
    "BUFEO": "1ro Secundaria",
    "PUMA": "4to Secundaria",
    // Robótica
    "BUILDERS P": "5to Primaria",
    "BUILDERS S": "1ro Secundaria",
    "LEGO P": "5to Primaria",
    "LEGO S": "1ro Secundaria",
  };
  
  return mapeo[categoriaNombre] || "N/A";
};

const determinarHasta = (categoriaNombre) => {
  const mapeo = {
    // Primaria (grados únicos)
    "1P": "1ro Primaria",
    "2P": "2do Primaria",
    "3P": "3ro Primaria",
    "4P": "4to Primaria",
    "5P": "5to Primaria",
    "6P": "6to Primaria",
    // Secundaria (grados únicos)
    "1S": "1ro Secundaria",
    "2S": "2do Secundaria",
    "3S": "3ro Secundaria",
    "4S": "4to Secundaria",
    "5S": "5to Secundaria",
    "6S": "6to Secundaria",
    // Niveles de Matemáticas (grados únicos)
    "PRIMER NIVEL": "1ro Secundaria",
    "SEGUNDO NIVEL": "2do Secundaria",
    "TERCER NIVEL": "3ro Secundaria",
    "CUARTO NIVEL": "4to Secundaria",
    "QUINTO NIVEL": "5to Secundaria",
    "SEXTO NIVEL": "6to Secundaria",
    // Informática (rangos)
    "GUACAMAYO": "6to Primaria",
    "GUANACO": "3ro Secundaria",
    "LONDRA": "3ro Secundaria",
    "JUCUMARI": "6to Secundaria",
    "BUFEO": "3ro Secundaria",
    "PUMA": "6to Secundaria",
    // Robótica (rangos)
    "BUILDERS P": "6to Primaria",
    "BUILDERS S": "6to Secundaria",
    "LEGO P": "6to Primaria",
    "LEGO S": "6to Secundaria",
  };
  
  return mapeo[categoriaNombre] || "N/A";
};
  
    const eliminarCombinacion = (index) => {
      if (combinaciones.length > 1) {
        const nuevaLista = combinaciones.filter((_, i) => i !== index);
        setCombinaciones(nuevaLista);
      } else {
        alert("Debe mantener al menos una combinación de área");
      }
    };
  
      const guardarConfiguracion = async () => {
        if (!olimpiadaSeleccionada) {
          alert("Por favor seleccione una olimpiada");
          return;
        }
  
      // Validar que haya al menos un área habilitada
      const areasHabilitadas = combinaciones.filter(combo => combo.habilitado);
      if (areasHabilitadas.length === 0) {
        alert("Debe habilitar al menos un área de competencia");
        return;
      }

      const areasParaDesasociar = combinaciones.filter(combo => 
        combo.yaAsociada && !combo.habilitado
      );
      
      if (areasParaDesasociar.length === 0) {
        alert("Debe seleccionar al menos un área para desasociar");
        return;
      }

      // Confirmar la acción con el usuario
      if (!confirm(`¿Está seguro que desea desasociar ${areasParaDesasociar.length} área(s) de esta olimpiada? Esta acción podría afectar a los participantes ya inscritos.`)) {
        return;
      }

      setGuardando(true);

  
      try {
        // Obtener CSRF token para autenticación
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
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
            .filter(combo => combo.yaAsociada && !combo.habilitado)
            .map((combo) => ({
              area: combo.area,
              habilitado: false
            }))
        };
        console.log("Desasociando áreas:", datosAEnviar);
  
  
        // Enviar la solicitud al servidor
        const response = await axios.post(
          'http://localhost:8000/desasociar-areas-olimpiada', 
          datosAEnviar,
          config
        );
  
    if (response.status === 200) {
      setMensajeExito("¡Áreas desasociadas exitosamente!");
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
       Desasignar Area/nivel
      </h2>
    <HeaderSelector
      nombreOlimpiada={nombreOlimpiada}
      olimpiadas={olimpiadas}
      olimpiadaDesasociada={olimpiadaDesasociada}
      setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
      cargando={cargandoOlimpiadas}
      error={errorCarga}
    />

    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      {cargandoOlimpiadas || cargandoAreas ? (
        <div className="text-center py-8">
          <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          <p className="mt-2 text-gray-600">
            {cargandoOlimpiadas ? "Cargando olimpiadas..." : "Cargando áreas asociadas..."}
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
              obtenerOpcionesPorArea={obtenerOpcionesPorArea}
              setCombinaciones={setCombinaciones}
              eliminarCombinacion={eliminarCombinacion}
              olimpiadaSeleccionada={olimpiadaSeleccionada}
              modoAsociacion={false} 
            />
          ))}

          <AccionesFooter
            guardarConfiguracion={guardarConfiguracion}
            olimpiadaSeleccionada={olimpiadaSeleccionada}
            guardando={guardando}
            mensajeExito={mensajeExito}
            textoBoton="Desasociar Áreas Seleccionadas"
          />
        </>
      )}
    </div>
  </div>
);
};

export default DesasignarAreaNivel;