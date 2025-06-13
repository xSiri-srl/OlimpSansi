import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const GraficoCircularPagos = ({ pagadas, pendientes, darkMode }) => {
  const total = pagadas + pendientes;
  const porcentajePagadas = total > 0 ? Math.round((pagadas / total) * 100) : 0;
  
  const data = [
    {
      id: 'Pagadas',
      label: 'Pagadas',
      value: pagadas,
      color: darkMode ? '#60A5FA' : '#60A5FA' 
    },
    {
      id: 'Pendientes',
      label: 'Pendientes',
      value: pendientes,
      color: darkMode ? '#3B82F6' : '#3B82F6' 
    }
  ];

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
      <div className="flex flex-col items-center mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-2`}>
          Estado de Órdenes de Pago
        </h2>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-center`}>
          El <span className="font-bold text-blue-500">{porcentajePagadas}%</span> de las órdenes de pago han sido pagadas.
        </p>
      </div>
      
      <div className="h-[300px]">
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }} 
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={darkMode ? "#E5E7EB" : "#4B5563"}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          theme={{
            labels: {
              text: {
                fill: darkMode ? '#E5E7EB' : '#4B5563',
              }
            },
            legends: {
              text: {
                fill: darkMode ? '#E5E7EB' : '#4B5563',
              }
            },
            tooltip: {
              container: {
                background: darkMode ? '#374151' : '#FFFFFF',
                color: darkMode ? '#E5E7EB' : '#4B5563',
              }
            }
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 20,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: darkMode ? '#E5E7EB' : '#4B5563',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: darkMode ? '#FFFFFF' : '#000000'
                  }
                }
              ],
              data: [
                {
                  id: 'Pagadas',
                  label: `${pagadas} Pagadas`,
                  color: '#60A5FA'
                },
                {
                  id: 'Pendientes',
                  label: `${pendientes} Pendientes`,
                  color: '#3B82F6'
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default GraficoCircularPagos;