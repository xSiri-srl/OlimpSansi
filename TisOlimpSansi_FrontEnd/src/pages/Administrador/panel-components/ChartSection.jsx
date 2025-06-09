import React from 'react';
import LineChart from './LineChart';
import OrdenesRecientes from './OrdenesRecientes';

const ChartsSection = ({ chartData, darkMode, olimpiadaSeleccionada }) => {
 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-6 lg:col-span-2`}
      >
        <h2
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          } mb-4`}
        >
          Evolución de Inscripciones
        </h2>
                
        <p
          className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}
        >
          Seguimiento mensual de órdenes de pago, pre-inscripciones e
          inscripciones verificadas
          {olimpiadaSeleccionada && (
            <span className="block text-sm mt-1">
              <strong>{olimpiadaSeleccionada.titulo}</strong>
            </span>
          )}
        </p>
        
        <LineChart 
          data={chartData} 
          darkMode={darkMode} 
          olimpiadaSeleccionada={olimpiadaSeleccionada}
        />
      </div>
      <div className="lg:col-span-1">
        <OrdenesRecientes 
          darkMode={darkMode} 
          olimpiadaSeleccionada={olimpiadaSeleccionada}
        />
      </div>
    </div>
  );
};

export default ChartsSection;