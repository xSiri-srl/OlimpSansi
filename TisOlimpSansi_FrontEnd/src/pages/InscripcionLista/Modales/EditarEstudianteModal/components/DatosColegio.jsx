import React, { useState, useEffect } from "react";
import { FaSchool, FaBuilding, FaMapMarkedAlt } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../../../../utils/api";

const DatosColegio = ({
  estudianteData,
  handleChange,
  handleDepartamentoChange,
  mostrarCampo,
  tieneError,
  campoEditable,
  errores,
}) => {
  const [colegiosData, setColegiosData] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);

  useEffect(() => {
    axios
      .post(`${API_URL}/api/colegios/filtro`, {})
      .then((res) => {
        setColegiosData(res.data);
        const departamentosUnicos = [
          ...new Set(res.data.map((c) => c.departamento)),
        ];
        setDepartamentosList(departamentosUnicos);
      })
      .catch((err) => console.error("Error al cargar colegios", err));
  }, []);

  useEffect(() => {
    if (estudianteData?.colegio?.departamento) {
      const distritos = colegiosData
        .filter((c) => c.departamento === estudianteData.colegio.departamento)
        .map((c) => c.distrito);

      setDistritosList([...new Set(distritos)]);
    }
  }, [estudianteData?.colegio?.departamento, colegiosData]);

  const cursos = [
    "3ro de Primaria",
    "4to de Primaria",
    "5to de Primaria",
    "6to de Primaria",
    "1ro de Secundaria",
    "2do de Secundaria",
    "3ro de Secundaria",
    "4to de Secundaria",
    "5to de Secundaria",
    "6to de Secundaria",
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">
        DATOS DE LA UNIDAD EDUCATIVA
      </h4>

      {mostrarCampo("nombre_colegio") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaSchool /> Nombre de la Unidad Educativa 
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${
              tieneError("nombre_colegio") ? "border-red-500" : ""
            } ${!campoEditable("nombre_colegio") ? "bg-gray-100" : ""}`}
            value={estudianteData.colegio?.nombre_colegio || ""}
            onChange={(e) =>
              handleChange(
                "colegio",
                "nombre_colegio",
                e.target.value.toUpperCase()
              )
            }
            readOnly={!campoEditable("nombre_colegio")}
          />
          {tieneError("nombre_colegio") && (
            <p className="text-red-500 text-xs mt-1">
              {errores.nombre_colegio}
            </p>
          )}
        </div>
      )}

      {mostrarCampo("curso") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaBuilding /> Curso 
          </label>
          <select
            className={`mt-1 p-2 w-full border rounded-md ${
              tieneError("curso") ? "border-red-500" : ""
            } ${!campoEditable("curso") ? "bg-gray-100" : ""}`}
            value={estudianteData.colegio?.curso || ""}
            onChange={(e) => handleChange("colegio", "curso", e.target.value)}
            disabled={!campoEditable("curso")}
          >
            <option value="">Seleccione un Curso</option>
            {cursos.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>
          {tieneError("curso") && (
            <p className="text-red-500 text-xs mt-1">{errores.curso}</p>
          )}
        </div>
      )}

      {mostrarCampo("departamento") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaMapMarkedAlt /> Departamento
          </label>
          <select
            className={`mt-1 p-2 w-full border rounded-md ${
              !campoEditable("departamento") ? "bg-gray-100" : ""
            }`}
            value={estudianteData.colegio?.departamento || ""}
            onChange={(e) => handleDepartamentoChange(e.target.value)}
            disabled={!campoEditable("departamento")}
          >
            <option value="">Seleccione un Departamento</option>
            {departamentosList.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
      )}

      {mostrarCampo("distrito") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaMapMarkedAlt /> Distrito
          </label>
          <select
            className={`mt-1 p-2 w-full border rounded-md ${
              !campoEditable("distrito") ? "bg-gray-100" : ""
            }`}
            value={estudianteData.colegio?.distrito || ""}
            onChange={(e) =>
              handleChange("colegio", "distrito", e.target.value)
            }
            disabled={
              !estudianteData.colegio?.departamento ||
              !campoEditable("distrito")
            }
          >
            <option value="">Seleccione un Distrito</option>
            {distritosList.map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DatosColegio;
