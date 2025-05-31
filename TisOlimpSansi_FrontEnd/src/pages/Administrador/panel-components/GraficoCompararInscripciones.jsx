import React, { useState, useEffect } from 'react';

import { ResponsiveBar } from '@nivo/bar';
import { FaSpinner } from 'react-icons/fa';
import api, { API_URL } from '../../../utils/api';
import axios from 'axios';

const GraficoCompararInscripciones = ({ darkMode }) => {
  const [vistaActual, setVistaActual] = useState('area');
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Determinar el endpoint según la vista seleccionada
        const endpoint = vistaActual === 'area' 
          ? `${API_URL}/api/inscripciones/por-area` 
          : `${API_URL}/api/inscripciones/por-categoria`;
        
        const response = await axios.get(endpoint);
        setDatosGrafico(response.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos para el gráfico");
        
        // Si no hay datos reales, usar datos de prueba
        const datosPrueba = vistaActual === 'area' ? getDatosPruebaArea() : getDatosPruebaCategoria();
        setDatosGrafico(datosPrueba);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [vistaActual]);
  
  // Datos de prueba para áreas
  const getDatosPruebaArea = () => {
    return [
      {
        area: "Matemáticas",
        inscritos: 45,
        preinscritos: 28
      },
      {
        area: "Física",
        inscritos: 38,
        preinscritos: 24
      },
      {
        area: "Química",
        inscritos: 32,
        preinscritos: 19
      },
      {
        area: "Biología",
        inscritos: 29,
        preinscritos: 21
      },
      {
        area: "Informática",
        inscritos: 41,
        preinscritos: 26
      },
      {
        area: "Robótica",
        inscritos: 27,
        preinscritos: 17
      },
      {
        area: "Astronomía",
        inscritos: 22,
        preinscritos: 14
      }
    ];
  };
  
  // Datos de prueba para categoría
  const getDatosPruebaCategoria = () => {
    return [
      {
        categoria: "Primaria A",
        inscritos: 25,
        preinscritos: 18
      },
      {
        categoria: "Primaria B",
        inscritos: 28,
        preinscritos: 22
      },
      {
        categoria: "Secundaria A",
        inscritos: 32,
        preinscritos: 19
      },
      {
        categoria: "Secundaria B",
        inscritos: 38,
        preinscritos: 25
      },
      {
        categoria: "Secundaria C",
        inscritos: 35,
        preinscritos: 20
      }
    ];
  };
  
  // Preparar los datos para el gráfico según la vista
  const prepararDatosGrafico = () => {
    if (vistaActual === 'area') {
      return datosGrafico.map(item => ({
        [vistaActual]: item.area,
        "Inscritos": item.inscritos,
        "Pre-inscritos": item.preinscritos
      }));
    } else {
      return datosGrafico.map(item => ({
        [vistaActual]: item.categoria,
        "Inscritos": item.inscritos,
        "Pre-inscritos": item.preinscritos
      }));
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <FaSpinner className={`animate-spin text-3xl ${
          darkMode ? "text-blue-400" : "text-blue-500"
        }`} />
        <span className={`ml-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Cargando datos...
        </span>
      </div>
    );
  }
  
  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}>
      <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>
        Comparativa de Inscripciones
      </h2>
      
      {/* Toggle para cambiar la vista */}
      <div className="flex justify-center mb-6">
        <div className={`inline-flex rounded-md shadow-sm ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 
              ${vistaActual === "area" 
                ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") 
                : (darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-300")}`}
            onClick={() => setVistaActual("area")}
          >
            Por Área
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10
              ${vistaActual === "categoria" 
                ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") 
                : (darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-300")}`}
            onClick={() => setVistaActual("categoria")}
          >
            Por Categoría
          </button>
        </div>
      </div>
      
      {error && (
        <div className={`text-center mb-4 ${
          darkMode ? "text-yellow-400" : "text-yellow-600"
        }`}>
          <p>Usando datos de ejemplo para visualización. {error}</p>
        </div>
      )}
      
      {/* Gráfico de barras */}
      <div className="h-[400px]">
        <ResponsiveBar
          data={prepararDatosGrafico()}
          keys={['Inscritos', 'Pre-inscritos']}
          indexBy={vistaActual}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={darkMode ? ['#3B82F6', '#F97316'] : ['#2563EB', '#F97316']}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: vistaActual === 'area' ? 'Área de Competencia' : 'Categoría',
            legendPosition: 'middle',
            legendOffset: 40,
            tickTextColor: darkMode ? '#FFFFFF' : '#333333',
            legendTextColor: darkMode ? '#FFFFFF' : '#333333',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Cantidad de Estudiantes',
            legendPosition: 'middle',
            legendOffset: -40,
            tickTextColor: darkMode ? '#FFFFFF' : '#333333',
            legendTextColor: darkMode ? '#FFFFFF' : '#333333',
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={darkMode ? '#FFFFFF' : '#333333'}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ],
              itemTextColor: darkMode ? '#FFFFFF' : '#333333',
            }
          ]}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: darkMode ? '#555555' : '#cccccc',
                },
              },
              ticks: {
                line: {
                  stroke: darkMode ? '#555555' : '#cccccc',
                },
              },
            },
            grid: {
              line: {
                stroke: darkMode ? '#444444' : '#e5e5e5',
              },
            },
            tooltip: {
              container: {
                background: darkMode ? '#333333' : '#ffffff',
                color: darkMode ? '#ffffff' : '#333333',
              },
            },
          }}
          role="application"
          ariaLabel={`Comparativa de estudiantes inscritos y pre-inscritos por ${vistaActual}`}
          barAriaLabel={e => `${e.id}: ${e.formattedValue} en ${e.indexValue}`}
        />
      </div>
      
      <div className={`mt-4 text-center ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}>
        <p className="text-sm">
          {vistaActual === 'area' 
            ? 'Distribución por área de competencia' 
            : 'Distribución por categoría'}
        </p>
      </div>
    </div>
  );
};

export default GraficoCompararInscripciones;