import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../../../utils/api';

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
      // Configurar headers para las peticiones
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

      // 1. Verificar áreas asociadas
      let areasAsociadas = false;
      try {
        const areasResponse = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaId}`, config);
        areasAsociadas = areasResponse.status === 200 && 
                        areasResponse.data.data && 
                        Array.isArray(areasResponse.data.data) &&
                        areasResponse.data.data.length > 0;
        
        console.log('🔍 Verificación de áreas:', {
          olimpiadaId,
          status: areasResponse.status,
          data: areasResponse.data.data,
          cantidad: areasResponse.data.data?.length || 0,
          areasAsociadas
        });
      } catch (error) {
        console.error('Error al verificar áreas:', error);
        areasAsociadas = false;
      }

      // 2. Verificar costos definidos (solo si hay áreas asociadas)
      let costosDefinidos = false;
      if (areasAsociadas) {
        try {
          const areasResponse = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaId}`, config);
          if (areasResponse.status === 200 && areasResponse.data.data) {
            // CAMBIO CRÍTICO: Verificar que al menos un área tenga costo definido Y diferente de null/undefined
            costosDefinidos = areasResponse.data.data.some(area => {
              const costo = area.costoInscripcion;
              // Solo considerar definido si el costo no es null, undefined Y ha sido explícitamente establecido
              return costo !== null && 
                     costo !== undefined && 
                     costo !== '' && 
                     costo.toString().trim() !== '';
            });
            
            console.log('💰 Verificación de costos:', {
              olimpiadaId,
              areas: areasResponse.data.data.map(area => ({
                area: area.area,
                costo: area.costoInscripcion,
                tipo: typeof area.costoInscripcion,
                definido: area.costoInscripcion !== null && 
                         area.costoInscripcion !== undefined && 
                         area.costoInscripcion !== '' && 
                         area.costoInscripcion.toString().trim() !== ''
              })),
              costosDefinidos
            });
          }
        } catch (error) {
          console.error('Error al verificar costos:', error);
          costosDefinidos = false;
        }
      }

      // 3. Verificar límite de áreas definido (CAMBIO CRÍTICO)
      let limiteDefinido = false;
      try {
        const olimpiadaResponse = await axios.get(`${API_URL}/olimpiada/${olimpiadaId}`, config);
        if (olimpiadaResponse.status === 200 && olimpiadaResponse.data) {
          const maxMaterias = olimpiadaResponse.data.max_materias;
          // CAMBIO: Solo considerar definido si es mayor a 1 (el valor por defecto es 1)
          limiteDefinido = maxMaterias !== null && 
                          maxMaterias !== undefined && 
                          parseInt(maxMaterias) > 1;
          
          console.log('📊 Verificación de límite:', {
            olimpiadaId,
            maxMaterias,
            tipo: typeof maxMaterias,
            parsed: parseInt(maxMaterias),
            mayorA1: parseInt(maxMaterias) > 1,
            limiteDefinido
          });
        }
      } catch (error) {
        console.error('Error al verificar límite:', error);
        limiteDefinido = false;
      }

      const resultado = {
        areasAsociadas,
        costosDefinidos,
        limiteDefinido
      };

      console.log('✅ Resultado final de verificación:', {
        olimpiadaId,
        ...resultado,
        progreso: `${Object.values(resultado).filter(Boolean).length}/3`
      });

      return resultado;

    } catch (error) {
      console.error('Error general al verificar progreso:', error);
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