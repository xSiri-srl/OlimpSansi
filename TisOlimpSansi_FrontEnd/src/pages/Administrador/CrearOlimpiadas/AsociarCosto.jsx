import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCosto from "./AreasCompetencia/AreaCosto";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import api from "../../../utils/api";

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

  // Cargar la lista de olimpiadas disponibles
  useEffect(() => {
    const cargarOlimpiadas = async () => {
      setCargandoOlimpiadas(true);
      setErrorCarga("");
      
      try {
        await api.get('/sanctum/csrf-cookie', {
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
        
        const response = await api.get('/getOlimpiadas', config);
        
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
      
      // Cargar las áreas asociadas a esta olimpiada
      cargarAreasAsociadas(olimpiadaSeleccionada);
    } else {
      setNombreOlimpiada("");
      setAreasAsociadas([]);
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  // Función para cargar las áreas ya asociadas a una olimpiada
  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargando(true);
    try {
      await api.get('/sanctum/csrf-cookie', {
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
      
      const response = await api.get(`/areas-olimpiada/${idOlimpiada}`, config);
      
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
      alert("Error al cargar las áreas asociadas a la olimpiada");
    } finally {
      setCargando(false);
    }
  };

  // Actualizar el costo de un área
  const actualizarCosto = (areaId, nuevoCosto) => {
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
      alert("Por favor seleccione una olimpiada");
      return;
    }

    setGuardando(true);

    try {
      await api.get('/sanctum/csrf-cookie', {
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

      // Endpoint específico para actualizar solo los costos
      const response = await api.post(
        '/actualizar-costos-olimpiada',
        datosAEnviar,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMensajeExito("¡Costos asignados exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
        
        // Recargar áreas para mostrar datos actualizados
        cargarAreasAsociadas(olimpiadaSeleccionada);
      } else {
        throw new Error("Error al guardar los costos");
      }
    } catch (error) {
      console.error("Error al guardar costos:", error);
      let mensaje = "Error al guardar la configuración de costos";
      
      if (error.response) {
        mensaje = error.response.data?.message || mensaje;
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
        titulo="Asignación de Costos"
        subtitulo="Defina los costos de inscripción para las áreas de competencia"
        cargando={cargandoOlimpiadas}
        error={errorCarga}
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        {!olimpiadaSeleccionada ? (
          <div className="p-8 text-center text-gray-600">
            Seleccione una olimpiada para administrar los costos de sus áreas de competencia
          </div>
        ) : cargando ? (
          <div className="p-8 text-center text-gray-600">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            Cargando áreas de competencia...
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
        />
      </div>
    </div>
  );
};

export default AsociarCosto;