import React, { useState } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useFormData } from "./form-data-context";
import { TextField, RadioGroupField } from "./components/FormComponents";
import { useFormValidation } from "./hooks/useFormValidation";
import { API_URL } from "../../../utils/api";
import axios from "axios";

export default function InscripcionTutorLegal({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();
  const { errors, validateInput, validateEmailField, setErrors } =
    useFormValidation();
  const validateAllFields = () => {
    validateInput(formData.legal?.correoPertenece, "correoPertenece");
    validateInput(
      formData.legal?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    validateInput(
      formData.legal?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    validateInput(
      formData.legal?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    validateInput(formData.legal?.ci, "ci", /^[0-9]*$/);
    validateInput(formData.legal?.telefono, "telefono", /^[0-9]*$/);
    validateEmailField(formData.legal?.correo, "correo");
  };
  const [isSearching, setIsSearching] = useState(false);
  const [tutorLegalFound, setTutorLegalFound] = useState(false);
  const rolesDisponibles = ["Padre", "Madre", "Tutor Legal"];
  const buscarTutorLegalPorCI = async (ci) => {
    if (ci?.length >= 7) {
      setIsSearching(true);

      try {
        const response = await axios.get(`${API_URL}/api/buscar-tutor-legal/${ci}`);

        if (response.data.found) {
          const tutorLegal = response.data.tutorLegal;

          handleInputChange(
            "legal",
            "nombres",
            String(tutorLegal.nombre || "")
          );
          handleInputChange(
            "legal",
            "apellidoPaterno",
            String(tutorLegal.apellido_pa || "")
          );
          handleInputChange(
            "legal",
            "apellidoMaterno",
            String(tutorLegal.apellido_ma || "")
          );
          handleInputChange("legal", "correo", String(tutorLegal.correo || ""));
          handleInputChange(
            "legal",
            "telefono",
            String(tutorLegal.numero_celular || "")
          );

          const rol = tutorLegal.tipo || "Tutor Legal";
          handleInputChange("legal", "correoPertenece", rol);

          setErrors({});

          setTutorLegalFound(true);

        } else {
          setTutorLegalFound(false);
        }
      } catch (error) {
        console.error("Error al buscar tutor legal:", error);
        setErrors((prev) => ({
          ...prev,
          ci: "Error al buscar en la base de datos. Intente de nuevo.",
        }));
      } finally {
        setIsSearching(false);
      }
    }
  };
  const handleCIChange = (value) => {
    handleInputChange("legal", "ci", value);
    setErrors((prev) => ({ ...prev, ci: "" }));

    if (value.length >= 7 && value.length <= 8) {
      buscarTutorLegalPorCI(value);
    } else if (value.length < 7) {
      setTutorLegalFound(false);
    }
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

    const isCIValid = validateInput(formData.legal?.ci, "ci", /^[0-9]*$/);

    const isTelefonoValid = validateInput(
      formData.legal?.telefono,
      "telefono",
      /^[0-9]*$/
    );

    const isCorreoValid = validateEmailField(formData.legal?.correo, "correo");

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

      setGlobalData(updatedData);

      handleInputChange("legal", "isComplete", true);
      handleNext();
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      setErrors({
        general: "Hubo un error al procesar los datos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.legal?.apellidoPaterno?.trim() &&
    formData.legal?.apellidoMaterno?.trim() &&
    formData.legal?.nombres?.trim() &&
    formData.legal?.ci?.trim() &&
    formData.legal?.correo?.trim() &&
    formData.legal?.telefono?.trim() &&
    formData.legal?.correoPertenece?.trim() &&
    formData.legal?.ci?.length >= 7 &&
    formData.legal?.nombres?.length >= 2 &&
    formData.legal?.apellidoMaterno?.length >= 2 &&
    formData.legal?.apellidoPaterno?.length >= 2 &&
    formData.legal?.telefono?.length >= 7 && 
    !isSubmitting;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Tutor Legal
          </h2>
          <p className="text-sm text-gray-600">
            Estos datos corresponden al representante legal del estudiante.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <TextField
              label="Carnet de Identidad"
              icon={<FaIdCard className="text-black" />}
              name="ci"
              placeholder="Número de Carnet de Identidad"
              value={formData.legal?.ci || ""}
              onChange={handleCIChange}
              error={errors.ci}
              maxLength="8"
              regex={/^[0-9]*$/}
            />
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              {isSearching && (
                <span className="text-blue-500 text-sm">Buscando...</span>
              )}
              {tutorLegalFound && (
                <span className="text-green-500 text-sm">✓ Encontrado</span>
              )}
            </div>
          </div>

          {tutorLegalFound && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Tutor legal encontrado en el sistema. Los datos han sido cargados
              automáticamente.
            </div>
          )}

          <div className="mb-6 text-center">
            <h3 className="text-md font-semibold mb-2">Rol del Tutor</h3>
            <div className="flex justify-center">
              <RadioGroupField
                name="correoPertenece"
                options={rolesDisponibles}
                value={formData.legal?.correoPertenece || ""}
                className="justify-center flex"
                onChange={(value) =>
                  handleInputChange("legal", "correoPertenece", value)
                }
                error={errors.correoPertenece}
              />
            </div>
          </div>

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
            onChange={(value) => handleInputChange("legal", "nombres", value)}
            error={errors.nombres}
            maxLength="30"
            regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/}
            transform={(value) => value.toUpperCase()}
          />

          <TextField
            label="Correo Electrónico"
            icon={<FaEnvelope className="text-black" />}
            name="correo"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.legal?.correo || ""}
            onChange={(value) => handleInputChange("legal", "correo", value)}
            error={errors.correo}
          />

          <TextField
            label="Teléfono/Celular"
            icon={<FaPhoneAlt className="text-black" />}
            name="telefono"
            placeholder="Número de Teléfono/Celular"
            value={formData.legal?.telefono || ""}
            onChange={(value) => handleInputChange("legal", "telefono", value)}
            error={errors.telefono}
            maxLength="8"
            regex={/^[0-9]*$/}
          />
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {errors.general}
          </div>
        )}

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
    </div>
  );
}
