import React, { useState } from "react";
import Header from "./panel-components/Header";
import StatisticsCards from "./panel-components/StatisticsCards";
import ChartsSection from "./panel-components/ChartSection";
import OlimpiadaSelector from "./panel-components/OlimpiadaSelector";
import useDashboardData from "./panel-hooks/useDashboardData";
import PieChartSection from "./panel-components/PieChartSection";
import MapSection from "./panel-components/MapaSection";
import GraficoCompararInscripciones from "./panel-components/GraficoCompararInscripciones";

const PanelDatos = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState(null);
  const { chartData, stats, loading, error } = useDashboardData(olimpiadaSeleccionada);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleOlimpiadaChange = (olimpiada) => setOlimpiadaSeleccionada(olimpiada);

  if (!olimpiadaSeleccionada || loading || error) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen`}>
        <div className="container mx-auto px-4 py-8">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <OlimpiadaSelector onOlimpiadaChange={handleOlimpiadaChange} darkMode={darkMode} />
          { !olimpiadaSeleccionada && (
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} mt-16 text-center`}>
              Seleccione una olimpiada para ver las estadísticas
            </p>
          )}
          { loading && (
            <p className="text-center mt-16">Cargando datos...</p>
          )}
          { error && (
            <p className="text-center mt-16 text-red-500">{error}</p>
          )}
        </div>
      </div>
    );
  }

 
  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <OlimpiadaSelector onOlimpiadaChange={handleOlimpiadaChange} darkMode={darkMode} />

        <div className="mb-6 text-center">
          <h2 className={`text-xl font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            Estadísticas de: {olimpiadaSeleccionada.titulo}
          </h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Período: {new Date(olimpiadaSeleccionada.fecha_ini).toLocaleDateString()} – {new Date(olimpiadaSeleccionada.fecha_fin).toLocaleDateString()}
          </p>
        </div>

        <StatisticsCards stats={stats} darkMode={darkMode} />
        <ChartsSection
          chartData={chartData}
          darkMode={darkMode}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
        />
        <PieChartSection stats={stats} darkMode={darkMode} />
        <MapSection darkMode={darkMode} olimpiadaSeleccionada={olimpiadaSeleccionada} />
        <GraficoCompararInscripciones darkMode={darkMode} olimpiadaSeleccionada={olimpiadaSeleccionada}/>
      </div>
    </div>
  );
};

export default PanelDatos;
