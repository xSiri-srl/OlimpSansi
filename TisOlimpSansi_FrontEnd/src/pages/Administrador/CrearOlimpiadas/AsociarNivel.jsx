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
      costoInscripcion: "",
      checkboxesNivel: Array(10).fill(true),
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
      costoInscripcion: "",
      checkboxesNivel: Array(5).fill(true),
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
      costoInscripcion: "",
      checkboxesNivel: Array(3).fill(true),
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
      costoInscripcion: "",
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
      costoInscripcion: "",
      checkboxesNivel: Array(7).fill(true),
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
      costoInscripcion: "",
      checkboxesNivel: Array(5).fill(true),
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
      costoInscripcion: "",
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
        
        // Usar la ruta correcta según web.php
        const response = await axios.get('http://localhost:8000/getOlimpiadas', config);
        
        console.log("Respuesta del servidor:", response);
        
        // Verificar la respuesta y extraer los datos correctamente
        if (response.status === 200) {
          // Verificar la estructura de los datos recibidos
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            setOlimpiadas(response.data.data);
          } else if (response.data && Array.isArray(response.data)) {
            // En caso de que la respuesta sea directamente un array
            setOlimpiadas(response.data);
          } else {
            throw new Error("Formato de datos inesperado");
          }
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error al cargar olimpiadas:", error);
        
        // Mensaje de error más descriptivo
        let mensajeError = "Error al conectar con el servidor.";
        
        if (error.response) {
          // El servidor respondió con un error
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
    } else {
      setNombreOlimpiada("");
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

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

    let datosCompletos = true;
    let mensaje = "";

    combinaciones.forEach((combo) => {
      if (!combo.area || (combo.area === "Otra" && !combo.areaPersonalizada)) {
        datosCompletos = false;
        mensaje = "Todas las áreas deben tener un nombre válido";
      }

      if (combo.modoRango) {
        let rangoValido = true;
        combo.categoriasRango.forEach((cat) => {
          if (!cat.rangoInicial || !cat.rangoFinal || !cat.nombre) {
            datosCompletos = false;
            mensaje =
              "Todos los campos de rango y categoría deben estar completos";
          }
          if (
            gradosDisponibles.indexOf(cat.rangoInicial) >
            gradosDisponibles.indexOf(cat.rangoFinal)
          ) {
            rangoValido = false;
          }
        });

        if (!rangoValido) {
          datosCompletos = false;
          mensaje =
            "El grado inicial no puede ser mayor que el grado final en alguna categoría";
        }
      } else {
        combo.niveles.forEach((nivel) => {
          if (!nivel.grado || !nivel.categoria) {
            datosCompletos = false;
            mensaje = "Todos los grados y categorías deben estar completos";
          }
        });
      }
    });

    if (!datosCompletos) {
      alert(mensaje || "Por favor complete todos los campos antes de guardar");
      return;
    }

    setGuardando(true);

    try {
      // Preparar CSRF token para Laravel
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
      const csrfToken = Cookies.get('XSRF-TOKEN');
      axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
      
      // Preparar datos para enviar
      const datosAEnviar = combinaciones.filter(combo => combo.habilitado).map((combo) => {
        const comboCopia = { ...combo };
        if (combo.area === "Otra" && combo.areaPersonalizada) {
          comboCopia.area = combo.areaPersonalizada;
          delete comboCopia.areaPersonalizada;
        }
        return comboCopia;
      });

      // Aquí iría el endpoint real para guardar las áreas asociadas
      // Por ejemplo:
      // const response = await axios.post(
      //   'http://localhost:8000/asociar-areas-olimpiada',
      //   {
      //     id_olimpiada: olimpiadaSeleccionada,
      //     areas: datosAEnviar
      //   },
      //   { withCredentials: true }
      // );

      // Simulación
      console.log("Guardando configuración:", {
        id_olimpiada: olimpiadaSeleccionada,
        areas: datosAEnviar,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMensajeExito("¡Configuración guardada exitosamente!");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
      const mensaje = error.response?.data?.message || "Error al guardar la configuración";
      alert(mensaje);
    } finally {
      setGuardando(false);
    }
  };

return (
    <div className="p-6 max-w-5xl mx-auto">
      <HeaderSelector
        nombreOlimpiada={nombreOlimpiada}
        olimpiadas={olimpiadas}
        olimpiadaSeleccionada={olimpiadaSeleccionada}
        setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
        cargando={cargandoOlimpiadas}
        error={errorCarga}
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        {cargandoOlimpiadas ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <p className="mt-2 text-gray-600">Cargando olimpiadas...</p>
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
