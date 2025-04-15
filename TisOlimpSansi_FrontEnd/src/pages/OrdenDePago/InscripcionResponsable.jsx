import { useState } from "react";
import axios from "axios";
import ProcesoRegistro from "./ProcesoRegistro";
import { FaUser, FaIdCard } from "react-icons/fa";
import InscripcionEstudiante from "./InscripcionEstudiante";
import AreasCompetencia from "./AreasCompetencia";
import InscripcionTutorLegal from "./InscripcionTutorLegal";
import InscripcionTutorAcademico from "./IncripcionTutorAcademico";
import Confirmation from "./Confirmation";
import { FormDataContext, useFormData } from "./form-data-context";

const ResponsableForm = ({ formData, handleInputChange, handleNext }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();

  // Función para validar entradas con regex
  const validateInput = (value, fieldName, regex, minWords = 1) => {
    if (!value || !value.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Este campo no puede estar vacío.",
      }));
      return false;
    }

    if (!regex.test(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Formato inválido." }));
      return false;
    }

    if (value.trim().split(/\s+/).length < minWords) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `Debe contener al menos ${minWords} palabra(s).`,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return true;
  };

  // Manejador de cambio con validación
  const handleValidatedChange = (namespace, field, value, regex) => {
    if (value.startsWith(" ")) return;
    if (regex.test(value) || value === "") {
      handleInputChange(namespace, field, value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmitAndNext = () => {
    const isApellidoPaternoValid = validateInput(
      formData.responsable?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+([A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      1
    );

    const isApellidoMaternoValid = validateInput(
      formData.responsable?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+([A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      1
    );

    const isNombresValid = validateInput(
      formData.responsable?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      1
    );

    const isCIValid = validateInput(formData.responsable?.ci, "ci", /^[0-9]*$/);

    if (
      !isApellidoPaternoValid ||
      !isApellidoMaternoValid ||
      !isNombresValid ||
      !isCIValid
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Actualizar el objeto global con los datos del responsable
      const updatedData = {
        ...globalData,
        responsable_inscripcion: {
          nombre: formData.responsable?.nombres,
          apellido_pa: formData.responsable?.apellidoPaterno,
          apellido_ma: formData.responsable?.apellidoMaterno,
          ci: formData.responsable?.ci,
        },
      };

      // Guardar en el contexto global
      setGlobalData(updatedData);

      console.log("Datos guardados en JSON:", updatedData);

      // Continuar al siguiente paso
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

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Responsable de Registro
          </h2>
          <p className="text-sm text-gray-600">
            Estos datos corresponden a la persona que pagará en caja.
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <div className="flex items-center gap-2">
                <FaUser className="text-black" />
                <label>Apellido Paterno</label>
              </div>
              <input
                type="text"
                value={formData.responsable?.apellidoPaterno || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "responsable",
                    "apellidoPaterno",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                  )
                }
                maxLength="15"
                className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido Paterno"
              />
              {errors.apellidoPaterno && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidoPaterno}
                </p>
              )}
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <FaUser className="text-black" />
                <label>Apellido Materno</label>
              </div>
              <input
                type="text"
                value={formData.responsable?.apellidoMaterno || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "responsable",
                    "apellidoMaterno",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                  )
                }
                maxLength="15"
                className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido Materno"
              />
              {errors.apellidoMaterno && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidoMaterno}
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaUser className="text-black" />
              <label>Nombres</label>
            </div>
            <input
              type="text"
              value={formData.responsable?.nombres || ""}
              onChange={(e) =>
                handleValidatedChange(
                  "responsable",
                  "nombres",
                  e.target.value.toUpperCase(),
                  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                )
              }
              maxLength="30"
              className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombres"
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaIdCard className="text-black" />
              <label>Carnet de Identidad</label>
            </div>
            <input
              type="text"
              value={formData.responsable?.ci || ""}
              onChange={(e) =>
                handleValidatedChange(
                  "responsable",
                  "ci",
                  e.target.value,
                  /^[0-9]*$/
                )
              }
              className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de Carnet de Identidad"
              maxLength="8"
            />
            {errors.ci && (
              <p className="text-red-500 text-sm mt-1">{errors.ci}</p>
            )}
          </div>

          {/* Mensaje de error general */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
        </div>

        {/* Botón */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmitAndNext}
            disabled={
              isSubmitting ||
              !formData.responsable?.nombres ||
              !formData.responsable?.ci ||
              formData.responsable?.ci.length < 7 ||
              formData.responsable?.nombres.length < 2 ||
              formData.responsable?.apellidoMaterno.length < 2 ||
              formData.responsable?.apellidoPaterno.length < 2 ||
              formData.responsable?.nombres.split(" ").length > 2
            }
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              formData.responsable?.nombres &&
              formData.responsable?.ci &&
              formData.responsable?.ci.length >= 7 &&
              formData.responsable?.nombres.length >= 2 &&
              formData.responsable?.apellidoMaterno.length >= 2 &&
              formData.responsable?.apellidoPaterno.length >= 2 &&
              formData.responsable?.nombres.split(" ").length <= 2 &&
              !isSubmitting
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Procesando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InscripcionResponsable = () => {
  const [globalData, setGlobalData] = useState({});
  const steps = [
    "Responsable de Inscripción",
    "Competidor",
    "Áreas de Competencia",
    "Tutor Legal",
    "Profesor",
    "Confirmación",
  ];

  return (
    <FormDataContext.Provider value={{ globalData, setGlobalData }}>
      <ProcesoRegistro
        steps={steps}
        nextRoute="/subirComprobante"
        backRoute="/"
      >
        <ResponsableForm />
        <InscripcionEstudiante />
        <AreasCompetencia />
        <InscripcionTutorLegal />
        <InscripcionTutorAcademico />
        <Confirmation />
      </ProcesoRegistro>
    </FormDataContext.Provider>
  );
};

export default InscripcionResponsable;
