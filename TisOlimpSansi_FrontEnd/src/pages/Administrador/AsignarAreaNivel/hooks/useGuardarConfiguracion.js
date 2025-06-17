import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../../../utils/api";

export const useGuardarConfiguracion = () => {
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const ejecutarGuardado = async (
    olimpiadaSeleccionada,
    combinaciones,
    mostrarAlerta,
    mostrarProgreso,
    nombreOlimpiada,
    cargarAreasAsociadas
  ) => {
    setGuardando(true);

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
        id_olimpiada: olimpiadaSeleccionada,
        areas: combinaciones
          .filter((combo) => combo.habilitado)
          .map((combo) => {
            const categoriasFormateadas = combo.categorias.map((cat) => ({
              nivel: cat.nombre,
              desde: cat.desde,
              hasta: cat.hasta,
            }));

            return {
              area: combo.area,
              habilitado: true,
              rangos: categoriasFormateadas,
            };
          }),
      };

      const response = await axios.post(
        `${API_URL}/asociar-areas-olimpiada`,
        datosAEnviar,
        config
      );

      if (response.status === 200) {
        setMensajeExito("¡Áreas asociadas exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);
        setTimeout(
          () => mostrarProgreso(olimpiadaSeleccionada, nombreOlimpiada),
          1000
        );
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
          mensaje =
            "Error de validación CSRF. Por favor, recarga la página e intenta nuevamente.";
        } else {
          mensaje = error.response.data?.message || mensaje;
        }
      }

      mostrarAlerta("Error al guardar", mensaje, "error");
    } finally {
      setGuardando(false);
    }
  };

  return {
    guardando,
    mensajeExito,
    ejecutarGuardado,
  };
};