import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { FaSpinner } from 'react-icons/fa';
import { API_URL } from '../../../utils/api';
import axios from 'axios';

const GraficoCompararInscripciones = ({ darkMode, olimpiadaSeleccionada }) => {
  const [vistaActual, setVistaActual] = useState('area');
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validar que se haya seleccionado una olimpiada
        if (!olimpiadaSeleccionada || !olimpiadaSeleccionada.id) {
          setError("Debe seleccionar una olimpiada para visualizar los datos");
          setDatosGrafico([]);
          setLoading(false);
          return;
        }

        const endpoint = vistaActual === 'area' 
          ? `inscripciones/por-area` 
          : `inscripciones/por-categoria`;
        
        const response = await axios.get(`${API_URL}/api/${endpoint}`, {
          params: {
            olimpiada_id: olimpiadaSeleccionada.id
          }
        });
        
        setDatosGrafico(response.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        
        if (err.response && err.response.status === 400) {
          setError("Error: ID de olimpiada requerido");
        } else {
          setError("No se pudieron cargar los datos para el gráfico");
        }

        // Usar datos de prueba solo en caso de error de conexión
        if (!err.response) {
          const datosPrueba = vistaActual === 'area' ? getDatosPruebaArea() : getDatosPruebaCategoria();
          setDatosGrafico(datosPrueba);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [vistaActual, olimpiadaSeleccionada]);

  const getDatosPruebaArea = () => {
    return [];
  };
 
  const getDatosPruebaCategoria = () => {
    return [
    ];
  };
 
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

  // Mostrar mensaje si no hay olimpiada seleccionada
  if (!olimpiadaSeleccionada || !olimpiadaSeleccionada.id) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}>
        <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>
          Comparativa de Inscripciones
        </h2>
        <div className="flex justify-center items-center py-16">
          <div className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p className="text-lg mb-2">Por favor, selecciona una olimpiada</p>
            <p className="text-sm">Los datos se mostrarán una vez que selecciones una olimpiada específica</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay datos
  if (datosGrafico.length === 0 && !error) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}>
        <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>
          Comparativa de Inscripciones - {olimpiadaSeleccionada.titulo}
        </h2>
        <div className="flex justify-center items-center py-16">
          <div className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p className="text-lg mb-2">No hay inscripciones para esta olimpiada</p>
            <p className="text-sm">Los datos aparecerán cuando haya inscripciones registradas</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}>
      <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-2`}>
        Comparativa de Inscripciones
      </h2>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
        {olimpiadaSeleccionada.titulo}
      </p>
      
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
        <div className={`text-center mb-4 p-3 rounded ${
          darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800"
        }`}>
          <p>{error}</p>
        </div>
      )}
   
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