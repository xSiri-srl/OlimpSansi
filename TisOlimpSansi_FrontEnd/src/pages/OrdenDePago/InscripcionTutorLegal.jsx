import React, { useState } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ModalConfirmacion from "./modales/ModalConfirmacion";
import { useFormData } from "./form-data-context";
import { TextField, RadioGroupField } from "./components/FormComponents";
import { useFormValidation } from "./hooks/useFormValidation";

export default function InscripcionTutorLegal({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();
  const { errors, validateInput, validateEmailField, clearError, setErrors } = useFormValidation();

  const areasSeleccionadas = formData.estudiante?.areasSeleccionadas || [];
  const areasConProfesor = formData.profesores?.areasRegistradas || [];

  // Roles disponibles para el tutor legal
  const rolesDisponibles = ["Padre", "Madre", "Tutor Legal"];

  const handleSubmitAndNext = async () => {
    // Validar todos los campos
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

    const isCorreoValid = validateEmailField(
      formData.legal?.correo,
      "correo"
    );

    if (
      !isRolValid ||
      !isApellidoPaternoValid ||
      !isApellidoMaternoValid ||
      !isNombresValid ||
      !isCIValid ||
      !isTelefonoValid ||
      !isCorreoValid
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Actualizar datos en el objeto JSON global
      const updatedData = {
        ...globalData,
        tutor_legal: {
          nombre: formData.legal?.nombres,
          apellido_pa: formData.legal?.apellidoPaterno,
          apellido_ma: formData.legal?.apellidoMaterno,
          ci: formData.legal?.ci,
          correo: formData.legal?.correo,
          numero_celular: formData.legal?.telefono,
          tipo: formData.legal?.correoPertenece,
        },
      };

      // Guardar en el contexto global
      setGlobalData(updatedData);

      console.log("Datos del tutor legal actualizados en JSON:", updatedData);

      // Marcar como completo
      handleInputChange("legal", "isComplete", true);
      
      // Si hay áreas seleccionadas, mostrar modal para gestión de profesores
      if (areasSeleccionadas.length > 0) {
        handleInputChange("flow", "pendingAreas", [...areasSeleccionadas]);
        setCurrentAreaIndex(0);
        setShowModal(true);
      } else {
        handleNext();
      }
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      setErrors({
        general: "Hubo un error al procesar los datos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejador para el caso en que el usuario quiere registrar un profesor
  const handleSiProfesor = () => {
    const currentArea = areasSeleccionadas[currentAreaIndex];

    // Configurar para el registro del profesor
    handleInputChange("profesor", "areaCompetencia", currentArea);

    // Actualizar áreas que ya tienen profesor asignado
    const nuevasAreasConProfesor = [...(areasConProfesor || []), currentArea];
    handleInputChange("profesores", "areasRegistradas", nuevasAreasConProfesor);

    // Guardar el índice actual 
    handleInputChange("flow", "currentAreaIndex", currentAreaIndex);

    // Gestionar áreas pendientes
    if (currentAreaIndex < areasSeleccionadas.length - 1) {
      const areasRestantes = areasSeleccionadas.filter(
        (area, idx) =>
          idx > currentAreaIndex && !nuevasAreasConProfesor.includes(area)
      );
      handleInputChange("flow", "pendingAreas", areasRestantes);
    } else {
      handleInputChange("flow", "pendingAreas", []);
    }

    // Cerrar modal y redirigir
    setShowModal(false);
    handleInputChange("flow", "redirectToProfesor", true);
    handleNext();
  };

  // Manejador para el caso en que el estudiante será su propio tutor académico
  const handleNoProfesor = () => {
    // Obtener el área actual
    const currentArea = areasSeleccionadas[currentAreaIndex];
    const estudiante = globalData.estudiante || {};
    
    // Usar al estudiante como tutor para esta área
    const tutorEstudiante = {
      nombre_area: currentArea,
      tutor: {
        nombre: estudiante.nombre,
        apellido_pa: estudiante.apellido_pa,
        apellido_ma: estudiante.apellido_ma,
        ci: estudiante.ci,
        correo: estudiante.correo,
      },
    };
    
    // Actualizar datos globales
    const tutoresExistentes = globalData.tutores_academicos || [];
    const updatedData = {
      ...globalData,
      tutores_academicos: [...tutoresExistentes, tutorEstudiante],
    };
    
    setGlobalData(updatedData);
    console.log(
      "Usando datos del estudiante como tutor para",
      currentArea,
      ":",
      updatedData
    );

    if (currentAreaIndex < areasSeleccionadas.length - 1) {
      // Avanzar al siguiente área
      setCurrentAreaIndex(currentAreaIndex + 1);
    } else {
      // No hay más áreas, terminar el proceso
      setShowModal(false);
      handleInputChange("flow", "pendingAreas", []);
      handleInputChange("flow", "skipProfesor", true);
      handleInputChange("flow", "redirectToProfesor", false);
      handleNext();
    }
  };

  // Verificar si el formulario es válido para habilitar el botón
  const isFormValid =
    formData.legal?.apellidoPaterno &&
    formData.legal?.apellidoMaterno &&
    formData.legal?.nombres &&
    formData.legal?.ci &&
    formData.legal?.correo &&
    formData.legal?.telefono &&
    formData.legal?.correoPertenece &&
    formData.legal?.ci.length >= 7 &&
    formData.legal?.nombres.length >= 2 &&
    formData.legal?.apellidoMaterno.length >= 2 &&
    formData.legal?.apellidoPaterno.length >= 2 &&
    formData.legal?.telefono.length == 8 &&
    formData.legal?.nombres.split(" ").length <= 2 &&
    !isSubmitting;

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
        <div className="mb-6 text-center">
          <h3 className="text-md font-semibold mb-2">Rol del Tutor</h3>
          <RadioGroupField
            name="correoPertenece"
            options={rolesDisponibles}
            value={formData.legal?.correoPertenece || ""}
            className="justify-center"
            onChange={(value) =>
              handleInputChange("legal", "correoPertenece", value)
            }
            error={errors.correoPertenece}
          />
        </div>

        {/* Formulario de Datos del Tutor */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <TextField
                label="Apellido Paterno"
                icon={<FaUser className="text-black" />}
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.legal?.apellidoPaterno || ""}
                onChange={(value) =>
                  handleInputChange("legal", "apellidoPaterno", value)
                }
                error={errors.apellidoPaterno}
                maxLength="15"
                regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
                transform={(value) => value.toUpperCase()}
              />
            </div>
            <div className="w-full">
              <TextField
                label="Apellido Materno"
                icon={<FaUser className="text-black" />}
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.legal?.apellidoMaterno || ""}
                onChange={(value) =>
                  handleInputChange("legal", "apellidoMaterno", value)
                }
                error={errors.apellidoMaterno}
                maxLength="15"
                regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
                transform={(value) => value.toUpperCase()}
              />
            </div>
          </div>

          <TextField
            label="Nombres"
            icon={<FaUser className="text-black" />}
            name="nombres"
            placeholder="Nombres"
            value={formData.legal?.nombres || ""}
            onChange={(value) =>
              handleInputChange("legal", "nombres", value)
            }
            error={errors.nombres}
            maxLength="30"
            regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/}
            transform={(value) => value.toUpperCase()}
          />

          <TextField
            label="Carnet de Identidad"
            icon={<FaIdCard className="text-black" />}
            name="ci"
            placeholder="Número de Carnet de Identidad"
            value={formData.legal?.ci || ""}
            onChange={(value) =>
              handleInputChange("legal", "ci", value)
            }
            error={errors.ci}
            maxLength="8"
            regex={/^[0-9]*$/}
          />

          <TextField
            label="Correo Electrónico"
            icon={<FaEnvelope className="text-black" />}
            name="correo"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.legal?.correo || ""}
            onChange={(value) =>
              handleInputChange("legal", "correo", value)
            }
            error={errors.correo}
          />

          <TextField
            label="Teléfono/Celular"
            icon={<FaPhoneAlt className="text-black" />}
            name="telefono"
            placeholder="Número de Teléfono/Celular"
            value={formData.legal?.telefono || ""}
            onChange={(value) =>
              handleInputChange("legal", "telefono", value)
            }
            error={errors.telefono}
            maxLength="8"
            regex={/^[0-9]*$/}
          />
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
            onClick={handleSubmitAndNext}
            disabled={!isFormValid}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              isFormValid
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
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