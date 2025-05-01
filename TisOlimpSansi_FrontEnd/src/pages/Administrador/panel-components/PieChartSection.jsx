import React from 'react';
import GraficoCircularPagos from './GraficoCircularPagos';

const PieChartSection = ({ stats, darkMode }) => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="w-full lg:w-2/3 xl:w-1/2">
        <GraficoCircularPagos
          pagadas={stats.ordenesPagadas}
          pendientes={stats.ordenesPendientes}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default PieChartSection;