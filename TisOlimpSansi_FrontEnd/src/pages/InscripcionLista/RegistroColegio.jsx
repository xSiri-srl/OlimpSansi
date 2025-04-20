import { useState, useEffect } from "react"
import { FaUser, FaIdCard, FaSchool, FaMapMarkedAlt} from "react-icons/fa"
import { useFormData } from "./form-context"
import axios from "axios"
const departamentos = {
  "Cochabamba": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "La Paz": ["Distrito 4", "Distrito 5", "Distrito 6"],
  "Santa Cruz": ["Distrito 7", "Distrito 8", "Distrito 9"],
  "Oruro": ["Distrito 10", "Distrito 11"],
  "Potosí": ["Distrito 12", "Distrito 13"],
  "Tarija": ["Distrito 14"],
  "Chuquisaca": ["Distrito 15", "Distrito 16"],
  "Beni": ["Distrito 17"],
  "Pando": ["Distrito 18"]
};

const colegiosPorDistrito = {
  "Distrito 1": ["Colegio A Cochabamba", "Colegio B Cochabamba"],
  "Distrito 2": ["Colegio C Cochabamba", "Colegio D Cochabamba"],
  "Distrito 3": ["Colegio E Cochabamba"],

  "Distrito 4": ["Colegio A La Paz", "Colegio B La Paz"],
  "Distrito 5": ["Colegio C La Paz"],
  "Distrito 6": ["Colegio D La Paz", "Colegio E La Paz"],

  "Distrito 7": ["Colegio A Santa Cruz"],
  "Distrito 8": ["Colegio B Santa Cruz", "Colegio C Santa Cruz"],
  "Distrito 9": ["Colegio D Santa Cruz"],

  "Distrito 10": ["Colegio A Oruro"],
  "Distrito 11": ["Colegio B Oruro"],

  "Distrito 12": ["Colegio A Potosí"],
  "Distrito 13": ["Colegio B Potosí", "Colegio C Potosí"],

  "Distrito 14": ["Colegio A Tarija"],

  "Distrito 15": ["Colegio A Chuquisaca"],
  "Distrito 16": ["Colegio B Chuquisaca"],

  "Distrito 17": ["Colegio A Beni"],
  "Distrito 18": ["Colegio A Pando"]
};


function RegistroColegio({ setStep }) {
  const [formData, setFormData] = useState({
    colegio: {
      Departamento: "",
      Distrito: "",
      nombre_colegio: ""
    },
  })

  const [responsableFound, setResponsableFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const { globalData, setGlobalData } = useFormData()
  const [distritos, setDistritos] = useState(["Distrito 1", "Distrito 2", "Distrito 3"])
  const [colegios, setColegios] = useState(["Colegio A", "Colegio B", "Colegio C"])
  const [noEncontre, setNoEncontre] = useState(false)

  
  useEffect(() => {
    if (globalData.colegio) {
      
      const resp = globalData.colegio;
      setFormData({
        colegio: {
          departamento: resp.departamento || "",
          distrito: resp.distrito || "",
          nombre_colegio: resp.nombre_colegio || ""
        }
      });
    }
  }, [globalData]);


  

  const handleInputChange = (grupo, campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [campo]: valor,
      },
    }));
  };

  const handleNext = () => setStep(3)

  const handleSubmitAndNext = () => {
    const newErrors = {}
  
    if (!formData.colegio.departamento) {
      newErrors.departamento = "Debe seleccionar un departamento"
    }
  
    if (!formData.colegio.distrito) {
      newErrors.distrito = "Debe seleccionar un distrito"
    }
  
    if (!formData.colegio.nombre_colegio || formData.colegio.nombre_colegio.trim() === "") {
      newErrors.colegio = "Debe seleccionar o escribir el nombre del colegio"
    }
  
    setErrors(newErrors)
  
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        setGlobalData((prevData) => ({
          ...prevData,
          colegio: formData.colegio,
        }))
        handleNext()
      } catch (error) {
        setErrors({ general: "Hubo un error al procesar los datos." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  

  

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">Registro del colegio</h2>
          <p className="text-sm text-gray-600">Estos datos corresponden.</p>
        </div>

        <div className="space-y-4">
        
         <div>
  <label className="flex items-center gap-2">
  <FaMapMarkedAlt className="text-black" /> Departamento
  </label>
  <select
  name="departamento"
  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
  value={formData.colegio.departamento || ""}
  onChange={(e) => {
    handleInputChange("colegio", "departamento", e.target.value);
    handleInputChange("colegio", "distrito", "");
    handleInputChange("colegio", "nombre_colegio", "");
  }}
>
  <option value="">Seleccione un Departamento</option>
  {Object.keys(departamentos).map((dep) => (
    <option key={dep} value={dep}>
      {dep}
    </option>
  ))}
</select>
{errors.departamento && (
 <p className="text-red-500 text-sm mt-1">
 {errors.departamento}
</p>
)}
 </div>
         
<div>
  <label className="flex items-center gap-2">
  <FaMapMarkedAlt className="text-black" /> Distrito
  </label>
  <select
  name="distrito"
  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
  value={formData.colegio.distrito || ""}
  onChange={(e) => {
    handleInputChange("colegio", "distrito", e.target.value);
    handleInputChange("colegio", "nombre_colegio", "");
  }}
  disabled={!formData.colegio.departamento}
>
  <option value="">Seleccione un Distrito</option>
  {departamentos[formData.colegio.departamento]?.map((dist) => (
    <option key={dist} value={dist}>
      {dist}
    </option>
  ))}
</select>

{errors.distrito && (
<p className="text-red-500 text-sm mt-1">{errors.distrito}</p>
)}
</div>
<div>
<label className="flex items-center gap-2">
<FaSchool className="text-black" /> Nombre del Colegio
</label>
<select
  name="nombre_colegio"
  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
  value={formData.colegio.nombre_colegio || ""}
  onChange={(e) => handleInputChange("colegio", "nombre_colegio", e.target.value)}
  disabled={!formData.colegio.distrito || noEncontre}
>
  <option value="">Seleccione un Colegio</option>
  {colegiosPorDistrito[formData.colegio.distrito]?.map((colegio, idx) => (
    <option key={idx} value={colegio}>
      {colegio}
    </option>
  ))}
</select>

{errors.colegio && (
<p className="text-red-500 text-sm mt-1">{errors.colegio}</p>
)}
</div> 
 {/* Checkbox no encontré */}
<div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={noEncontre}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setNoEncontre(isChecked);
                if (isChecked) {
                  handleInputChange("colegio", "nombre_colegio", ""); // Deselecciona el colegio
                }
              }}
            />
            <label>No encontré mi colegio</label>
          </div>

          {/* Input libre si no encuentra */}
          {noEncontre && (
            <div>
              <div className="flex items-center gap-2">
                <FaUser className="text-black" />
                <label>Escriba el nombre de su colegio</label>
              </div>
              <input
                type="text"
                value={formData.colegio.nombre_colegio || ""}
                onChange={(e) => handleInputChange("colegio", "nombre_colegio", e.target.value)}
                className="w-full p-2 border border-gray-500 rounded-md"
                placeholder="Nombre del colegio"
              />
            </div>
          )}

          {/* Botones */}
          <div className="text-center mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmitAndNext}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ml-4"
            >
              {isSubmitting ? "Guardando..." : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistroColegio
