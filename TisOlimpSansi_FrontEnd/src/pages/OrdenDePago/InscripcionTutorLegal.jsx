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
   
    handleInputChange("profesor", "areaCompetencia", currentArea);
    
    const nuevasAreasConProfesor = [...(areasConProfesor || []), currentArea];
    handleInputChange("profesores", "areasRegistradas", nuevasAreasConProfesor);
    
    handleInputChange("flow", "currentAreaIndex", currentAreaIndex);
    
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
      setCurrentAreaIndex(currentAreaIndex + 1);
    } else {
      setShowModal(false);

      handleInputChange("flow", "pendingAreas", []);
      
      handleInputChange("flow", "skipProfesor", true);
      
      handleInputChange("flow", "redirectToProfesor", false);
      console.log("Se ha configurado skipProfesor a true");
      handleNext();
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Tutor Legal
          </h2>
          <p className="text-sm text-gray-600">
            Estos datos corresponden al representante legal del estudiante.
          </p>
        </div>

        {/* Selección de Rol */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-5 mt-2">
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="flex items-center gap-2">
                <FaUser className="text-black" /> Apellido Paterno
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Número de Teléfono/Celular"
              value={formData.legal?.telefono || ""}
              onChange={(e) => handleInputChange("legal","telefono", e.target.value)}
              maxLength="8"
            />
          </div>
        </div>

        {/* Botones de Navegación */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            type="button"
            className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-gray-500 hover:-translate-y-1 hover:scale-105 hover:bg-gray-600"
            onClick={handleBack}
          >
            Atrás
          </button>
          <button
            type="button"
            className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
            onClick={handleNextWithModal}
          >
            Siguiente
          </button>
        </div>
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
