import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

export const useGuardarConfiguracion = (cargarAreasAsociadas) => {
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const ejecutarGuardado = async (
    olimpiadaSeleccionada,
    areasParaDesasociar,
    categoriasParaEliminar
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

      if (areasParaDesasociar.length > 0) {
        const datosAreasDesasociar = {
          id_olimpiada: olimpiadaSeleccionada,
          areas: areasParaDesasociar.map((combo) => ({
            area: combo.area,
            habilitado: false,
          })),
        };

        const responseAreas = await axios.post(
          `${API_URL}/desasociar-areas-olimpiada`,
          datosAreasDesasociar,
          config
        );

        if (responseAreas.status !== 200) {
          throw new Error("Error al desasociar áreas completas");
        }
      }

      if (categoriasParaEliminar.length > 0) {
        const responseAreas = await axios.get(
          `${API_URL}/areas-olimpiada/${olimpiadaSeleccionada}`,
          config
        );
        const areasAsociadas = responseAreas.data.data || [];

        for (const item of categoriasParaEliminar) {
          const nombreAreaNormalizado = item.combo.area
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^A-Z0-9\s\-]/g, "");

          const areaEncontrada = areasAsociadas.find((area) => {
            const nombreNormalizado = area.area
              .toUpperCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^A-Z0-9\s\-]/g, "");
            return nombreNormalizado === nombreAreaNormalizado;
          });

          if (!areaEncontrada) {
            throw new Error(
              `No se pudo encontrar el área "${item.combo.area}" en el servidor`
            );
          }

          const datosCategorias = {
            id_olimpiada: olimpiadaSeleccionada,
            id_area: areaEncontrada.id,
            categorias_eliminar: item.categorias.map((cat) => ({
              id: cat.id,
              nombre: cat.nombre,
            })),
          };

          const responseCategorias = await axios.post(
            `${API_URL}/desasociar-categorias-olimpiada`,
            datosCategorias,
            config
          );

          if (responseCategorias.status !== 200) {
            throw new Error(
              `Error al desasociar categorías del área "${item.combo.area}"`
            );
          }
        }
      }

      setMensajeExito("¡Cambios aplicados exitosamente!");
      setTimeout(() => setMensajeExito(""), 3000);
      cargarAreasAsociadas(olimpiadaSeleccionada);

      return { success: true };
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

      return { success: false, error: mensaje };
    } finally {
      setGuardando(false);
    }
  };

  return {
    guardando,
    mensajeExito,
    setMensajeExito,
    ejecutarGuardado,
  };
};
