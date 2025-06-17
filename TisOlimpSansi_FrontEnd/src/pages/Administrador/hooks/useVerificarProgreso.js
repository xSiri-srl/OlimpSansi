import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from "../../../utils/api";

export const useVerificarProgreso = () => {
  const [verificando, setVerificando] = useState(false);

  const verificarProgreso = useCallback(async (olimpiadaId) => {
    if (!olimpiadaId) {
      return {
        areasAsociadas: false,
        costosDefinidos: false,
        limiteDefinido: false
      };
    }

    setVerificando(true);

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
      let areasAsociadas = false;
      try {
        const areasResponse = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaId}`, config);
        areasAsociadas = areasResponse.status === 200 && 
                        areasResponse.data.data && 
                        Array.isArray(areasResponse.data.data) &&
                        areasResponse.data.data.length > 0;
      
      } catch (error) {
        areasAsociadas = false;
      }

      let costosDefinidos = false;
      if (areasAsociadas) {
        try {
          const areasResponse = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaId}`, config);
          if (areasResponse.status === 200 && areasResponse.data.data) {
           
            costosDefinidos = areasResponse.data.data.every(area => {
              const costo = area.costoInscripcion;
            
              const esValido = costo !== null && 
                     costo !== undefined && 
                     costo !== '' && 
                     costo.toString().trim() !== '' &&
                     parseFloat(costo) > 0;
              
              return esValido;
            });
            
          }
        } catch (error) {
          console.error('Error al verificar costos:', error);
          costosDefinidos = false;
        }
      }
      let limiteDefinido = false;
      try {
        const olimpiadaResponse = await axios.get(`${API_URL}/olimpiada/${olimpiadaId}`, config);
        if (olimpiadaResponse.status === 200 && olimpiadaResponse.data) {
          const maxMaterias = olimpiadaResponse.data.max_materias;
          limiteDefinido = maxMaterias !== null && 
                          maxMaterias !== undefined && 
                          parseInt(maxMaterias) > 0;
          
        }
      } catch (error) {
        limiteDefinido = false;
      }

      const resultado = {
        areasAsociadas,
        costosDefinidos,
        limiteDefinido
      };

      return resultado;

    } catch (error) {
      return {
        areasAsociadas: false,
        costosDefinidos: false,
        limiteDefinido: false
      };
    } finally {
      setVerificando(false);
    }
  }, []);

  return { verificarProgreso, verificando };
};