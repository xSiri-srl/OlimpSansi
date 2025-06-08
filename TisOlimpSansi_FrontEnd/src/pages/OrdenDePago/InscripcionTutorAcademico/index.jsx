import React from "react";
import { useFormData } from "../form-data-context";
import { useTutoresAcademicos } from "./hooks/useTutoresAcademicos";
import TutorAreaForm from "./components/TutorAreaForm";
import NavigationButtons from "./components/NavigationButtons";

export default function InscripcionTutorAcademico({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const { globalData } = useFormData();
  const {
    tutoresPorArea,
    expandedAreas,
    errors,
    isSubmitting,
    searchingTutores,
    tutoresEncontrados,
    handleCheckboxChange,
    handleFormChange,
    toggleArea,
    handleSubmit,
    isFormValid,
  } = useTutoresAcademicos({ handleInputChange, handleNext });

  const areasCompetencia = globalData.areas_competencia || [];

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Registro de Tutores Académicos
          </h2>
          <p className="text-center text-gray-600">
            Seleccione las áreas para las que desea registrar un tutor académico
            diferente al estudiante. Si no selecciona ninguna, no se registrarán
            tutores académicos para estas áreas.
          </p>
        </div>

        {areasCompetencia.map((area, index) => (
          <TutorAreaForm
            key={index}
            area={area}
            index={index}
            tutorData={tutoresPorArea[area.nombre_area]}
            isExpanded={expandedAreas[area.nombre_area]}
            errors={errors}
            isSearching={searchingTutores[area.nombre_area]}
            tutorFound={tutoresEncontrados[area.nombre_area]}
            onCheckboxChange={handleCheckboxChange}
            onFormChange={handleFormChange}
            onToggleArea={toggleArea}
          />
        ))}

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {errors.general}
          </div>
        )}

        <NavigationButtons
          onBack={handleBack}
          onNext={handleSubmit}
          isSubmitting={isSubmitting}
          isFormValid={isFormValid()}
        />
      </div>
    </div>
  );
}