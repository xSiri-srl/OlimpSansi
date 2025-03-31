import React, { useState, useEffect } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ModalConfirmacion from "./modales/modalConfirmacion";
import { useFormData } from "./form-data-context";

export default function IncripcionTutorAcademico({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();

  const areaCompetencia = formData.profesor?.areaCompetencia || "[AREA DE COMPETENCIA]";
  const areasConProfesor = formData.profesores?.areasRegistradas || [];
  const areasRestantes = formData.flow?.pendingAreas || [];

  // Si no hay área de competencia establecida y skipProfesor es true,
  // avanzar automáticamente al siguiente paso
  useEffect(() => {
    if (formData.flow?.skipProfesor === true) {
      // Si no se eligieron tutores académicos, usar los datos del estudiante
      const estudiante = globalData.estudiante || {};
      
      // Crear entradas para tutores académicos basadas en las áreas seleccionadas
      const tutoresAcademicos = (globalData.areas_competencia || []).map(area => ({
        nombre_area: area.nombre_area,
        tutor: {
          nombre: estudiante.nombre,
          apellido_pa: estudiante.apellido_pa,
          apellido_ma: estudiante.apellido_ma,
          ci: estudiante.ci,
          correo: estudiante.correo
        }
      }));
      const updatedData = {
        ...globalData,
        tutores_academicos: tutoresAcademicos
      };
      
      setGlobalData(updatedData);
      console.log("Sin tutores académicos, usando datos del estudiante:", updatedData);
      
      handleNext();
    }
  }, []);

  useEffect(() => {
    if (formData.flow?.showNextAreaModal && areasRestantes.length > 0) {
      setShowModal(true);
      handleInputChange("flow", "showNextAreaModal", false);
    }
  }, [formData.flow?.showNextAreaModal]);

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

  const handleProfesorNext = () => {
    const isApellidoPaternoValid = validateInput(
      formData.profesor?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isApellidoMaternoValid = validateInput(
      formData.profesor?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isNombresValid = validateInput(
      formData.profesor?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isCIValid = validateInput(
      formData.profesor?.ci,
      "ci",
      /^[0-9]*$/
    );
    
    const isCorreoValid = validateEmail(formData.profesor?.correo);
    if (!isApellidoPaternoValid || !isApellidoMaternoValid || 
        !isNombresValid || !isCIValid || !isCorreoValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar si este tutor ya ha sido registrado para prevenir duplicidad
      const tutoresExistentes = globalData.tutores_academicos || [];
      const tutorYaExiste = tutoresExistentes.some(
        t => t.nombre_area === areaCompetencia && 
             t.tutor.ci === formData.profesor?.ci
      );
  
      // Solo agregar el tutor si no existe ya
      if (!tutorYaExiste) {
        const nuevoTutor = {
          nombre_area: areaCompetencia,
          tutor: {
            nombre: formData.profesor?.nombres,
            apellido_pa: formData.profesor?.apellidoPaterno,
            apellido_ma: formData.profesor?.apellidoMaterno,
            ci: formData.profesor?.ci,
            correo: formData.profesor?.correo
          }
        };
  
        const tutoresActualizados = [...tutoresExistentes, nuevoTutor];
        
        const updatedData = {
          ...globalData,
          tutores_academicos: tutoresActualizados
        };
  
        setGlobalData(updatedData);
        console.log("Tutor académico añadido para", areaCompetencia, ":", updatedData);
      } else {
        console.log("Tutor ya registrado, evitando duplicidad:", areaCompetencia);
      }
      
      handleInputChange("profesor", "isComplete", true);
      
      // Marcamos explícitamente que no queremos redirigir de nuevo al formulario de profesor
      handleInputChange("flow", "redirectToProfesor", false);
      
      // Si estamos en el último área, marcar skipProfesor como true para ir directo al paso final
      if (areasRestantes.length === 0) {
        handleInputChange("flow", "skipProfesor", true);
        handleNext(); // Avanzar al siguiente paso directamente
      } else {
        // Mostrar el modal solo si hay más áreas pendientes
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al procesar los datos del tutor académico:", error);
      setErrors({
        general: "Hubo un error al procesar los datos."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSiProfesor = () => {
    const siguienteArea = areasRestantes[0];
    
    handleInputChange("profesor", "areaCompetencia", siguienteArea);
    
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
    const estudiante = globalData.estudiante || {};
    const siguienteArea = areasRestantes[0];
    
    const tutoresExistentes = globalData.tutores_academicos || [];
    
    // Crear el tutor con datos del estudiante
    const tutorEstudiante = {
      nombre_area: siguienteArea,
      tutor: {
        nombre: estudiante.nombre,
        apellido_pa: estudiante.apellido_pa,
        apellido_ma: estudiante.apellido_ma,
        ci: estudiante.ci,
        correo: estudiante.correo
      }
    };
    
    // Actualizar el JSON global
    const updatedData = {
      ...globalData,
      tutores_academicos: [...tutoresExistentes, tutorEstudiante]
    };
    
    setGlobalData(updatedData);
    console.log("Usando datos del estudiante como tutor para", siguienteArea, ":", updatedData);
    
    const nuevasAreasPendientes = areasRestantes.slice(1);
    handleInputChange("flow", "pendingAreas", nuevasAreasPendientes);
    
    setShowModal(false);
    
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
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Apellido Materno"
                value={formData.profesor?.apellidoMaterno || ""}
                onChange={(e) =>
                  handleInputChange("profesor","apellidoMaterno", e.target.value)
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
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Nombres"
              value={formData.profesor?.nombres || ""}
              onChange={(e) => 
                handleInputChange("profesor","nombres", e.target.value)
              }
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
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
                handleInputChange("profesor","ci", e.target.value)
              }
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
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Correo Electrónico"
              value={formData.profesor?.correo || ""}
              onChange={(e) => 
                handleInputChange("profesor","correo", e.target.value)
              }
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
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
        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Atrás
          </button>
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
            onClick={handleProfesorNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Siguiente"}
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