import React from 'react';
import MapaBolivia from './MapaBolivia';

const MapSection = ({ darkMode, olimpiadaSeleccionada }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6 mb-8`}
    >
      <MapaBolivia darkMode={darkMode} olimpiadaSeleccionada={olimpiadaSeleccionada} />
    </div>
  );
};

export default MapSection;