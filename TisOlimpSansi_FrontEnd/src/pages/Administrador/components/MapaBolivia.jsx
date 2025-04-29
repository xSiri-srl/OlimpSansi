import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [inscripcionesPorDepartamento, setInscripcionesPorDepartamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = "http://localhost:8000/api";
  
  useEffect(() => {
    const fetchDepartamentoData = async () => {
      try {
        setLoading(true);
        
        // Lista de departamentos de Bolivia
        const departamentos = [
          "La Paz", 
          "Cochabamba", 
          "Santa Cruz", 
          "Oruro", 
          "Potosí", 
          "Chuquisaca", 
          "Tarija", 
          "Beni", 
          "Pando"
        ];
        
        // Mapeo de nombres de departamentos a IDs usados en el componente
        const departamentoToId = {
          "La Paz": "BOL.LA_PAZ",
          "Cochabamba": "BOL.COCHABAMBA",
          "Santa Cruz": "BOL.SANTA_CRUZ",
          "Oruro": "BOL.ORURO",
          "Potosí": "BOL.POTOSI",
          "Chuquisaca": "BOL.CHUQUISACA",
          "Tarija": "BOL.TARIJA",
          "Beni": "BOL.BENI",
          "Pando": "BOL.PANDO"
        };
        
        // Hacer solicitudes para cada departamento
        const promises = departamentos.map(async (departamento) => {
          // Ahora solicitamos específicamente estudiantes INSCRITOS por departamento (con comprobante verificado)
          const response = await axios.post(
            `${API_BASE_URL}/estudiantes/inscritos/bydepartamento`, 
            { departamento }
          );
          
          return {
            id: departamentoToId[departamento],
            value: response.data.cantidad_estudiantes
          };
        });
        
        const resultados = await Promise.all(promises);
        setInscripcionesPorDepartamento(resultados);
      } catch (err) {
        console.error("Error al cargar datos de departamentos:", err);
        setError("No se pudieron cargar los datos de inscripciones por departamento");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartamentoData();
  }, []);
  
  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-2"></div>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Cargando datos departamentales...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className={`text-red-500 text-center`}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <div className={`${darkMode ? "text-white" : "text-gray-800"} text-center mb-4`}>
        <h3 className="text-xl font-semibold">Distribución de Inscritos por Departamento</h3>
        <p className="text-sm text-gray-500">(Estudiantes con pago verificado)</p>
      </div>
      
      {/* Mapa simplificado de Bolivia */}
      <div className="grid grid-cols-3 gap-2 h-[300px]">
        {inscripcionesPorDepartamento.map(dept => {
          
          const nombreDep = boliviaGeoFeatures.features.find(f => f.id === dept.id)?.properties?.name || "";
          
          // Encontrar el valor máximo para normalizar la intensidad
          const maxValue = Math.max(...inscripcionesPorDepartamento.map(d => d.value));
          
          // Normalizar la intensidad basada en el valor máximo (mínimo 20%, máximo 100%)
          const intensity = maxValue > 0 
            ? Math.min(100, Math.max(20, (dept.value / maxValue) * 100))
            : 20; // Valor por defecto si no hay inscritos
            
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