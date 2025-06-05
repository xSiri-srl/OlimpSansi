import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../../../utils/api";
import { useVerificarInscripciones } from "../../Administrador/useVerificarInscripciones";
import axios from "axios";

const AsociarLimiteAreas = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargandoOlimpiadas, setCargandoOlimpiadas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [contador, setContador] = useState(1);
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
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s) y el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden modificar el límite de áreas.`;
      case 'inscripciones':
        return `Esta olimpiada tiene ${cantidadInscripciones} inscripción(es) registrada(s). No se pueden modificar el límite de áreas mientras existan inscripciones activas.`;
      case 'periodo':
        return `El período de inscripción para esta olimpiada terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}. No se pueden modificar el límite de áreas.`;
      default:
        return '';
    }
  };

  // Cargar lista de olimpiadas al montar el componente
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

  // Cargar nombre y número máximo de áreas cuando cambia la olimpiada seleccionada
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

      const cargarNumeroMaximo = async () => {
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
          
          const response = await axios.get(`${API_URL}/olimpiada/${olimpiadaSeleccionada}`, config);
          
          if (response.status === 200 && response.data) {
            const maxMaterias = response.data.max_materias;
            setContador(maxMaterias || 1);
          }
        } catch (error) {
          console.error("Error al cargar número máximo:", error);
          setContador(1);
        }
      };

      cargarNumeroMaximo();
    } else {
      setNombreOlimpiada("");
      setContador(1);
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
      setPeriodoTerminado(false);
      setRazonBloqueo(null);
      setFechaFin(null);
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  // Guardar configuración de número máximo de áreas
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
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar el límite de áreas, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      alert(mensaje);
      return;
    }

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
        max_materias: contador,
      };
      
      const response = await axios.post(
        `${API_URL}/olimpiada/max-materias`,
        datosAEnviar,
        config
      );

      if (response.status === 200) {
        setMensajeExito("¡Límite de áreas actualizado exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        throw new Error("Error al guardar el límite de áreas");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      let mensaje = "Error al guardar la configuración";
      
      if (error.response) {
        mensaje = error.response.data?.message || mensaje;
      }
      
      alert(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  // Incrementar el contador
  const incrementar = () => {
    if (contador < 7 && !olimpiadaBloqueada) {
      setContador(contador + 1);
    }
  };

  // Decrementar el contador
  const decrementar = () => {
    if (contador > 1 && !olimpiadaBloqueada) {
      setContador(contador - 1);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <HeaderSelector
        nombreOlimpiada={nombreOlimpiada}
        olimpiadas={olimpiadas}
        olimpiadaSeleccionada={olimpiadaSeleccionada}
        setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
        titulo="Asignación de límite de áreas por participante"
        subtitulo="Defina el límite de áreas por participante"
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
            Seleccione una olimpiada para asignar un límite de áreas por participante.
          </div>
        ) : cargandoOlimpiadas || verificando ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <p className="mt-2 text-gray-600">
              {cargandoOlimpiadas ? "Cargando olimpiadas..." : "Verificando inscripciones..."}
            </p>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-100 rounded-xl shadow-lg border border-blue-100 ${olimpiadaBloqueada ? 'opacity-50' : ''}`}>
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Número máximo de áreas por participante
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Configure cuántas áreas de competencia puede seleccionar cada participante
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8">
              {/* Botón para decrementar */}
              <button
                onClick={decrementar}
                disabled={contador === 1 || olimpiadaBloqueada}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
                  contador === 1 || olimpiadaBloqueada
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
                }`}
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Contador central */}
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-blue-600 mb-2 min-w-[80px] text-center">
                  {contador}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {contador === 1 ? "área" : "áreas"}
                </div>
              </div>

              {/* Botón para incrementar */}
              <button
                onClick={incrementar}
                disabled={contador === 7 || olimpiadaBloqueada}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
                  contador === 7 || olimpiadaBloqueada
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
                }`}
              >
                <FaChevronRight size={20} />
              </button>
            </div>

            {/* Indicadores de puntos */}
            <div className="flex space-x-2 mt-6">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    num === contador
                      ? "bg-blue-500 scale-125"
                      : num < contador
                      ? "bg-blue-300"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-gray-400 mt-4">
              Rango: 1 - 7 áreas
            </div>
          </div>
        )}

        <AccionesFooter
          guardarConfiguracion={guardarConfiguracion}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          guardando={guardando}
          mensajeExito={mensajeExito}
          textoBoton="Guardar Número de Áreas"
          bloqueado={olimpiadaBloqueada}
        />
      </div>
    </div>
  );
};

export default AsociarLimiteAreas;