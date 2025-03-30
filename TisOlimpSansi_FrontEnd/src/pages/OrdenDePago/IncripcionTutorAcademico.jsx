import React, {useState, useEffect } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ModalConfirmacion from "./modales/modalConfirmacion";

export default function IncripcionTutorAcademico({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const areaCompetencia = formData.profesor?.areaCompetencia || "[AREA DE COMPETENCIA]";
  const areasConProfesor = formData.profesores?.areasRegistradas || [];
  const areasRestantes = formData.flow?.pendingAreas || [];
    // Si no hay área de competencia establecida y skipProfesor es true,
  // avanzar automáticamente al siguiente paso
  useEffect(() => {
    if (formData.flow?.skipProfesor === true) {
      handleNext();
    }
  }, []);
  // mostrar modal del siguiente área
  useEffect(() => {
    if (formData.flow?.showNextAreaModal && areasRestantes.length > 0) {
      setShowModal(true);
      handleInputChange("flow", "showNextAreaModal", false);
    }
  }, [formData.flow?.showNextAreaModal]);

  const handleProfesorNext = () => {
    handleInputChange("flow", "redirectToProfesor", false);
    if (areasRestantes.length > 0) {
      setShowModal(true);
    } else {
      // No hay más áreas, ir al paso final
      handleNext();
    }
  };
  const handleSiProfesor = () => {
    const siguienteArea = areasRestantes[0];
    
    // Actualizar el área del profesor
    handleInputChange("profesor", "areaCompetencia", siguienteArea);
    
    // Limpiar los datos del formulario para el nuevo profesor
    handleInputChange("profesor", "apellidoPaterno", "");
    handleInputChange("profesor", "apellidoMaterno", "");
    handleInputChange("profesor", "nombres", "");
    handleInputChange("profesor", "ci", "");
    handleInputChange("profesor", "correo", "");

    const nuevasAreasConProfesor = [...areasConProfesor, siguienteArea];
    handleInputChange("profesores", "areasRegistradas", nuevasAreasConProfesor);
    
    const nuevasAreasPendientes = areasRestantes.filter(area => area !== siguienteArea);
    handleInputChange("flow", "pendingAreas", nuevasAreasPendientes);
    
    setShowModal(false);

    handleInputChange("flow", "redirectToProfesor", true);
    handleNext();
  };

  const handleNoProfesor = () => {
    const nuevasAreasPendientes = areasRestantes.slice(1);
    handleInputChange("flow", "pendingAreas", nuevasAreasPendientes);
    
    setShowModal(false);
    // Si no hay más áreas pendientes, ir al paso final
    if (nuevasAreasPendientes.length === 0) {
      handleNext();
    } else {
      // Mostrar el siguiente modal
      setShowModal(true);
    }
  };
  
  return (
  <div className="flex flex-col items-center">
    <div className="w-full max-w-2xl">
      {/* Título */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-500">
          Profesor de {areaCompetencia}
        </h2>
        <p className="text-sm text-gray-600">
          Por favor, completa los datos del tutor académico.
        </p>
      </div>

      {/* Datos del profesor */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-full">
            <label className="flex items-center gap-2">
              <FaUser className="text-black" /> Apellido Paterno
            </label>
            <input
              type="text"
              name="apellidoPaterno"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Apellido Paterno"
              value={formData.profesor?.apellidoPaterno || ""}
              onChange={(e) =>
                handleInputChange("profesor","apellidoPaterno", e.target.value)
              }
            />
          </div>

          <div className="w-full">
            <label className="flex items-center gap-2">
              <FaUser className="text-black" /> Apellido Materno
            </label>
            <input
              type="text"
              name="apellidoMaterno"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Apellido Materno"
              value={formData.profesor?.apellidoMaterno || ""}
              onChange={(e) =>
                handleInputChange("profesor","apellidoMaterno", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <FaUser className="text-black" /> Nombres
          </label>
          <input
            type="text"
            name="nombres"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Nombres"
            value={formData.profesor?.nombres || ""}
            onChange={(e) => 
            handleInputChange("profesor","nombres", e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <FaIdCard className="text-black" /> Carnet de Identidad
          </label>
          <input
            type="text"
            name="ci"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Número de Carnet de Identidad"
            value={formData.profesor?.ci || ""}
            onChange={(e) => 
            handleInputChange("profesor","ci", e.target.value)}
            maxLength="8"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <FaEnvelope className="text-black" /> Correo Electrónico
          </label>
          <input
            type="email"
            name="correo"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Correo Electrónico"
            value={formData.profesor?.correo || ""}
            onChange={(e) => 
            handleInputChange("profesor","correo", e.target.value)}
          />
        </div>

      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          onClick={handleBack}
        >
          Atrás
        </button>
        <button
          type="button"
          className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          onClick={handleProfesorNext}
        >
          Siguiente
        </button>
      </div>
            {/* Modal para siguiente área */}
            {showModal && (
        <ModalConfirmacion
          area={areasRestantes[0]}
          onConfirm={handleSiProfesor}
          onCancel={handleNoProfesor}
        />
      )}
    </div>
  </div>
  );
}