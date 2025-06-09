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
    if (olimpiadaSeleccionada) {
      fetchData();
    }
  }, [olimpiadaSeleccionada]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Cargando datos para olimpiada:', olimpiadaSeleccionada);

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

      console.log('Respuestas del servidor:', {
        ordenes: ordenesPagoResponse.data,
        preInscritos: preInscritosResponse.data,
        inscritos: inscritosResponse.data
      });

      const ordenes = ordenesPagoResponse.data || [];
      const preInscritos = preInscritosResponse.data.estudiantes_no_pagados || 0;
      const inscritos = inscritosResponse.data.estudiantes_que_pagaron || 0;

      // Filtrar órdenes pagadas y pendientes
      const ordenesPagadas = ordenes.filter(
        (orden) => orden.numero_comprobante !== null
      ).length;
      const ordenesPendientes = ordenes.length - ordenesPagadas;

      setStats({
        ordenesPago: ordenes.length,
        estudiantesRegistrados: preInscritos, 
        estudiantesInscritos: inscritos, 
        totalInscritos: preInscritos + inscritos,
        ordenesPagadas: ordenesPagadas,
        ordenesPendientes: ordenesPendientes,
      });

      // Generar datos de gráfico mock basados en los datos reales
      const mockChartData = [
        {
          id: "Órdenes de Pago",
          color: "hsl(240, 70%, 50%)",
          data: [
            { x: "Ene", y: Math.floor(ordenes.length * 0.4) },
            { x: "Feb", y: Math.floor(ordenes.length * 0.5) },
            { x: "Mar", y: Math.floor(ordenes.length * 0.7) },
            { x: "Abr", y: Math.floor(ordenes.length * 0.9) },
            { x: "May", y: Math.floor(ordenes.length * 0.8) },
            { x: "Jun", y: ordenes.length },
          ],
        },
        {
          id: "Pre-inscritos",
          color: "hsl(120, 70%, 50%)",
          data: [
            { x: "Ene", y: Math.floor(preInscritos * 0.3) },
            { x: "Feb", y: Math.floor(preInscritos * 0.4) },
            { x: "Mar", y: Math.floor(preInscritos * 0.6) },
            { x: "Abr", y: Math.floor(preInscritos * 0.8) },
            { x: "May", y: Math.floor(preInscritos * 0.7) },
            { x: "Jun", y: preInscritos },
          ],
        },
        {
          id: "Inscritos Verificados",
          color: "hsl(40, 70%, 50%)",
          data: [
            { x: "Ene", y: Math.floor(inscritos * 0.2) },
            { x: "Feb", y: Math.floor(inscritos * 0.3) },
            { x: "Mar", y: Math.floor(inscritos * 0.5) },
            { x: "Abr", y: Math.floor(inscritos * 0.6) },
            { x: "May", y: Math.floor(inscritos * 0.5) },
            { x: "Jun", y: inscritos },
          ],
        },
      ];

      setChartData(mockChartData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      console.error("Detalles del error:", error.response?.data);
      setError("Error al cargar datos del servidor");
      
      // Establecer valores por defecto en caso de error
      setStats({
        ordenesPago: 0,
        estudiantesRegistrados: 0,
        estudiantesInscritos: 0,
        totalInscritos: 0,
        ordenesPagadas: 0,
        ordenesPendientes: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return { chartData, stats, loading, error };
};

export default useDashboardData;