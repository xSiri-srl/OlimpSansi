import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
//import axios from "axios";
import { FaUsers, FaFileInvoiceDollar, FaCheckCircle, FaUserGraduate } from "react-icons/fa";
import DarkModeToggle from "./components/DarkModeToggle";
import OrdenesRecientes from "./components/OrdenesRecientes";
import MapaBolivia from "./components/MapaBolivia";
import GraficoCircularPagos from "./components/GraficoCircularPagos";

const StatCard = ({ title, value, icon, bgColor, textColor, darkMode }) => {
  const darkModeClasses = darkMode 
    ? "bg-gray-800 text-white" 
    : `${bgColor}`;
  
  const darkModeTextColor = darkMode 
    ? "text-white" 
    : textColor;

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkModeClasses}`}>
      <div className="flex justify-between">
        <div>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} font-medium`}>{title}</p>
          <h3 className={`text-3xl font-bold mt-2 ${darkModeTextColor}`}>{value}</h3>
        </div>
        <div className={`text-3xl ${darkModeTextColor} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
};

const LineChart = ({ data, darkMode }) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.0f"
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Mes",
          legendOffset: 36,
          legendPosition: "middle",
          tickTextColor: darkMode ? "#ffffff" : "#333333",
          legendTextColor: darkMode ? "#ffffff" : "#333333",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Cantidad",
          legendOffset: -40,
          legendPosition: "middle",
          tickTextColor: darkMode ? "#ffffff" : "#333333",
          legendTextColor: darkMode ? "#ffffff" : "#333333",
        }}
        enableGridX={false}
        enableGridY={true}
        colors={{ scheme: 'category10' }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: darkMode ? "#ffffff" : "#777777",
              }
            },
            ticks: {
              line: {
                stroke: darkMode ? "#ffffff" : "#777777",
              },
              text: {
                fill: darkMode ? "#ffffff" : "#333333",
              }
            },
            legend: {
              text: {
                fill: darkMode ? "#ffffff" : "#333333",
              }
            }
          },
          legends: {
            text: {
              fill: darkMode ? "#ffffff" : "#333333",
            }
          },
          tooltip: {
            container: {
              background: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#333",
            }
          }
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: darkMode ? "rgba(255, 255, 255, .1)" : "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

const PanelDatos = () => {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    ordenesPago: 0,
    estudiantesRegistrados: 0,
    estudiantesInscritos: 0,
    totalInscritos: 0,
    ordenesPagadas: 0,
    ordenesPendientes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  useEffect(() => {
    // Simulación de datos para demostración
    setTimeout(() => {
      const mockData = [
        {
          id: "Órdenes de Pago",
          color: "hsl(240, 70%, 50%)",
          data: [
            { x: "Ene", y: 20 },
            { x: "Feb", y: 25 },
            { x: "Mar", y: 35 },
            { x: "Abr", y: 45 },
            { x: "May", y: 40 },
            { x: "Jun", y: 50 },
          ],
        },
        {
          id: "Pre-inscritos",
          color: "hsl(120, 70%, 50%)",
          data: [
            { x: "Ene", y: 15 },
            { x: "Feb", y: 20 },
            { x: "Mar", y: 30 },
            { x: "Abr", y: 40 },
            { x: "May", y: 35 },
            { x: "Jun", y: 45 },
          ],
        },
        {
          id: "Inscritos Verificados",
          color: "hsl(40, 70%, 50%)",
          data: [
            { x: "Ene", y: 10 },
            { x: "Feb", y: 15 },
            { x: "Mar", y: 25 },
            { x: "Abr", y: 30 },
            { x: "May", y: 25 },
            { x: "Jun", y: 35 },
          ],
        },
      ];
      
      setChartData(mockData);
      
      setStats({
        ordenesPago: 215,
        estudiantesRegistrados: 185,
        estudiantesInscritos: 165,
        totalInscritos: 165,
        ordenesPagadas: 165, 
        ordenesPendientes: 50, 
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen transition-colors duration-200`}>
    <div className="container mx-auto px-4 py-8">
      <div className="relative flex flex-col items-center mb-6">
        <div className="text-center mb-4">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-2`}>Panel de Administración</h1>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Estadísticas de la O! Sansi 2025</p>
        </div>
        <div className="absolute right-0 top-0">
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
        
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Órdenes de Pago" 
            value={stats.ordenesPago} 
            icon={<FaFileInvoiceDollar />} 
            bgColor="bg-blue-50"
            textColor="text-blue-600"
            darkMode={darkMode}
          />
          <StatCard 
            title="Pre-inscritos" 
            value={stats.estudiantesRegistrados} 
            icon={<FaUsers />} 
            bgColor="bg-green-50"
            textColor="text-green-600"
            darkMode={darkMode}
          />
          <StatCard 
            title="Inscripciones Verificadas" 
            value={stats.estudiantesInscritos} 
            icon={<FaCheckCircle />} 
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
            darkMode={darkMode}
          />
          <StatCard 
            title="Total Competidores" 
            value={stats.totalInscritos} 
            icon={<FaUserGraduate />} 
            bgColor="bg-purple-50"
            textColor="text-purple-600"
            darkMode={darkMode}
          />
        </div>
        
         {/* Sección de gráfico y órdenes recientes */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de líneas - ocupa 2/3 del espacio en pantallas grandes */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 lg:col-span-2`}>
            <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>Evolución de Inscripciones</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>Seguimiento mensual de órdenes de pago, pre-inscripciones e inscripciones verificadas</p>
            <LineChart data={chartData} darkMode={darkMode} />
          </div>
          
          {/* Órdenes recientes - ocupa 1/3 del espacio en pantallas grandes */}
          <div className="lg:col-span-1">
            <OrdenesRecientes darkMode={darkMode} />
          </div>
        </div>

        {/* Sección del gráfico circular de órdenes de pago y mapa de Bolivia */}
        <div className="mb-8 flex justify-center">
        <div className="w-full lg:w-2/3 xl:w-1/2">
          <GraficoCircularPagos 
            pagadas={stats.ordenesPagadas} 
            pendientes={stats.ordenesPendientes} 
            darkMode={darkMode} 
          />
        </div>
      </div>
        
        {/* Sección del mapa de Bolivia y estadísticas por departamento */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}>
          <MapaBolivia darkMode={darkMode} />
        </div>
        
        {/* Sección inferior con información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>Inscripciones por Categoría</h2>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Aquí se mostraría un gráfico adicional con inscripciones por categoría</p>
          </div>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>Últimas Inscripciones</h2>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Aquí se mostraría una tabla con las inscripciones más recientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelDatos;