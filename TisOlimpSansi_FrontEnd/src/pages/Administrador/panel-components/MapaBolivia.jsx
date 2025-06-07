import React, { useState, useEffect } from "react";

import { API_URL } from "../../../utils/api";
import axios from "axios";

const boliviaGeoFeatures = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "BOL.LA_PAZ",
      properties: { name: "La Paz" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.COCHABAMBA",
      properties: { name: "Cochabamba" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.SANTA_CRUZ",
      properties: { name: "Santa Cruz" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.ORURO",
      properties: { name: "Oruro" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.POTOSI",
      properties: { name: "Potosí" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.CHUQUISACA",
      properties: { name: "Chuquisaca" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.TARIJA",
      properties: { name: "Tarija" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.BENI",
      properties: { name: "Beni" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      id: "BOL.PANDO",
      properties: { name: "Pando" },
      geometry: { type: "Polygon", coordinates: [] },
    },
  ],
};

const MapaBolivia = ({ darkMode }) => {
  const [inscripcionesPorDepartamento, setInscripcionesPorDepartamento] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipoInscripcion, setTipoInscripcion] = useState("inscritos"); 

  useEffect(() => {
    fetchDepartamentoData();
  }, [tipoInscripcion]); 

  const fetchDepartamentoData = async () => {
    try {
      setLoading(true);

      const departamentos = [
        "La Paz",
        "Cochabamba",
        "Santa Cruz",
        "Oruro",
        "Potosí",
        "Chuquisaca",
        "Tarija",
        "Beni",
        "Pando",
      ];

      const departamentoToId = {
        "La Paz": "BOL.LA_PAZ",
        Cochabamba: "BOL.COCHABAMBA",
        "Santa Cruz": "BOL.SANTA_CRUZ",
        Oruro: "BOL.ORURO",
        Potosí: "BOL.POTOSI",
        Chuquisaca: "BOL.CHUQUISACA",
        Tarija: "BOL.TARIJA",
        Beni: "BOL.BENI",
        Pando: "BOL.PANDO",
      };

      const endpoint =
        tipoInscripcion === "inscritos"
          ? "/api/estudiantes/inscritos/bydepartamento"
          : "/api/estudiantes/preinscritos/bydepartamento";

      const promises = departamentos.map(async (departamento) => {
        const response = await axios.post(`${API_URL}${endpoint}`, {
          departamento,
        });

        return {
          id: departamentoToId[departamento],
          value: response.data.cantidad_estudiantes,
        };
      });

      const resultados = await Promise.all(promises);
      setInscripcionesPorDepartamento(resultados);
    } catch (err) {
      console.error("Error al cargar datos de departamentos:", err);
      setError(
        "No se pudieron cargar los datos de inscripciones por departamento"
      );
    } finally {
      setLoading(false);
    }
  };

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
        <p className={`text-red-500 text-center`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full">
      <div
        className={`${
          darkMode ? "text-white" : "text-gray-800"
        } text-center mb-4`}
      >
        <h3 className="text-xl font-semibold">
          Distribución de Estudiantes por Departamento
        </h3>

        <div className="flex justify-center mt-2 mb-3">
          <div
            className={`inline-flex rounded-md shadow-sm ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            role="group"
          >
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 
                ${
                  tipoInscripcion === "inscritos"
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              onClick={() => setTipoInscripcion("inscritos")}
            >
              Inscritos
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10
                ${
                  tipoInscripcion === "preinscritos"
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              onClick={() => setTipoInscripcion("preinscritos")}
            >
              Pre-inscritos
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {tipoInscripcion === "inscritos"
            ? "(Estudiantes con pago verificado)"
            : "(Estudiantes con orden de pago generada, sin pago verificado)"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 h-[300px]">
        {inscripcionesPorDepartamento.map((dept) => {
          const nombreDep =
            boliviaGeoFeatures.features.find((f) => f.id === dept.id)
              ?.properties?.name || "";

          const maxValue = Math.max(
            ...inscripcionesPorDepartamento.map((d) => d.value),
            1
          );

          const intensity =
            maxValue > 0
              ? Math.min(100, Math.max(20, (dept.value / maxValue) * 100))
              : 20; 

          const colorBase =
            tipoInscripcion === "inscritos"
              ? "rgba(37, 99, 235, " 
              : "rgba(234, 88, 12, "; 

          const bgColor = darkMode
            ? tipoInscripcion === "inscritos"
              ? `rgba(59, 130, 246, ${intensity / 100})`
              : `rgba(249, 115, 22, ${intensity / 100})`
            : colorBase + intensity / 100 + ")";

          return (
            <div
              key={dept.id}
              className={`rounded-lg p-3 flex flex-col justify-center items-center ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } border`}
              style={{ backgroundColor: bgColor }}
            >
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {nombreDep}
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {dept.value}
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {tipoInscripcion === "inscritos"
                  ? "Inscritos"
                  : "Pre-inscritos"}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className={`flex justify-center mt-4 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <div className="flex items-center">
          <div
            className="w-4 h-4"
            style={{
              backgroundColor:
                tipoInscripcion === "inscritos" ? "#DBEAFE" : "#FFEDD5",
            }}
          ></div>
          <span className="mr-3 text-xs">Pocos</span>

          <div
            className="w-4 h-4"
            style={{
              backgroundColor:
                tipoInscripcion === "inscritos" ? "#93C5FD" : "#FED7AA",
            }}
          ></div>
          <span className="mr-3 text-xs">Moderados</span>

          <div
            className="w-4 h-4"
            style={{
              backgroundColor:
                tipoInscripcion === "inscritos" ? "#3B82F6" : "#F97316",
            }}
          ></div>
          <span className="mr-3 text-xs">Muchos</span>

          <div
            className="w-4 h-4"
            style={{
              backgroundColor:
                tipoInscripcion === "inscritos" ? "#1D4ED8" : "#C2410C",
            }}
          ></div>
          <span className="text-xs">Máximos</span>
        </div>
      </div>
    </div>
  );
};

export default MapaBolivia;
