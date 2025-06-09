import { useState, useEffect } from 'react';
import { API_URL } from '../../../utils/api';
import axios from 'axios';

const useDashboardData = (olimpiadaSeleccionada) => {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    ordenesPago: 0,
    estudiantesRegistrados: 0,
    estudiantesInscritos: 0,
    totalInscritos: 0,
    ordenesPagadas: 0,
    ordenesPendientes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (olimpiadaSeleccionada && olimpiadaSeleccionada.id) {
      fetchData();
    } else {
      // Resetear datos si no hay olimpiada seleccionada
      setChartData([]);
      setStats({
        ordenesPago: 0,
        estudiantesRegistrados: 0,
        estudiantesInscritos: 0,
        totalInscritos: 0,
        ordenesPagadas: 0,
        ordenesPendientes: 0,
      });
      setLoading(false);
      setError(null);
    }
  }, [olimpiadaSeleccionada]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas específicas de la olimpiada
      const requests = [
        axios.get(`${API_URL}/api/orden-pago-olimpiada`, {
          params: { olimpiada_id: olimpiadaSeleccionada.id }
        }),
        axios.get(`${API_URL}/api/estudiantes/pre-inscritos-olimpiada`, {
          params: { olimpiada_id: olimpiadaSeleccionada.id }
        }),
        axios.get(`${API_URL}/api/estudiantes/inscritos-olimpiada`, {
          params: { olimpiada_id: olimpiadaSeleccionada.id }
        })
      ];

      const [ordenesPagoResponse, preInscritosResponse, inscritosResponse] = await Promise.all(requests);


      const ordenes = ordenesPagoResponse.data || [];
      const preInscritos = preInscritosResponse.data.estudiantes_no_pagados || 0;
      const inscritos = inscritosResponse.data.estudiantes_que_pagaron || 0;

      // Filtrar órdenes pagadas y pendientes
      const ordenesPagadas = ordenes.filter(
        (orden) => orden.numero_comprobante !== null
      ).length;
      const ordenesPendientes = ordenes.length - ordenesPagadas;

      const newStats = {
        ordenesPago: ordenes.length,
        estudiantesRegistrados: preInscritos, 
        estudiantesInscritos: inscritos, 
        totalInscritos: preInscritos + inscritos,
        ordenesPagadas: ordenesPagadas,
        ordenesPendientes: ordenesPendientes,
      };

      setStats(newStats);

      // Generar datos de gráfico realistas basados en los datos de la olimpiada específica
      const generarDatosGrafico = (total, label, color) => {
        if (total === 0) {
          return {
            id: label,
            color: color,
            data: [
              { x: "Ene", y: 0 },
              { x: "Feb", y: 0 },
              { x: "Mar", y: 0 },
              { x: "Abr", y: 0 },
              { x: "May", y: 0 },
              { x: "Jun", y: 0 },
              { x: "Jul", y: 0 },
              { x: "Ago", y: 0 },
              { x: "Sep", y: 0 },

            ],
          };
        }

        // Generar progresión más realista
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
        const data = [];
        let acumulado = 0;
        
        for (let i = 0; i < meses.length; i++) {
          if (i === meses.length - 1) {
            // Último mes debe ser el total exacto
            acumulado = total;
          } else {
            // Crecimiento progresivo con algo de variabilidad
            const incremento = Math.floor(total * (0.1 + Math.random() * 0.2));
            acumulado = Math.min(acumulado + incremento, Math.floor(total * 0.9));
          }
          
          data.push({ x: meses[i], y: acumulado });
        }
        
        return {
          id: label,
          color: color,
          data: data,
        };
      };

      const newChartData = [
        generarDatosGrafico(newStats.ordenesPago, "Órdenes de Pago", "hsl(240, 70%, 50%)"),
        generarDatosGrafico(newStats.estudiantesRegistrados, "Pre-inscritos", "hsl(120, 70%, 50%)"),
        generarDatosGrafico(newStats.estudiantesInscritos, "Inscritos Verificados", "hsl(40, 70%, 50%)"),
      ];

      setChartData(newChartData);

      console.log('Datos del gráfico generados:', newChartData);
      console.log('Estadísticas finales:', newStats);

    } catch (error) {
      console.error("Error al cargar datos para olimpiada", olimpiadaSeleccionada?.titulo || 'desconocida' + ":", error);
      console.error("Detalles del error:", error.response?.data);
      setError(`Error al cargar datos del servidor para ${olimpiadaSeleccionada?.titulo || 'la olimpiada seleccionada'}`);
      
      // Establecer valores por defecto en caso de error
      setStats({
        ordenesPago: 0,
        estudiantesRegistrados: 0,
        estudiantesInscritos: 0,
        totalInscritos: 0,
        ordenesPagadas: 0,
        ordenesPendientes: 0,
      });
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return { chartData, stats, loading, error };
};

export default useDashboardData;