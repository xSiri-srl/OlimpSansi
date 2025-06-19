import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL } from "../../../../utils/api";

export const useGuardarCostos = ({
  olimpiadaSeleccionada,
  nombreOlimpiada,
  olimpiadaBloqueada,
  cantidadInscripciones,
  razonBloqueo,
  fechaFin,
  areasAsociadas,
  mostrarAlerta,
  mostrarConfirmacion,
  cargarAreasAsociadas,
  mostrarProgreso
}) => {
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

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
          mensaje = `No se pueden realizar cambios en esta olimpiada porque ya tiene ${cantidadInscripciones} inscripción(es) registrada(s). Para modificar los costos, primero debe eliminar todas las inscripciones asociadas.`;
          break;
        case 'periodo':
          mensaje = `No se pueden realizar cambios en esta olimpiada porque el período de inscripción terminó el ${new Date(fechaFin).toLocaleDateString('es-ES')}.`;
          break;
      }
      
      mostrarAlerta("Olimpiada bloqueada", mensaje, "error");
      return;
    }

    const totalAreas = areasAsociadas.length;
    const areasConCosto = areasAsociadas.filter(area => area.costoInscripcion && parseFloat(area.costoInscripcion) > 0).length;
    
    mostrarConfirmacion(
      "Confirmar actualización de costos",
      `¿Está seguro que desea actualizar los costos de inscripción para la olimpiada "${nombreOlimpiada}"?\n\nSe actualizarán ${totalAreas} área(s) de competencia.\n${areasConCosto} área(s) tendrán costo de inscripción.`,
      () => {
        ejecutarGuardado();
      },
      "info"
    );
  };

  const ejecutarGuardado = async () => {
    setGuardando(true);

    try {
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      const csrfToken = Cookies.get('XSRF-TOKEN');
      axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
  
      const datosAEnviar = {
        id_olimpiada: olimpiadaSeleccionada,
        areas: areasAsociadas.map(area => ({
          id: area.id,
          costoInscripcion: area.costoInscripcion || "0"
        }))
      };
      
      const response = await axios.post(
        `${API_URL}/actualizar-costos-olimpiada`,
        datosAEnviar,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMensajeExito("¡Costos asignados exitosamente!");
        setTimeout(() => setMensajeExito(""), 3000);

        cargarAreasAsociadas(olimpiadaSeleccionada);
        setTimeout(() => mostrarProgreso(olimpiadaSeleccionada, nombreOlimpiada), 1000);
      } else {
        throw new Error("Error al guardar los costos");
      }
    } catch (error) {
      let mensaje = "Error al guardar la configuración de costos";
      
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

  return {
    guardarConfiguracion,
    guardando,
    mensajeExito
  };
};