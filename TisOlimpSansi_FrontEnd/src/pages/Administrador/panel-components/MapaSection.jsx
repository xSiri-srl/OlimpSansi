import React from 'react';
import MapaBolivia from './MapaBolivia';

const MapSection = ({ darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6 mb-8`}
    >
      <MapaBolivia darkMode={darkMode} />
    </div>
  );
};

export default MapSection;