import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_URL } from "../../../../utils/api";
import axios from "axios";

export const useOlimpiadas = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [cargandoOlimpiadas, setCargandoOlimpiadas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

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
          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
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

  return {
    olimpiadas,
    cargandoOlimpiadas,
    errorCarga,
    recargarOlimpiadas: () => {
      setCargandoOlimpiadas(true);
      setErrorCarga("");
    },
  };
};
