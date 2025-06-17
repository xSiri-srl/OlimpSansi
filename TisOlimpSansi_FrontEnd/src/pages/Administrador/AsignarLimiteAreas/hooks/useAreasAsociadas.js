import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

export const useAreasAsociadas = () => {
  const [cantidadAreasAsociadas, setCantidadAreasAsociadas] = useState(0);
  const [cargandoAreas, setCargandoAreas] = useState(false);

  const obtenerCantidadAreasAsociadas = async (olimpiadaId) => {
    if (!olimpiadaId) {
      setCantidadAreasAsociadas(0);
      return;
    }

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

  return {
    cantidadAreasAsociadas,
    cargandoAreas,
    obtenerCantidadAreasAsociadas
  };
};