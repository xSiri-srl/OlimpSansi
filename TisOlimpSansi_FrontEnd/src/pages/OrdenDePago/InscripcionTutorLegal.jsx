import React, {useState} from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function InscripcionTutorLegal({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const areasSeleccionadas = formData.estudiante?.areasSeleccionadas || [];
  
  // Áreas para las que ya se registró profesor
  const areasConProfesor = formData.profesores?.areasRegistradas || [];

  const handleNextWithModal = () => {
    // Si hay áreas seleccionadas sin profesor, mostrar modal
    if (areasSeleccionadas.length > 0) {
      const areasPendientes = areasSeleccionadas.filter(
        area => !areasConProfesor.includes(area)
      );
      
      if (areasPendientes.length > 0) {
        setCurrentAreaIndex(0);
        setShowModal(true);
} else {
  // Si todas las áreas ya tienen profesor o no hay áreas, continuar
  handleNext();
}
} else {
handleNext();
}
};

const handleSiProfesor = () => {
const areasPendientes = areasSeleccionadas.filter(
area => !areasConProfesor.includes(area)
);
const currentArea = areasPendientes[currentAreaIndex];

// Guardar el área para la que se registrará el profesor
handleInputChange("profesor", "areaCompetencia", currentArea);

// Actualizar las áreas con profesor registrado
const nuevasAreasConProfesor = [...(areasConProfesor || []), currentArea];
handleInputChange("profesores", "areasRegistradas", nuevasAreasConProfesor);

setShowModal(false);

      // Redirigir a la pantalla de inscripción de tutor académico
    // Esto requerirá una modificación en ProcesoRegistro.jsx para manejar este salto
    handleInputChange("flow", "redirectToProfesor", true);
    handleNext();
  };

  const handleNoProfesor = () => {
    const areasPendientes = areasSeleccionadas.filter(
      area => !areasConProfesor.includes(area)
    );
    
    // Verificar si hay más áreas pendientes
    if (currentAreaIndex < areasPendientes.length - 1) {
      setCurrentAreaIndex(currentAreaIndex + 1);
    } else {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmación</h3>
            <p className="mb-6">
              ¿Cuenta con un profesor/entrenador para el área de {areasSeleccionadas.filter(
                area => !areasConProfesor.includes(area)
              )[currentAreaIndex]}? 
              <br /><br />
              Estos datos se considerarán en caso de ser acreedor de un premio académico.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={handleNoProfesor}
              >
                No, continuar
              </button>
              <button
                className="px-4 py-2 bg-[#4C8EDA] text-white rounded-md hover:bg-[#2e4f96]"
                onClick={handleSiProfesor}
              >
                Sí, registrar profesor de {areasSeleccionadas.filter(
                  area => !areasConProfesor.includes(area)
                )[currentAreaIndex]}
              </button>
              </div>
          </div>
    </div>
  )}
</div>
  );
}