import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../utils/api';

export const useVerificarInscripciones = () => {
  const [verificando, setVerificando] = useState(false);

  const verificarInscripciones = async (idOlimpiada) => {
    if (!idOlimpiada) return { 
      tieneInscripciones: false, 
      cantidad: 0, 
      periodoTerminado: false,
      estaBloqueada: false,
      razonBloqueo: null
    };

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

      const response = await axios.get(
        `${API_URL}/olimpiada/${idOlimpiada}/verificar-inscripciones`,
        config
      );

      if (response.status === 200) {
        return {
          tieneInscripciones: response.data.tiene_inscripciones,
          cantidad: response.data.cantidad_inscripciones,
          periodoTerminado: response.data.periodo_terminado,
          fechaFin: response.data.fecha_fin,
          estaBloqueada: response.data.esta_bloqueada,
          razonBloqueo: response.data.razon_bloqueo
        };
      }
      
      throw new Error('Error al verificar inscripciones');
      
    } catch (error) {
      console.error('Error al verificar inscripciones:', error);
      return { 
        tieneInscripciones: false, 
        cantidad: 0, 
        periodoTerminado: false,
        estaBloqueada: false,
        razonBloqueo: null
      };
    } finally {
      setVerificando(false);
    }
  };

  return { verificarInscripciones, verificando };
};