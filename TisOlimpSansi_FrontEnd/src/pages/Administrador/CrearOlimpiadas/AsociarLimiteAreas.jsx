import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../../../utils/api";
import axios from "axios";
import { useVerificarInscripciones } from "../useVerificarInscripciones";

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

  const { verificarInscripciones, verificando } = useVerificarInscripciones();


  // Cargar lista de olimpiadas al montar el componente
  useEffect(() => {
    const cargarOlimpiadas = async () => {
      setCargandoOlimpiadas(true);
      setErrorCarga("");

      try {
        await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
          withCredentials: true,
        });

        const csrfToken = Cookies.get("XSRF-TOKEN");

        const config = {
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        };

        const response = await axios.get(`${API_URL}/getOlimpiadas`, config);

        if (response.status === 200) {
          const data = response.data.data || response.data;
          if (Array.isArray(data)) {
            setOlimpiadas(data);
          } else {
            throw new Error("Formato de datos inesperado");
          }
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } catch (error) {
        let mensajeError = "Error al conectar con el servidor.";

        if (error.response) {
          if (error.response.status === 401) {
            mensajeError =
              "No tienes autorización para acceder a esta información.";
          } else if (error.response.status === 403) {
            mensajeError =
              "No tienes permisos suficientes para ver las olimpiadas.";
          } else {
            mensajeError = `Error ${error.response.status}: ${
              error.response.data?.message || "Error del servidor"
            }`;
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

      const cargarNumeroMaximo = async () => {
        try {
          await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
          });

          const csrfToken = Cookies.get("XSRF-TOKEN");

          const config = {
            headers: {
              "X-XSRF-TOKEN": csrfToken,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          };

          const response = await axios.get(
            `${API_URL}/olimpiada/${olimpiadaSeleccionada}`,
            config
          );

          console.log("Respuesta de max_materias:", response.data); // Para depuración

          const maxMaterias = Number(response.data.max_materias);
          if (response.status === 200 && !isNaN(maxMaterias) && maxMaterias > 0) {
            setContador(maxMaterias);
          } else {
            setContador(1); // Valor por defecto si max_materias es 0, null, o undefined
          }
        } catch (error) {
          console.error("Error al cargar el número máximo de áreas:", error);
          setContador(1); // Valor por defecto en caso de error
          setErrorCarga(
            error.response?.data?.message || "Error al cargar el número máximo de áreas"
          );
        }
      };

      cargarNumeroMaximo();
    } else {
      setNombreOlimpiada("");
      setContador(1);
      setOlimpiadaBloqueada(false);
      setCantidadInscripciones(0);
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  // Guardar configuración de número máximo de áreas
  const guardarConfiguracion = async () => {
    if (!olimpiadaSeleccionada) {
      alert("Por favor seleccione una olimpiada");
      return;
    }

    if (olimpiadaBloqueada) {
      alert(`No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar el límite de áreas, primero debe eliminar todas las inscripciones asociadas.`);
      return;
    }

    setGuardando(true);
    setMensajeExito("");
    try {
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const csrfToken = Cookies.get("XSRF-TOKEN");

      const config = {
        headers: {
          "X-XSRF-TOKEN": csrfToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      };

      const datosAEnviar = {
        id: parseInt(olimpiadaSeleccionada),
        numMax: contador,
      };

      const response = await axios.post(
        `${API_URL}/olimpiada/max-materias`,
        datosAEnviar,
        config
      );

      if (response.status === 200 || response.status === 201) {
        setMensajeExito("¡Número máximo de áreas actualizado correctamente!");
        setTimeout(() => setMensajeExito(""), 5000);
      } else {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
    } catch (error) {
      let mensajeError = "Error al guardar la configuración.";

      if (error.response) {
        if (error.response.status === 401) {
          mensajeError = "No tienes autorización para realizar esta acción.";
        } else if (error.response.status === 403) {
          mensajeError = "No tienes permisos suficientes.";
        } else if (error.response.status === 422) {
          const errores = error.response.data?.errors;
          if (errores) {
            const mensajesError = Object.values(errores).flat();
            mensajeError = `Errores de validación:\n${mensajesError.join("\n")}`;
          } else {
            mensajeError = `Error de validación: ${
              error.response.data?.message || "Datos inválidos"
            }`;
          }
        } else {
          mensajeError = `Error ${error.response.status}: ${
            error.response.data?.message || "Error del servidor"
          }`;
        }
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor.";
      } else {
        mensajeError = error.message;
      }

      alert(mensajeError);
    } finally {
      setGuardando(false);
    }
  };

  // Incrementar el contador
  const incrementar = () => {
    if (contador < 7) {
      setContador(contador + 1);
    }
  };

  // Decrementar el contador
  const decrementar = () => {
    if (contador > 1) {
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
              Esta olimpiada tiene {cantidadInscripciones} inscripción(es) registrada(s). 
              No se pueden modificar el límite de áreas mientras existan inscripciones activas.
            </span>
          </div>
        )}

        {!olimpiadaSeleccionada ? (
          <div className="p-8 text-center text-gray-600">
            Seleccione una olimpiada para asignar un límite de áreas por participante.
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-100 rounded-xl shadow-lg border border-blue-100">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-600">
                Inscripciones por participante
              </h2>
            </div>

            <div className="flex items-center justify-center space-x-8">
              {/* Botón para decrementar */}
              <button
                onClick={decrementar}
                disabled={contador === 1}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
                  contador === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
                }`}
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Visualización del número actual */}
              <div className="flex items-center justify-center w-28 h-28 bg-white rounded-full shadow-lg border-4 border-blue-200">
                <span className="text-6xl font-bold text-blue-700">
                  {contador}
                </span>
              </div>

              {/* Botón para incrementar */}
              <button
                onClick={incrementar}
                disabled={contador === 7}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
                  contador === 7
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
                }`}
              >
                <FaChevronRight size={20} />
              </button>
            </div>

            <div className="mt-8 flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-2 rounded-full ${
                    num === contador ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
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