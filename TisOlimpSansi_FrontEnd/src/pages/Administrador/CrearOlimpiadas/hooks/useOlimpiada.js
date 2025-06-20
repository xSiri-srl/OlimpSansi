import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../../../utils/api";
import obtenerUsuario from "../../../../funciones/obtenerUser";

const useOlimpiada = () => {
  const [titulo, setTitulo] = useState("");
  const [fechaIniDate, setFechaIniDate] = useState(null);
  const [fechaFinalDate, setFechaFinalDate] = useState(null);
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [periodoIns, setPeriodoIns] = useState("");
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [olimpiadaCreada, setOlimpiadaCreada] = useState(null);
  const [idUser, setIdUser] = useState(null);

  const years = Array.from({ length: 2030 - 2025 + 1 }, (_, i) => 2025 + i);

  useEffect(() => {
    (async () => {
      const usuario = await obtenerUsuario();
      if (usuario) {
        setIdUser(usuario.id);
      }
    })();
  }, []);

  const validarCampos = () => {
    const hoy = new Date();
    const hoyString = hoy.toISOString().split("T")[0];
    const nuevosErrores = {};

    if (!titulo.trim()) nuevosErrores.titulo = "El título no puede estar vacío";
    if (!periodoIns)
      nuevosErrores.periodoIns = "Debe seleccionar un año de gestión";
    if (!fechaIni) nuevosErrores.fechaIni = "Debe ingresar la fecha de inicio";
    else if (fechaIni < hoyString)
      nuevosErrores.fechaIni = "La fecha de inicio no puede ser anterior a hoy";

    if (!fechaFinal) nuevosErrores.fechaFinal = "Debe ingresar la fecha final";
    else if (fechaIni && fechaFinal <= fechaIni)
      nuevosErrores.fechaFinal =
        "La fecha final debe ser posterior a la fecha de inicio";

    if (periodoIns && fechaIni) {
      const gestionNum = parseInt(periodoIns, 10);
      const yIni = new Date(fechaIni).getFullYear();
      if (gestionNum !== yIni) {
        nuevosErrores.periodoIns =
          "La gestión debe coincidir con el año de inicio de inscripciones";
      }
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const crearOlimpiada = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const csrfToken = Cookies.get("XSRF-TOKEN");
      axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;

      const olimpiadaData = {
        id_user: idUser,
        titulo,
        fecha_ini: fechaIni,
        fecha_fin: fechaFinal,
      };

      const response = await axios.post(
        `${API_URL}/agregar-olimpiada`,
        olimpiadaData,
        { withCredentials: true }
      );

      const olimpiadaId = response.data.id || response.data.data?.id;
      setOlimpiadaCreada(olimpiadaId);
      resetForm();

      return { success: true, olimpiadaId };
    } catch (error) {
      console.error("Error al crear olimpiada:", error);
      let message = "Error inesperado al crear la olimpiada.";

      if (error.response?.status === 422) {
        message =
          error.response.data.message || "Error de validación en el servidor.";
      } else if (error.response?.status === 401) {
        message = "No tienes permisos para realizar esta acción.";
      } else if (error.response?.status === 500) {
        message = "Error interno del servidor. Por favor, intenta más tarde.";
      } else if (!error.response) {
        message = "Error de conexión. Verifica tu conexión a internet.";
      }

      setErrorMessage(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitulo("");
    setPeriodoIns("");
    setFechaIni("");
    setFechaFinal("");
    setFechaIniDate(null);
    setFechaFinalDate(null);
    setErrores({});
    setErrorMessage("");
  };

  return {
    titulo,
    fechaIniDate,
    fechaFinalDate,
    fechaIni,
    fechaFinal,
    periodoIns,
    loading,
    errores,
    errorMessage,
    olimpiadaCreada,
    years,
    setTitulo,
    setFechaIniDate,
    setFechaFinalDate,
    setFechaIni,
    setFechaFinal,
    setPeriodoIns,
    setErrorMessage,
    validarCampos,
    crearOlimpiada,
    resetForm,
  };
};

export default useOlimpiada;
