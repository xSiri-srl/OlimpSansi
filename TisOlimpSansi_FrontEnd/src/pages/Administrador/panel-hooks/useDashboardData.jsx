import { useState, useEffect } from 'react';
import { API_URL } from '../../../utils/api';
import axios from 'axios';

const useDashboardData = () => {
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
    const fetchData = async () => {
      try {
        setLoading(true);

        const inscritosResponse = await axios.get(
          `${API_URL}/api/lista-inscritos`
        );

        const ordenesPagoResponse = await axios.get(
          `${API_URL}/api/orden-pago`
        );

        const ordenes = ordenesPagoResponse.data;
        const inscritos = inscritosResponse.data;

        const ordenesPagadas = ordenes.filter(
          (orden) => orden.numero_comprobante !== null
        ).length;
        const ordenesPendientes = ordenes.length - ordenesPagadas;

        setStats({
          ordenesPago: ordenes.length,
          estudiantesRegistrados: ordenesPendientes, 
          estudiantesInscritos: ordenesPagadas, 
          totalInscritos: inscritos.length,
          ordenesPagadas: ordenesPagadas,
          ordenesPendientes: ordenesPendientes,
        });

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
              { x: "Ene", y: Math.floor(ordenesPendientes * 0.3) },
              { x: "Feb", y: Math.floor(ordenesPendientes * 0.4) },
              { x: "Mar", y: Math.floor(ordenesPendientes * 0.6) },
              { x: "Abr", y: Math.floor(ordenesPendientes * 0.8) },
              { x: "May", y: Math.floor(ordenesPendientes * 0.7) },
              { x: "Jun", y: ordenesPendientes },
            ],
          },
          {
            id: "Inscritos Verificados",
            color: "hsl(40, 70%, 50%)",
            data: [
              { x: "Ene", y: Math.floor(ordenesPagadas * 0.2) },
              { x: "Feb", y: Math.floor(ordenesPagadas * 0.3) },
              { x: "Mar", y: Math.floor(ordenesPagadas * 0.5) },
              { x: "Abr", y: Math.floor(ordenesPagadas * 0.6) },
              { x: "May", y: Math.floor(ordenesPagadas * 0.5) },
              { x: "Jun", y: ordenesPagadas },
            ],
          },
        ];

        setChartData(mockChartData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar datos del servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartData, stats, loading, error };
};

export default useDashboardData;