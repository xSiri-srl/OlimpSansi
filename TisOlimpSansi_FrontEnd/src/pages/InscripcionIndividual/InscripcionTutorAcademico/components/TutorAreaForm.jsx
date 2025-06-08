import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import TutorFormFields from "./TutorFormFields";

export default function TutorAreaForm({
  area,
  index,
  tutorData,
  isExpanded,
  errors,
  isSearching,
  tutorFound,
  onCheckboxChange,
  onFormChange,
  onToggleArea,
}) {
  return (
    <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
      <div
        className="bg-gray-100 p-4 flex items-center justify-between cursor-pointer"
        onClick={() => onToggleArea(area.nombre_area)}
      >
        <div className="flex-1">
          <label
            htmlFor={`checkbox-${index}`}
            className="text-lg font-medium cursor-pointer"
          >
            ¿Desea registrar un tutor académico para {area.nombre_area}?
          </label>
        </div>
        <div className="flex items-center">
          {tutorData?.seleccionado &&
            (isExpanded ? (
              <FaChevronUp className="text-gray-500 mr-3" />
            ) : (
              <FaChevronDown className="text-gray-500 mr-3" />
            ))}
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={tutorData?.seleccionado || false}
            onChange={() => onCheckboxChange(area.nombre_area)}
            className="h-5 w-5"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {tutorData?.seleccionado && isExpanded && (
        <div className="p-6 border-t bg-white">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-500">
              Profesor de {area.nombre_area}
            </h3>
            <p className="text-sm text-gray-600">
              Por favor, completa los datos del tutor académico.
            </p>
          </div>

          <TutorFormFields
            area={area.nombre_area}
            tutorData={tutorData}
            errors={errors}
            isSearching={isSearching}
            tutorFound={tutorFound}
            onFormChange={onFormChange}
          />
        </div>
      )}
    </div>
  );
}