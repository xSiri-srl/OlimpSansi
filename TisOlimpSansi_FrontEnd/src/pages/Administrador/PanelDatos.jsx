import React, { useState, useEffect } from "react";
import Header from "./panel-components/Header";
import StatisticsCards from "./panel-components/StatisticsCards";
import ChartsSection from "./panel-components/ChartSection";
import PieChartSection from "./panel-components/PieChartSection";
import MapSection from "./panel-components/MapaSection";
import GraficoCompararInscripciones from "./panel-components/GraficoCompararInscripciones";
import useDashboardData from "./panel-hooks/useDashboardData";

const PanelDatos = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { chartData, stats, loading, error } = useDashboardData();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Obtener el rol del usuario del localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setUserRole(user.role);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } min-h-screen transition-colors duration-200`}
    >
      <div className="container mx-auto px-4 py-8">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Mostrar las estadísticas financieras para todos los roles */}
        <StatisticsCards stats={stats} darkMode={darkMode} />
        
        {/* Secciones relacionadas con pagos (disponibles para contador y admin) */}
        <ChartsSection chartData={chartData} darkMode={darkMode} />
        <PieChartSection stats={stats} darkMode={darkMode} />
        
        {/* Secciones solo disponibles para admin */}
        {userRole !== 'contador' && (
          <>
            <MapSection darkMode={darkMode} />
            <GraficoCompararInscripciones darkMode={darkMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default PanelDatos;
