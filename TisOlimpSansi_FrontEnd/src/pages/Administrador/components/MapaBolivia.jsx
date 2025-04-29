import React from "react";
import { ResponsiveChoropleth } from "@nivo/geo";

const boliviaGeoFeatures = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "BOL.LA_PAZ",
      properties: { name: "La Paz" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.COCHABAMBA",
      properties: { name: "Cochabamba" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.SANTA_CRUZ",
      properties: { name: "Santa Cruz" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.ORURO",
      properties: { name: "Oruro" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.POTOSI",
      properties: { name: "Potosí" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.CHUQUISACA",
      properties: { name: "Chuquisaca" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.TARIJA",
      properties: { name: "Tarija" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.BENI",
      properties: { name: "Beni" },
      geometry: { type: "Polygon", coordinates: [] }
    },
    {
      type: "Feature",
      id: "BOL.PANDO",
      properties: { name: "Pando" },
      geometry: { type: "Polygon", coordinates: [] }
    }
  ]
};

const MapaBolivia = ({ darkMode }) => {
  
  const inscripcionesPorDepartamento = [
    { id: "BOL.LA_PAZ", value: 2 },
    { id: "BOL.COCHABAMBA", value: 12 },
    { id: "BOL.SANTA_CRUZ", value: 10 },
    { id: "BOL.ORURO", value: 0 },
    { id: "BOL.POTOSI", value: 10 },
    { id: "BOL.CHUQUISACA", value: 0 },
    { id: "BOL.TARIJA", value: 0 },
    { id: "BOL.BENI", value: 0 },
    { id: "BOL.PANDO", value: 0 }
  ];

  return (
    <div className="h-[400px] w-full">
      <div className={`${darkMode ? "text-white" : "text-gray-800"} text-center mb-4`}>
        <h3 className="text-xl font-semibold">Distribución de Inscritos por Departamento</h3>
      </div>
      
      {/* Mapa simplificado de Bolivia */}
      <div className="grid grid-cols-3 gap-2 h-[300px]">
        {inscripcionesPorDepartamento.map(dept => {
          
          const nombreDep = boliviaGeoFeatures.features.find(f => f.id === dept.id)?.properties?.name || "";
          
          const intensity = Math.min(100, Math.max(20, (dept.value / 150) * 100));
          const bgColor = darkMode 
            ? `rgba(59, 130, 246, ${intensity/100})` 
            : `rgba(37, 99, 235, ${intensity/100})`;
          
          return (
            <div 
              key={dept.id}
              className={`rounded-lg p-3 flex flex-col justify-center items-center ${darkMode ? "border-gray-700" : "border-gray-200"} border`}
              style={{ backgroundColor: bgColor }}
            >
              <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                {nombreDep}
              </p>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {dept.value}
              </p>
              <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Inscritos
              </p>
            </div>
          );
        })}
      </div>
      
      <div className={`flex justify-center mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 mr-1"></div>
          <span className="mr-3 text-xs">Pocos</span>
          
          <div className="w-4 h-4 bg-blue-300 mr-1"></div>
          <span className="mr-3 text-xs">Moderados</span>
          
          <div className="w-4 h-4 bg-blue-500 mr-1"></div>
          <span className="mr-3 text-xs">Muchos</span>
          
          <div className="w-4 h-4 bg-blue-700 mr-1"></div>
          <span className="text-xs">Máximos</span>
        </div>
      </div>
    </div>
  );
};

export default MapaBolivia;