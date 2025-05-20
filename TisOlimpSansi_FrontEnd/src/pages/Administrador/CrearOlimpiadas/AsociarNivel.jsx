import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCompetencia from "./AreasCompetencia/AreaCompetencia";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { gradosDisponibles } from "./AreasCompetencia/constants";

const SelectorAreaGrado = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
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
    
    console.log("Áreas asociadas (raw):", response.data);
    
    if (response.status === 200 && response.data.data) {
      const areasAsociadas = response.data.data;
      

      const normalizarNombre = (nombre) => {
        return nombre.toUpperCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
          .replace(/[^A-Z0-9]/g, ""); 
      };
    
      const areasNormalizadasMap = new Map();
      
      areasAsociadas.forEach(area => {
        const nombreNormalizado = normalizarNombre(area.area);
        console.log(`Área del backend normalizada: "${area.area}" -> "${nombreNormalizado}"`);
        areasNormalizadasMap.set(nombreNormalizado, area);
      });

      setCombinaciones(prev => {
        const nuevasCombinaciones = prev.map(combo => {
          // Normalizar el nombre del área del frontend
                    const nombreNormalizado = normalizarNombre(combo.area);
          console.log(`Área del frontend normalizada: "${combo.area}" -> "${nombreNormalizado}"`);
      
          const areaAsociada = areasNormalizadasMap.get(nombreNormalizado);
          
          if (areaAsociada) {
            console.log(`COINCIDENCIA ENCONTRADA para "${combo.area}"`);
            
            // Obtener las categorías del área asociada desde el backend
            const categoriasBackend = []; // Aquí deberías obtener las categorías del backend
            
            return {
              ...combo,
              habilitado: true,
              yaAsociada: true,
              // Convertir categorías del backend al nuevo formato
              categorias: categoriasBackend.map(cat => ({
                nombre: cat.nivel,
                desde: cat.desde || cat.grado,
                hasta: cat.hasta || cat.grado
              }))
            };
          } else {
            console.log(`NO HAY COINCIDENCIA para "${combo.area}"`);
            return {
              ...combo,
              habilitado: false,
              yaAsociada: false,
              // Mantener las categorías vacías para áreas no asociadas
              categorias: []
            };
          }
        });
        
        return nuevasCombinaciones;
      });
    }
  } catch (error) {
    console.error("Error al cargar áreas asociadas:", error);
    // Si hay error, mostrar todas las áreas como no habilitadas
    setCombinaciones(prev => 
      prev.map(combo => ({...combo, habilitado: false, costoInscripcion: "16"}))
    );
  } finally {
    setCargandoAreas(false);
  }
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
  const areasSinCategorias = areasHabilitadas.filter(combo => 
    !combo.categorias || combo.categorias.length === 0
  );
  
  if (areasSinCategorias.length > 0) {
    const areasNombres = areasSinCategorias.map(a => a.area).join(", ");
    alert(`Las siguientes áreas no tienen categorías definidas: ${areasNombres}. Debe definir al menos una categoría por área.`);
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
        'http://localhost:8000/asociar-areas-olimpiada',
        datosAEnviar,
        config
      );

      console.log("Respuesta del servidor:", response.data);

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
          modoAsociacion={true}
        />
      ))}

            <AccionesFooter
              guardarConfiguracion={guardarConfiguracion}
              olimpiadaSeleccionada={olimpiadaSeleccionada}
              guardando={guardando}
              mensajeExito={mensajeExito}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SelectorAreaGrado;