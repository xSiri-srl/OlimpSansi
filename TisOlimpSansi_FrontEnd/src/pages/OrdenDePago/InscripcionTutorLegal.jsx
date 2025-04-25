import React, { useState } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useFormData } from "./form-data-context";

export default function InscripcionTutorLegal({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();
  const { errors, validateEmailField, clearError, setErrors } = useFormValidation();

  const areasSeleccionadas = formData.estudiante?.areasSeleccionadas || [];

  const validateInput = (value, fieldName, regex) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Campo obligatorio." }));
      return false;
    }
    if (regex && !regex.test(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Formato inválido." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
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
    const isCIValid = validateInput(formData.legal?.ci, "ci", /^[0-9]*$/);
    const isTelefonoValid = validateInput(
      formData.legal?.telefono,
      "telefono",
      /^[0-9]*$/
    );
    const isCorreoValid = validateEmail(formData.legal?.correo);

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
      console.log("Datos del tutor legal actualizados en JSON:", updatedData);
      handleInputChange("legal", "isComplete", true);
      handleNext();
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      setErrors({ general: "Hubo un error al procesar los datos." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidatedChange = (namespace, field, value, regex) => {
    if (value.startsWith(" ")) return;
    if (regex.test(value) || value === "") {
      handleInputChange(namespace, field, value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.correoPertenece}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* Apellido Paterno y Materno */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="flex items-center gap-2">
                <FaUser className="text-black" /> Apellido Paterno
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Apellido Paterno"
                value={formData.legal?.apellidoPaterno || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "legal",
                    "apellidoPaterno",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                  )
                }
                maxLength="15"
              />
              {errors.apellidoPaterno && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidoPaterno}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="flex items-center gap-2">
                <FaUser className="text-black" /> Apellido Materno
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Apellido Materno"
                value={formData.legal?.apellidoMaterno || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "legal",
                    "apellidoMaterno",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                  )
                }
                maxLength="15"
              />
              {errors.apellidoMaterno && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidoMaterno}
                </p>
              )}
            </div>
          </div>

          {/* Nombres */}
          <div>
            <label className="flex items-center gap-2">
              <FaUser className="text-black" /> Nombres
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Nombres"
              value={formData.legal?.nombres || ""}
              onChange={(e) =>
                handleValidatedChange(
                  "legal",
                  "nombres",
                  e.target.value.toUpperCase(),
                  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                )
              }
              maxLength="30"
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
          </div>

          {/* CI */}
          <div>
            <label className="flex items-center gap-2">
              <FaIdCard className="text-black" /> Carnet de Identidad
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="CI"
              value={formData.legal?.ci || ""}
              onChange={(e) =>
                handleValidatedChange("legal", "ci", e.target.value, /^[0-9]*$/)
              }
              maxLength="8"
            />
            {errors.ci && (
              <p className="text-red-500 text-sm mt-1">{errors.ci}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="flex items-center gap-2">
              <FaEnvelope className="text-black" /> Correo Electrónico
            </label>
            <input
              type="email"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Correo Electrónico"
              value={formData.legal?.correo || ""}
              onChange={(e) =>
                handleInputChange("legal", "correo", e.target.value)
              }
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="flex items-center gap-2">
              <FaPhoneAlt className="text-black" /> Teléfono/Celular
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Teléfono/Celular"
              value={formData.legal?.telefono || ""}
              onChange={(e) =>
                handleValidatedChange(
                  "legal",
                  "telefono",
                  e.target.value,
                  /^[0-9]*$/
                )
              }
              maxLength="8"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {errors.general}
          </div>
        )}

        <div className="flex justify-center mt-8 gap-4">
          <button
            type="button"
            className="px-6 py-2 text-white rounded-md bg-gray-500 hover:bg-gray-600"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={handleSubmitAndNext}
            disabled={
              isSubmitting ||
              !formData.legal?.apellidoPaterno ||
              !formData.legal?.apellidoMaterno ||
              !formData.legal?.nombres ||
              !formData.legal?.ci ||
              !formData.legal?.correo ||
              !formData.legal?.telefono ||
              !formData.legal?.correoPertenece ||
              formData.legal?.ci.length < 7 ||
              formData.legal?.nombres.length < 2 ||
              formData.legal?.apellidoMaterno.length < 2 ||
              formData.legal?.apellidoPaterno.length < 2 ||
              formData.legal?.telefono.length != 8 ||
              formData.legal?.nombres.split(" ").length > 2
            }
            className={`px-6 py-2 text-white rounded-md shadow-md ${
              !isSubmitting &&
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
              formData.legal?.nombres.split(" ").length <= 2
                ? "bg-blue-500 hover:bg-indigo-500"
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
