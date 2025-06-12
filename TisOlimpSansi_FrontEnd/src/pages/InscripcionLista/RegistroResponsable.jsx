import { useState, useEffect } from "react"
import { FaUser, FaIdCard, FaEnvelope } from "react-icons/fa"
import { useFormData } from "./form-context"
import { useLocation } from "react-router-dom";
import { API_URL } from "../../utils/api";
import axios from "axios";

function RegistroResponsable({ setStep }) {
  const [formData, setFormData] = useState({
    responsable: {
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      ci: "",
      correo: "",
    },
  })
const location = useLocation();
const state = location.state;
const olimpiada = parseInt(state?.id, 10);
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [responsableFound, setResponsableFound] = useState(false)
  const { globalData, setGlobalData } = useFormData()

  useEffect(() => {
    if (globalData.responsable_inscripcion) {
      const resp = globalData.responsable_inscripcion;
      setFormData({
        responsable: {
          apellidoPaterno: resp.apellido_pa || "",
          apellidoMaterno: resp.apellido_ma || "",
          nombres: resp.nombre || "",
          ci: resp.ci || "",
          correo: resp.correo_responsable || "",
        }
      });
    }
  }, [globalData]);

  const handleInputChange = (namespace, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [namespace]: {
        ...prev[namespace],
        [field]: value,
      },
    }))
  }

  const buscarResponsablePorCI = async (ci) => {
    if (ci?.length >= 7 && ci?.length <= 8) {
      setIsSearching(true)
      try {
  
        const response = await axios.get(`${API_URL}/api/buscar-responsable/${ci}`)
        if (response.data.found) {
          const responsable = response.data.responsable
          handleInputChange('responsable', 'nombres', responsable.nombre)
          handleInputChange('responsable', 'apellidoPaterno', responsable.apellido_pa)
          handleInputChange('responsable', 'apellidoMaterno', responsable.apellido_ma)
          handleInputChange('responsable', 'correo', responsable.correo || "")
          setResponsableFound(true)
        } else {
          setResponsableFound(false)
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          ci: "Error al buscar en la base de datos. Intente de nuevo."
        }))
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleCIChange = (e) => {
    const value = e.target.value
    if (/^[0-9]*$/.test(value) || value === "") {
      handleInputChange("responsable", "ci", value)
      setErrors((prev) => ({ ...prev, ci: "" }))
      if (value.length >= 7 && value.length <= 8) {
        buscarResponsablePorCI(value)
      } else {
        setResponsableFound(false)
      }
    }
  }

  const validateInput = (value, fieldName, regex, minWords = 1, minLength = 0) => {
    if (!value || value.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Este campo no puede estar vacío.",
      }))
      return false
    }

    if (!regex.test(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Formato inválido." }))
      return false
    }

    if (minLength > 0 && value.length < minLength) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `Debe tener al menos ${minLength} dígitos.`,
      }))
      return false
    }

    if (value.trim().split(/\s+/).length < minWords) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `Debe contener al menos ${minWords} palabra(s).`,
      }))
      return false
    }

    setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    return true
  }

  const handleValidatedChange = (namespace, field, value, regex) => {
    if (value.startsWith(" ")) return
    if (regex.test(value) || value === "") {
      handleInputChange(namespace, field, value)
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleNext = () => setStep(2)

  const handleSubmitAndNext = () => {
    const isApellidoPaternoValid = validateInput(
      formData.responsable?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      1
    )

    const isApellidoMaternoValid = validateInput(
      formData.responsable?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      1
    )

    const isNombresValid = validateInput(
      formData.responsable?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      1
    )

    const isCIValid = validateInput(
      formData.responsable?.ci,
      "ci",
      /^[0-9]{7,8}$/,
      1,
      7
    )

    const isCorreoValid = validateInput(
      formData.responsable?.correo,
      "correo",
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      1
    )

    if (!isApellidoPaternoValid || !isApellidoMaternoValid || !isNombresValid || !isCIValid || !isCorreoValid) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedData = {
        ...globalData,
        olimpiada:olimpiada,
        responsable_inscripcion: {
          nombre: formData.responsable?.nombres,
          apellido_pa: formData.responsable?.apellidoPaterno,
          apellido_ma: formData.responsable?.apellidoMaterno,
          ci: formData.responsable?.ci,
          correo_responsable: formData.responsable?.correo,
        },
        
      }

      setGlobalData(updatedData)
      handleNext()
    } catch (error) {
      setErrors({ general: "Hubo un error al procesar los datos." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">Responsable de Inscripción</h2>
          <p className="text-sm text-gray-600">Estos datos corresponden a la persona que pagará en caja.</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <FaIdCard className="text-black" />
              <label>Carnet de Identidad</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.responsable?.ci || ""}
                onChange={handleCIChange}
                className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de Carnet de Identidad (7-8 dígitos)"
                maxLength={8}
              />
              {isSearching && <div className="ml-2 text-blue-500">Buscando...</div>}
              {responsableFound && <div className="ml-2 text-green-500">✓ Encontrado</div>}
            </div>
            {errors.ci && <p className="text-red-500 text-sm mt-1">{errors.ci}</p>}
          </div>

          {responsableFound && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Responsable encontrado en el sistema. Los datos han sido cargados automáticamente.
            </div>
          )}

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
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                  )
                }
                readOnly={responsableFound}
                className={`w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${responsableFound ? 'bg-gray-100' : ''}`}
                placeholder="Apellido Paterno"
              />
              {errors.apellidoPaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoPaterno}</p>}
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
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                  )
                }
                readOnly={responsableFound}
                className={`w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${responsableFound ? 'bg-gray-100' : ''}`}
                placeholder="Apellido Materno"
              />
              {errors.apellidoMaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoMaterno}</p>}
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
              readOnly={responsableFound}
              className={`w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${responsableFound ? 'bg-gray-100' : ''}`}
              placeholder="Nombres"
            />
            {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-black" />
              <label>Correo Electrónico</label>
            </div>
            <input
              type="email"
              value={formData.responsable?.correo || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (!value.startsWith(" ")) {
                  handleInputChange("responsable", "correo", value);
                  setErrors((prev) => ({ ...prev, correo: "" }));
                }
              }}
              readOnly={responsableFound}
              className={`w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${responsableFound ? 'bg-gray-100' : ''}`}
              placeholder="correo@ejemplo.com"
              maxLength={50}
            />
            {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSubmitAndNext}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              {isSubmitting ? "Guardando..." : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistroResponsable