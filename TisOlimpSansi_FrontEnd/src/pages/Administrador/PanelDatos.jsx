import React, { useState } from "react";
import Header from "./panel-components/Header";
import StatisticsCards from "./panel-components/StatisticsCards";
import ChartsSection from "./panel-components/ChartSection";
import PieChartSection from "./panel-components/PieChartSection";
import MapSection from "./panel-components/MapaSection";
import GraficoCompararInscripciones from "./panel-components/GraficoCompararInscripciones";
import OlimpiadaSelector from "./panel-components/OlimpiadaSelector";
import useDashboardData from "./panel-hooks/useDashboardData";

const PanelDatos = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState(null);
  const { chartData, stats, loading, error } = useDashboardData(olimpiadaSeleccionada);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleOlimpiadaChange = (olimpiada) => {
    setOlimpiadaSeleccionada(olimpiada);
  };

  if (!olimpiadaSeleccionada) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-8">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <OlimpiadaSelector onOlimpiadaChange={handleOlimpiadaChange} darkMode={darkMode} />
          <div className="flex flex-col items-center justify-center h-64">
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Seleccione una olimpiada para ver las estadísticas
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-8">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <OlimpiadaSelector onOlimpiadaChange={handleOlimpiadaChange} darkMode={darkMode} />
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Cargando datos de {olimpiadaSeleccionada?.titulo}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-8">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <OlimpiadaSelector onOlimpiadaChange={handleOlimpiadaChange} darkMode={darkMode} />
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500 text-xl">{error}</div>
          </div>
        </div>
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
        <OlimpiadaSelector onOlimpiadaChange={handleOlimpiadaChange} darkMode={darkMode} />
        
        {/* Mostrar título de la olimpiada seleccionada */}
        <div className="mb-6 text-center">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Estadísticas de: {olimpiadaSeleccionada.titulo}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Período: {new Date(olimpiadaSeleccionada.fecha_ini).toLocaleDateString()} - {new Date(olimpiadaSeleccionada.fecha_fin).toLocaleDateString()}
          </p>
        </div>

        <StatisticsCards stats={stats} darkMode={darkMode} olimpiada={olimpiadaSeleccionada} />
        {/*<ChartsSection chartData={chartData} darkMode={darkMode} />
        <PieChartSection stats={stats} darkMode={darkMode} />
        <MapSection darkMode={darkMode} />
        <GraficoCompararInscripciones darkMode={darkMode} />*/}
      </div>
    </div>
  );
};

export default PanelDatos;