import React, {useState} from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ModalConfirmacion from "./modales/modalConfirmacion";

export default function InscripcionTutorLegal({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const areasSeleccionadas = formData.estudiante?.areasSeleccionadas || [];
  const areasConProfesor = formData.profesores?.areasRegistradas || [];

  const handleNextWithModal = () => {
    if (areasSeleccionadas.length > 0) {
      // Inicializar áreas pendientes para profesores
      handleInputChange("flow", "pendingAreas", [...areasSeleccionadas]);
      setCurrentAreaIndex(0);
      setShowModal(true);
    } else {
      // Si no hay áreas seleccionadas, continuar
      handleNext();
    }
  };

const handleSiProfesor = () => {
  const currentArea = areasSeleccionadas[currentAreaIndex];
  
  // Guardar el área para la que se registrará el profesor
  handleInputChange("profesor", "areaCompetencia", currentArea);
  
  // Actualizar las áreas con profesor registrado
  const nuevasAreasConProfesor = [...(areasConProfesor || []), currentArea];
  handleInputChange("profesores", "areasRegistradas", nuevasAreasConProfesor);
  
  // Guardar el índice actual y áreas pendientes
  handleInputChange("flow", "currentAreaIndex", currentAreaIndex);
  
  // Si hay una segunda área, la dejamos pendiente
  if (currentAreaIndex < areasSeleccionadas.length - 1) {
    const areasRestantes = areasSeleccionadas.filter((area, idx) => 
      idx > currentAreaIndex && !nuevasAreasConProfesor.includes(area)
    );
    handleInputChange("flow", "pendingAreas", areasRestantes);
  } else {
    handleInputChange("flow", "pendingAreas", []);
    }
    
    setShowModal(false);
    
    // Redirigir a la pantalla de profesor
    handleInputChange("flow", "redirectToProfesor", true);
    handleNext();
  };


const handleNoProfesor = () => {
  if (currentAreaIndex < areasSeleccionadas.length - 1) {
    // Aún hay más áreas, mostrar el siguiente modal
    setCurrentAreaIndex(currentAreaIndex + 1);
  } else {
    // No hay más áreas, ir al siguiente paso
    setShowModal(false);
    handleNext();
  }
};
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Título */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-500">
          Tutor Legal
        </h2>
      </div>

      {/* Selección de Rol */}
      <div>
        <h3 className="text-md font-semibold mb-2">Rol del Tutor</h3>
        <div className="flex flex-row space-x-5 mt-2">
    {["Padre", "Madre", "Tutor Legal"].map((rol) => (
      <label key={rol} className="inline-flex items-center">
        <input
          type="radio"
          name="correoPertenece"
          value={rol}
          checked={formData.legal?.correoPertenece === rol}
          onChange={() =>
            handleInputChange("legal", "correoPertenece", rol)
          }
          className="mr-2"
        />
        {rol}
      </label>
    ))}
  </div>
      </div>

      {/* Formulario de Datos del Tutor */}
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
              value={formData.legal?.apellidoPaterno || ""}
              onChange={(e) =>
              handleInputChange("legal","apellidoPaterno", e.target.value)
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
              value={formData.legal?.apellidoMaterno || ""}
              onChange={(e) =>
              handleInputChange("legal","apellidoMaterno", e.target.value)
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
            value={formData.legal?.nombres || ""}
            onChange={(e) => 
              handleInputChange("legal","nombres", e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <FaIdCard className="text-black" /> CI
          </label>
          <input
            type="text"
            name="ci"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Número de Carnet de Identidad"
            value={formData.legal?.ci || ""}
            onChange={(e) => 
            handleInputChange("legal","ci", e.target.value)}
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
            value={formData.legal?.correo || ""}
            onChange={(e) => handleInputChange("legal","correo", e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <FaPhoneAlt className="text-black" /> Teléfono/Celular
          </label>
          <input
            type="text"
            name="telefono"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Número de Teléfono/Celular"
            value={formData.legal?.telefono || ""}
            onChange={(e) => handleInputChange("legal","telefono", e.target.value)}
            maxLength="8"
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
          onClick={handleNextWithModal}
        >
          Siguiente
        </button>
      </div>
      {/* Modal de confirmación */}
      {showModal && (
        <ModalConfirmacion
          area={areasSeleccionadas[currentAreaIndex]}
          onConfirm={handleSiProfesor}
          onCancel={handleNoProfesor}
        />
      )}
    </div>
  );
}
