// src/components/panel-components/LineChart.jsx

import React from "react";
import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data, darkMode, olimpiadaSeleccionada }) => {
  // 1) Ordenar los puntos por x (mes) en cada serie
  const fixedData = Array.isArray(data)
    ? data.map((serie) => ({
        ...serie,
        data: serie.data
          .slice()
          .sort((a, b) => Number(a.x) - Number(b.x)),
      }))
    : [];

  // 2) Validaciones
  if (!olimpiadaSeleccionada) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Selecciona una olimpiada para ver los datos
        </p>
      </div>
    );
  }
  if (fixedData.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          No hay datos disponibles para {olimpiadaSeleccionada.titulo}
        </p>
      </div>
    );
  }

  // 3) Render del gráfico
  return (
    <div className="h-[400px] w-full">
      <ResponsiveLine
        data={fixedData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        curve="monotoneX"        // curva fija
        animate={false}          // sin animaciones variables

        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Mes",
          legendPosition: "middle",
          tickTextColor: darkMode ? "#fff" : "#333",
          legendTextColor: darkMode ? "#fff" : "#333",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Cantidad",
          legendPosition: "middle",
          tickTextColor: darkMode ? "#fff" : "#333",
          legendTextColor: darkMode ? "#fff" : "#333",
        }}

        colors={{ scheme: "category10" }}
        pointSize={8}
        useMesh={true}

        theme={{
          axis: {
            ticks: {
              line: { stroke: darkMode ? "#fff" : "#777" },
              text: { fill: darkMode ? "#fff" : "#333" },
            },
            legend: { text: { fill: darkMode ? "#fff" : "#333" } },
          },
          tooltip: {
            container: {
              background: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#333",
            },
          },
        }}

        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 90,
            itemHeight: 20,
            symbolSize: 12,
            itemTextColor: darkMode ? "#fff" : "#333",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: darkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.03)",
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

export default LineChart;
