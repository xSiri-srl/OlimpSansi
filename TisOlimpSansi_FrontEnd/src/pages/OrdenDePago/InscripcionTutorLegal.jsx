import React, {useState} from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ModalConfirmacion from "./modales/modalConfirmacion";
import axios from "axios";

export default function InscripcionTutorLegal({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const areasSeleccionadas = formData.estudiante?.areasSeleccionadas || [];
  const areasConProfesor = formData.profesores?.areasRegistradas || [];

  const validateInput = (value, fieldName, regex) => {
    if (!value) {
      setErrors(prev => ({ ...prev, [fieldName]: "Campo obligatorio." }));
      return false;
    }
    
    if (regex && !regex.test(value)) {
      setErrors(prev => ({ ...prev, [fieldName]: "Formato inválido." }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: "" }));
    return true;
  };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(email, "correo", emailRegex);
  };

  const handleSubmitAndNext = async () => {

    const isRolValid = validateInput(
      formData.legal?.correoPertenece, 
      "correoPertenece"
    );
    
    const isApellidoPaternoValid = validateInput(
      formData.legal?.apellidoPaterno, 
      "apellidoPaterno", 
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isApellidoMaternoValid = validateInput(
      formData.legal?.apellidoMaterno, 
      "apellidoMaterno", 
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isNombresValid = validateInput(
      formData.legal?.nombres, 
      "nombres", 
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isCIValid = validateInput(
      formData.legal?.ci, 
      "ci", 
      /^[0-9]*$/
    );
    
    const isTelefonoValid = validateInput(
      formData.legal?.telefono, 
      "telefono", 
      /^[0-9]*$/
    );
    
    const isCorreoValid = validateEmail(formData.legal?.correo);
    if (!isRolValid || !isApellidoPaternoValid || !isApellidoMaternoValid || 
        !isNombresValid || !isCIValid || !isTelefonoValid || !isCorreoValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/agregarTutorLegal",
        {
          nombre: formData.legal?.nombres,
          apellido_pa: formData.legal?.apellidoPaterno,
          apellido_ma: formData.legal?.apellidoMaterno,
          ci: formData.legal?.ci,
          complemento: "",
          correo: formData.legal?.correo,
          numero_celular: formData.legal?.telefono,
          tipo: formData.legal?.correoPertenece,
          fecha_registro: new Date().toISOString().split('T')[0]
        }
      );

      console.log("Respuesta del servidor:", response.data);

      if (response.data.status === 200) {
        if (response.data.data?.id) {
          handleInputChange("legal", "id", response.data.data.id);
        }
        
        if (areasSeleccionadas.length > 0) {
          handleInputChange("flow", "pendingAreas", [...areasSeleccionadas]);
          setCurrentAreaIndex(0);
          setShowModal(true);
        } else {
          handleNext();
        }
      } else {
        setErrors({ general: "Error al guardar los datos. Intente nuevamente." });
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setErrors({ 
        general: error.response?.data?.message || "Error al comunicarse con el servidor." 
      });
    } finally {
      setIsSubmitting(false);
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
          <h3 className="text-md font-semibold mb-2">Rol del Tutor</h3>
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
          {errors.correoPertenece && (
            <p className="text-red-500 text-sm text-center mt-2">{errors.correoPertenece}</p>
          )}
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
              {errors.apellidoPaterno && (
                <p className="text-red-500 text-sm mt-1">{errors.apellidoPaterno}</p>
              )}
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
              {errors.apellidoMaterno && (
                <p className="text-red-500 text-sm mt-1">{errors.apellidoMaterno}</p>
              )}
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
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
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
            {errors.ci && (
              <p className="text-red-500 text-sm mt-1">{errors.ci}</p>
            )}
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
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
            )}
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
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>
        </div>

        {/* Mensaje de error general */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {errors.general}
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            type="button"
            className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-gray-500 hover:-translate-y-1 hover:scale-105 hover:bg-gray-600"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Atrás
          </button>
          <button
            type="button"
            className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
            onClick={handleSubmitAndNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Siguiente"}
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