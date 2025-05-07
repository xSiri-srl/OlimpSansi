import React, { useState } from "react";
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
        <StatisticsCards stats={stats} darkMode={darkMode} />
        <ChartsSection chartData={chartData} darkMode={darkMode} />
        <PieChartSection stats={stats} darkMode={darkMode} />
        <MapSection darkMode={darkMode} />
        <GraficoCompararInscripciones darkMode={darkMode} />
      </div>
    </div>
  );
};

export default PanelDatos;