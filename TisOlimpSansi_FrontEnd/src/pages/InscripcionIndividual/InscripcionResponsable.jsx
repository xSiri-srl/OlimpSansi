import { useState, useEffect } from "react";
import ProcesoRegistro from "./ProcesoRegistro";
import { FaUser, FaIdCard, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import InscripcionEstudiante from "./InscripcionEstudiante";
import AreasCompetencia from "./AreasCompetencia";
import InscripcionTutorLegal from "./InscripcionTutorLegal";
import InscripcionTutorAcademico from "./InscripcionTutorAcademico";
import Confirmation from "./Confirmation";
import { useFormData } from "./form-data-context";
import { TextField } from "./components/FormComponents";
import { validateField, validateCI } from "./utils/validationsUtils";
import { API_URL } from "../../utils/api";
import axios from "axios";
import ModalConfirmacionCorreo from "./modales/ModalConfirmacionCorreo";

const ResponsableForm = ({ formData, handleInputChange, handleNext }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [responsableFound, setResponsableFound] = useState(false);
  const [showModalCorreo, setShowModalCorreo] = useState(false);
  const { globalData, setGlobalData } = useFormData();
  const state = location.state;
  const olimpiada = parseInt(state?.id, 10);
  const gradoAreaCurso = state?.gradoAreaCurso;

  useEffect(() => {
    if (olimpiada && gradoAreaCurso) {
      const subirOlimpiada = {
        ...globalData,
        olimpiada: olimpiada,
        gradoAreaCurso,
      };
      setGlobalData(subirOlimpiada);
    }
  }, [olimpiada, gradoAreaCurso]);

  const validateInput = (value, fieldName, regex, minWords = 1) => {
    const { isValid, errorMessage } = validateField(value, regex, minWords);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  const buscarResponsablePorCI = async (ci) => {
    if (ci?.length >= 7) {
      setIsSearching(true);

      try {
        const response = await axios.get(
          `${API_URL}/api/buscar-responsable/${ci}`
        );

        if (response.data.found) {
          const responsable = response.data.responsable;
          handleInputChange("responsable", "nombres", responsable.nombre);
          handleInputChange(
            "responsable",
            "apellidoPaterno",
            responsable.apellido_pa
          );
          handleInputChange(
            "responsable",
            "apellidoMaterno",
            responsable.apellido_ma
          );
          handleInputChange("responsable", "correo", responsable.correo);
          setResponsableFound(true);
        } else {
          setResponsableFound(false);
        }
      } catch (error) {
        console.error("Error al buscar responsable:", error);
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
    handleInputChange("responsable", "ci", value);
    setErrors((prev) => ({ ...prev, ci: "" }));

    if (value.length >= 7 && value.length <= 8) {
      buscarResponsablePorCI(value);
    } else if (value.length < 7) {
      setResponsableFound(false);
    }
  };

  const handleSubmitAndNext = () => {
    const isApellidoPaternoValid = validateInput(
      formData.responsable?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      1
    );

    const isApellidoMaternoValid = validateInput(
      formData.responsable?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      1
    );

    const isNombresValid = validateInput(
      formData.responsable?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      1
    );

    const isCorreoValid = validateInput(
      formData.responsable?.correo,
      "correo",
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      1
    );

    const { isValid: isCIValid } = validateCI(formData.responsable?.ci);
    if (!isCIValid) {
      setErrors((prev) => ({
        ...prev,
        ci: "El CI debe tener entre 7 y 8 dígitos numéricos.",
      }));
    }

    if (
      !isApellidoPaternoValid ||
      !isApellidoMaternoValid ||
      !isNombresValid ||
      !isCIValid ||
      !isCorreoValid
    ) {
      return;
    }
    setShowModalCorreo(true);
  };

  const handleConfirmarCorreo = () => {
    setIsSubmitting(true);
    setShowModalCorreo(false);

    try {
      const updatedData = {
        ...globalData,
        responsable_inscripcion: {
          nombre: formData.responsable?.nombres,
          apellido_pa: formData.responsable?.apellidoPaterno,
          apellido_ma: formData.responsable?.apellidoMaterno,
          ci: formData.responsable?.ci,
          correo_responsable: formData.responsable?.correo,
        },
      };

      setGlobalData(updatedData);
      console.log("Datos que estan:", globalData);
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

  function correoValido(correo) {
    const dominiosPermitidos = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];
    const partes = correo.split("@");
    if (partes.length !== 2) return false;

    const [usuario, dominio] = partes;

    const usuarioValido = /^[a-zA-Z0-9._%+-]+$/.test(usuario);
    const dominioValido = dominiosPermitidos.includes(dominio);

    return usuarioValido && dominioValido;
  }

  const isFormValid =
    formData.responsable?.nombres &&
    formData.responsable?.ci &&
    formData.responsable?.apellidoPaterno &&
    formData.responsable?.apellidoMaterno &&
    formData.responsable?.correo &&
    formData.responsable?.ci?.length >= 7 &&
    formData.responsable?.nombres?.length >= 2 &&
    formData.responsable?.apellidoMaterno?.length >= 2 &&
    formData.responsable?.apellidoPaterno?.length >= 2 &&
    formData.responsable?.nombres?.split(" ").length <= 2 &&
    !isSubmitting;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Responsable de Registro
          </h2>
          <p className="text-sm text-gray-600">
            Estos datos corresponden a la persona que pagará en caja.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <TextField
              label="Carnet de Identidad"
              icon={<FaIdCard className="text-black" />}
              name="ci"
              placeholder="Número de Carnet de Identidad (7 a 8 dígitos)"
              value={formData.responsable?.ci || ""}
              onChange={handleCIChange}
              error={errors.ci}
              maxLength="8"
              regex={/^[0-9]*$/}
              className="w-full"
            />
            {isSearching && (
              <div className="ml-2 text-blue-500">Buscando...</div>
            )}
            {responsableFound && (
              <div className="ml-2 text-green-500">✓ Encontrado</div>
            )}
          </div>

          {responsableFound && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Responsable encontrado en el sistema. Los datos han sido cargados
              automáticamente.
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <TextField
                label="Apellido Paterno"
                icon={<FaUser className="text-black" />}
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.responsable?.apellidoPaterno || ""}
                onChange={(value) =>
                  handleInputChange("responsable", "apellidoPaterno", value)
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
                value={formData.responsable?.apellidoMaterno || ""}
                onChange={(value) =>
                  handleInputChange("responsable", "apellidoMaterno", value)
                }
                error={errors.apellidoMaterno}
                maxLength="15"
                regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
                transform={(value) => value.toUpperCase()}
              />
            </div>
          </div>

          <div>
            <TextField
              label="Nombres"
              icon={<FaUser className="text-black" />}
              name="nombres"
              placeholder="Nombres"
              value={formData.responsable?.nombres || ""}
              onChange={(value) =>
                handleInputChange("responsable", "nombres", value)
              }
              error={errors.nombres}
              maxLength="30"
              regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/}
              transform={(value) => value.toUpperCase()}
            />
          </div>

          <div>
            <TextField
              label="Correo Electrónico"
              icon={<FaEnvelope className="text-black" />}
              name="correo"
              placeholder="correo@ejemplo.com"
              value={formData.responsable?.correo || ""}
              onChange={(value) =>
                handleInputChange("responsable", "correo", value)
              }
              error={errors.correo}
              maxLength="50"
            />
            {formData.responsable?.correo && correoValido(formData.responsable?.correo) && (
              <div className="mt-3 bg-blue-200 border-blue-700 rounded-lg p-4 shadow-sm animate-pulse">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <FaInfoCircle className="text-blue-600 text-sl" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-blue-700 flex">
                      ¡Atención! Verifica que tu correo sea correcto.
                    </p>

                    <p className=" text-blue-700 leading-relaxed">
                      Al completar la Pre-inscripción, se enviará un código al correo ingresado
                      para generar la orden de pago.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmitAndNext}
            disabled={!isFormValid}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              isFormValid
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Procesando..." : "Siguiente"}
          </button>
        </div>
        <ModalConfirmacionCorreo
          isOpen={showModalCorreo}
          onClose={() => setShowModalCorreo(false)}
          onConfirm={handleConfirmarCorreo}
          correo={formData.responsable?.correo}
        />
      </div>
    </div>
  );
};

const InscripcionResponsable = () => {
  const steps = [
    "Responsable de Inscripción",
    "Competidor ­",
    "Áreas de Competencia",
    "Tutor Legal ­",
    "Profesor ­",
    "Confirmación ­",
  ];

  return (
    <ProcesoRegistro steps={steps} nextRoute="/subirComprobante" backRoute="/">
      <ResponsableForm />
      <InscripcionEstudiante />
      <AreasCompetencia />
      <InscripcionTutorLegal />
      <InscripcionTutorAcademico />
      <Confirmation />
    </ProcesoRegistro>
  );
};

export default InscripcionResponsable;
