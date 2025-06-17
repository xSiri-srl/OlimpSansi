import React from "react";
import {
  FaSchool,
  FaBuilding,
  FaMapMarkedAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { SelectField } from "../components/FormComponents";

export default function DatosColegioForm({
  formData,
  handleInputChange,
  errors,
  colegioData,
  cursos
}) {
  const CURSOS = cursos;
  const {
    departamentosList,
    distritosList,
    sugerencias,
    mostrarSugerencias,
    busquedaColegio,
    esNuevoColegio,
    sugerenciasRef,
    actualizarSugerencias,
    seleccionarSugerencia,
    limpiarBusquedaColegio
  } = colegioData;

  return (
    <div className="flex flex-col items-center bg-gray-300 p-6 rounded-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 self-center">
        Datos de la Unidad Educativa
      </h3>
      <div className="space-y-4 w-full max-w-md">
        {/* Departamento */}
        <SelectField
          label="Departamento"
          icon={<FaMapMarkedAlt className="text-black" />}
          name="departamentoSeleccionado"
          value={formData.estudiante?.departamentoSeleccionado || ""}
          onChange={(value) => {
            handleInputChange(
              "estudiante",
              "departamentoSeleccionado",
              value
            );
            handleInputChange("estudiante", "distrito", "");
            handleInputChange("estudiante", "colegio", "");
            limpiarBusquedaColegio();
          }}
          options={departamentosList}
          error={errors.departamento}
          placeholder="Seleccione un Departamento"
        />

        {/* Distrito */}
        <SelectField
          label="Distrito"
          icon={<FaMapMarkedAlt className="text-black" />}
          name="distrito"
          value={formData.estudiante?.distrito || ""}
          onChange={(value) => {
            handleInputChange("estudiante", "distrito", value);
            handleInputChange("estudiante", "colegio", "");
            limpiarBusquedaColegio();
          }}
          options={distritosList}
          error={errors.distrito}
          placeholder="Seleccione un Distrito"
          disabled={!formData.estudiante?.departamentoSeleccionado}
        />

        {/* Componente de Autocompletado para colegios */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <FaSchool className="text-black" />
            <label>Unidad Educativa</label>
          </div>

          <div className="relative">
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ingresar nombre de la unidad educativa"
              value={busquedaColegio}
              onChange={(e) => actualizarSugerencias(e.target.value)}
              onFocus={() => {
                if (busquedaColegio.length >= 2)
                  mostrarSugerencias(true);
              }}
              disabled={!formData.estudiante?.distrito}
            />
            {busquedaColegio && (
              <FaTimesCircle
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={limpiarBusquedaColegio}
              />
            )}

            {mostrarSugerencias && (
              <div
                ref={sugerenciasRef}
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
              >
                {sugerencias.length > 0 ? (
                  sugerencias.map((sugerencia, idx) => (
                    <div
                      key={idx}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => seleccionarSugerencia(sugerencia)}
                    >
                      {sugerencia}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">
                    No se encontro ninguna coincidencia, puede registrar una
                    nueva unidad educativa.
                  </div>
                )}
              </div>
            )}
          </div>

          {esNuevoColegio && busquedaColegio.length >= 2 && (
            <p className="text-blue-500 text-sm mt-1">
              Se registrará una nueva unidad educativa con este nombre.
            </p>
          )}

          {errors.colegio && (
            <p className="text-red-500 text-sm mt-1">{errors.colegio}</p>
          )}
        </div>

        <SelectField
          label="Curso"
          icon={<FaBuilding className="text-black" />}
          name="curso"
          value={formData.estudiante?.curso || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "curso", value)
          }
          options={CURSOS}
          error={errors.curso}
          placeholder="Seleccione un Curso"
        />
      </div>
    </div>
  );
}