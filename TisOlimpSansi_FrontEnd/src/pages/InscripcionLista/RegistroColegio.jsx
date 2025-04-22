import { useState, useEffect } from "react"
import { FaUser, FaIdCard, FaSchool, FaMapMarkedAlt} from "react-icons/fa"
import { useFormData } from "./form-context"
import axios from "axios"


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

  const [noEncontre, setNoEncontre] = useState(false)
  const [colegiosData, setColegiosData] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);
  const [colegiosFiltrados, setColegiosFiltrados] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:8000/api/colegios/filtro", {})
      .then(res => {
        setColegiosData(res.data);
        const departamentosUnicos = [...new Set(res.data.map(c => c.departamento))];
        setDepartamentosList(departamentosUnicos);
      })
      .catch(err => console.error("Error al cargar colegios", err));
  }, []);
  
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

  useEffect(() => {
    const distritos = colegiosData
      .filter(c => c.departamento === formData.colegio.departamento)
      .map(c => c.distrito);
  
    setDistritosList([...new Set(distritos)]);
  }, [formData.colegio.departamento, colegiosData]);

  useEffect(() => {
    const colegios = colegiosData
      .filter(c => c.departamento === formData.colegio.departamento && c.distrito === formData.colegio.distrito)
      .map(c => c.nombre_colegio);
  
    setColegiosFiltrados([...new Set(colegios)]);
  }, [formData.colegio.distrito, formData.colegio.departamento, colegiosData]);
  

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
              {departamentosList.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
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
              {distritosList.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
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
  {colegiosFiltrados.map((colegio, idx) => (
    <option key={idx} value={colegio}>{colegio}</option>
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
