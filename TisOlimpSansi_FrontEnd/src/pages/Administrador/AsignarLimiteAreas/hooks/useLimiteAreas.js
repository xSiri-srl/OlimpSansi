import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

export const useLimiteAreas = (maximoPermitido = 7) => {
  const [contador, setContador] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const cargarNumeroMaximo = async (olimpiadaId) => {
    if (!olimpiadaId) {
      setContador(1);
      return;
    }

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

      const response = await axios.get(`${API_URL}/olimpiada/${olimpiadaId}`, config);

      if (response.status === 200 && response.data) {
        const maxMaterias = Number(response.data.max_materias);
        setContador(maxMaterias || 1);
      }
    } catch (error) {
      console.error("Error al cargar número máximo:", error);
      setContador(1);
    }
  };

  const ejecutarGuardado = async (olimpiadaId) => {
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
        id: parseInt(olimpiadaId),
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
        return { success: true };
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
          mensaje = "Error de validación CSRF. Recarga la página e intenta nuevamente.";
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

      return { success: false, error: mensaje };
    } finally {
      setGuardando(false);
    }
  };

  const incrementar = () => {
    if (contador < maximoPermitido) {
      setContador(contador + 1);
      return true;
    }
    return false;
  };

  const decrementar = () => {
    if (contador > 1) {
      setContador(contador - 1);
    }
  };

  const resetearContador = () => {
    setContador(1);
    setMensajeExito("");
  };

  return {
    contador,
    guardando,
    mensajeExito,
    cargarNumeroMaximo,
    ejecutarGuardado,
    incrementar,
    decrementar,
    resetearContador,
  };
};
