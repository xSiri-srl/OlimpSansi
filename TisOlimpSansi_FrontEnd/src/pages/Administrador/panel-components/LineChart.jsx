import React from 'react';
import { ResponsiveLine } from "@nivo/line";

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
        colors={{ scheme: "category10" }}
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
              },
            },
            ticks: {
              line: {
                stroke: darkMode ? "#ffffff" : "#777777",
              },
              text: {
                fill: darkMode ? "#ffffff" : "#333333",
              },
            },
            legend: {
              text: {
                fill: darkMode ? "#ffffff" : "#333333",
              },
            },
          },
          legends: {
            text: {
              fill: darkMode ? "#ffffff" : "#333333",
            },
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
                  itemBackground: darkMode
                    ? "rgba(255, 255, 255, .1)"
                    : "rgba(0, 0, 0, .03)",
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