import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import HeaderSelector from "../CrearOlimpiadas/AreasCompetencia/HeaderSelector";
import AccionesFooter from "../CrearOlimpiadas/AreasCompetencia/AccionesFooter";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../../../utils/api";
import axios from "axios";
import ModalAlerta from "../../../components/Modales/ModalAlerta";
import ModalTareasPendientes from "../../../components/Modales/ModalTareasPendientes";
import ModalConfirmacion from "../../../components/Modales/ModalConfirmacion";
import { useNotificarProgreso } from "../CrearOlimpiadas/hooks/useNotificarProgreso";
import { useVerificarInscripciones } from "../useVerificarInscripciones";


const AsignarLimiteAreas = () => {
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
  const [cantidadAreasAsociadas, setCantidadAreasAsociadas] = useState(0);
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const { modalProgreso, mostrarProgreso, cerrarProgreso } = useNotificarProgreso();

  const { verificarInscripciones, verificando } = useVerificarInscripciones();

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

  const obtenerCantidadAreasAsociadas = async (olimpiadaId) => {
    try {
      setCargandoAreas(true);
      
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
      
      const response = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaId}`, config);
      
      if (response.status === 200 && response.data && response.data.data) {
        const areasUnicas = new Set();
        response.data.data.forEach(area => {
          areasUnicas.add(area.id);
        });
        setCantidadAreasAsociadas(areasUnicas.size);
      } else {
        setCantidadAreasAsociadas(0);
      }
    } catch (error) {
      console.error("Error al obtener áreas asociadas:", error);
      setCantidadAreasAsociadas(0);
    } finally {
      setCargandoAreas(false);
    }
  };

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

      obtenerCantidadAreasAsociadas(olimpiadaSeleccionada);

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
            const maxMaterias = Number(response.data.max_materias);
            if (maxMaterias !== null && maxMaterias !== undefined) {
              setContador(Number(maxMaterias));
            } else {
              setContador(1);
            }
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
      setCantidadAreasAsociadas(0);
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

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
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar el límite de áreas, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }

    if (cantidadAreasAsociadas === 0) {
      mostrarAlerta(
        "Sin áreas asociadas", 
        "Esta olimpiada no tiene áreas asociadas. Primero debe configurar las áreas de competencia antes de establecer el límite por participante.", 
        "warning"
      );
      return;
    }

    if (contador > cantidadAreasAsociadas) {
      mostrarAlerta(
        "Límite excedido", 
        `No puede establecer un límite de ${contador} ${contador === 1 ? 'área' : 'áreas'} cuando la olimpiada solo tiene ${cantidadAreasAsociadas} ${cantidadAreasAsociadas === 1 ? 'área asociada' : 'áreas asociadas'}. El límite máximo permitido es ${cantidadAreasAsociadas}.`, 
        "error"
      );
      return;
    }

    mostrarConfirmacion(
      "Confirmar cambio de límite",
      `¿Está seguro que desea establecer el límite de áreas por participante en ${contador} ${contador === 1 ? 'área' : 'áreas'} para la olimpiada "${nombreOlimpiada}"?`,
      () => {
        cerrarModal();
        ejecutarGuardado();
      },
      "info"
    );
  };

  const ejecutarGuardado = async () => {
    setGuardando(true);
    setMensajeExito("");

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
        id: parseInt(olimpiadaSeleccionada),
        numMax: contador,
      };
    
      const response = await axios.post(
        `${API_URL}/olimpiada/max-materias`,
        datosAEnviar,
        config
      );

      if (response.status === 200 || response.status === 201) {
        setMensajeExito("¡Límite de áreas actualizado exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
        setTimeout(() => mostrarProgreso(olimpiadaSeleccionada, nombreOlimpiada), 1000);
      } else {
        throw new Error("Error al guardar el límite de áreas");
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

  const incrementar = () => {
    if (contador < 7 && !olimpiadaBloqueada) {
      const nuevoContador = contador + 1;
      
      if (cantidadAreasAsociadas > 0 && nuevoContador > cantidadAreasAsociadas) {
        mostrarAlerta(
          "Límite máximo alcanzado", 
          `No puede establecer más de ${cantidadAreasAsociadas} ${cantidadAreasAsociadas === 1 ? 'área' : 'áreas'} porque es la cantidad total de áreas asociadas a esta olimpiada.`, 
          "warning"
        );
        return;
      }
      
      setContador(nuevoContador);
    }
  };

  const decrementar = () => {
    if (contador > 1 && !olimpiadaBloqueada) {
      setContador(contador - 1);
    }
  };

  const maximoPermitido = cantidadAreasAsociadas > 0 ? Math.min(7, cantidadAreasAsociadas) : 7;

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

        {/* Mostrar información sobre áreas asociadas */}
        {olimpiadaSeleccionada && cantidadAreasAsociadas > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span>
                Esta olimpiada tiene <strong>{cantidadAreasAsociadas}</strong> {cantidadAreasAsociadas === 1 ? 'área asociada' : 'áreas asociadas'}. 
                El límite máximo recomendado es <strong>{maximoPermitido}</strong>.
              </span>
            </div>
          </div>
        )}

        {olimpiadaSeleccionada && cantidadAreasAsociadas === 0 && !cargandoAreas && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span>
                Esta olimpiada no tiene áreas asociadas. Configure primero las áreas de competencia antes de establecer el límite por participante.
              </span>
            </div>
          </div>
        )}

        {!olimpiadaSeleccionada ? (
          <div className="p-8 text-center text-gray-600">
            Seleccione una olimpiada para asignar un límite de áreas por participante.
          </div>
        ) : cargandoOlimpiadas || verificando || cargandoAreas ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <p className="mt-2 text-gray-600">
              {cargandoOlimpiadas ? "Cargando olimpiadas..." : 
               verificando ? "Verificando inscripciones..." : 
               "Cargando áreas asociadas..."}
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
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-blue-600 mb-2 min-w-[80px] text-center">
                  {contador}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {contador === 1 ? "área" : "áreas"}
                </div>
              </div>
              <button
                onClick={incrementar}
                disabled={contador === maximoPermitido || olimpiadaBloqueada}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
                  contador === maximoPermitido || olimpiadaBloqueada
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
                }`}
              >
                <FaChevronRight size={20} />
              </button>
            </div>
            <div className="flex space-x-2 mt-6">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    num === contador
                      ? "bg-blue-500 scale-125"
                      : num < contador
                      ? "bg-blue-300"
                      : num <= maximoPermitido
                      ? "bg-gray-300"
                      : "bg-red-200"
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-gray-400 mt-4">
              Rango: 1 - {maximoPermitido} áreas
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

export default AsignarLimiteAreas;