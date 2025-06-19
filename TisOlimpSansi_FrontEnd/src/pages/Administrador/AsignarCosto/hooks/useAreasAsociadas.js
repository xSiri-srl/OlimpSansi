import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL } from "../../../../utils/api";

export const useAreasAsociadas = ({ 
  olimpiadaBloqueada, 
  cantidadInscripciones, 
  razonBloqueo, 
  fechaFin, 
  mostrarAlerta 
}) => {
  const [areasAsociadas, setAreasAsociadas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargando(true);
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
      
      const response = await axios.get(`${API_URL}/areas-olimpiada/${idOlimpiada}`, config);
      
      if (response.status === 200 && response.data.data) {
        setAreasAsociadas(response.data.data.map(area => ({
          ...area,
          costoInscripcion: area.costoInscripcion !== null && area.costoInscripcion !== undefined ? 
            area.costoInscripcion.toString() : 
            ""
        })));
      } else {
        throw new Error("Error al obtener áreas asociadas");
      }
    } catch (error) {
      mostrarAlerta("Error", "Error al cargar las áreas asociadas a la olimpiada", "error");
    } finally {
      setCargando(false);
    }
  };

  const actualizarCosto = (areaId, nuevoCosto) => {
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
    
    setAreasAsociadas(prev => 
      prev.map(area => 
        area.id === areaId 
          ? { ...area, costoInscripcion: nuevoCosto } 
          : area
      )
    );
  };

  return {
    areasAsociadas,
    setAreasAsociadas,
    cargando,
    cargarAreasAsociadas,
    actualizarCosto
  };
};