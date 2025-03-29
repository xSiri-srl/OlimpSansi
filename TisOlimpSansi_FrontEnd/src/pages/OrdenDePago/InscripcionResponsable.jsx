import { FaUser, FaIdCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function FormularioInscripcion() {
  const navigate = useNavigate();
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [errors, setErrors] = useState({});

  const handleNext = async () => {
    const newErrors = {};
    if (!apellidoPaterno) newErrors.apellidoPaterno = "Campo obligatorio.";
    if (!apellidoMaterno) newErrors.apellidoMaterno = "Campo obligatorio.";
    if (!nombres) newErrors.nombres = "Campo obligatorio.";
    if (!ci) newErrors.ci = "Campo obligatorio.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/agregarTresponsableInscrip",
        {
          apellido_pa: apellidoPaterno,
          apellido_ma: apellidoMaterno,
          nombre: nombres,
          ci: ci,
        }
      );
      //console.log("Respuesta del servidor:", response.data);
      navigate("/inscripcion/estudiante");
    } catch (error) {
      setErrors({ general: "Hubo un error al enviar los datos." });
    }
  };

  const handleBack = () => {
    navigate("/inscripcion/forma-inscripcion");
  };

  const handleInputChange = (setter, fieldName, regex) => (e) => {
    const value = e.target.value;
    if (regex.test(value) || value === "") {
      setter(value);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Responsable de Inscripción
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
                handleInputChange("responsable", "apellidoPaterno", e.target.value)}
                className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido Paterno"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <FaUser className="text-black" />
                <label>Apellido Materno</label>
              </div>
              <input
                type="text"
                value={formData.responsable?.apellidoMaterno || ''}
                onChange={(e) => 
                handleInputChange('responsable','apellidoMaterno', e.target.value)}
                className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido Materno"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaUser className="text-black" />
              <label>Nombres</label>
            </div>
            <input
              type="text"
              value={formData.responsable?.nombres || ''}
              onChange={(e) => 
              handleInputChange('responsable','nombres', e.target.value)}
              className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombres"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaIdCard className="text-black" />
              <label>Carnet de Identidad</label>
            </div>
            <input
              type="text"
              value={formData.responsable?.ci || ''}
              onChange={(e) => 
              handleInputChange('responsable','ci', e.target.value)}
              className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de Carnet de Identidad"
              maxLength="8"
            />
          </div>
        </div>
        
        {/* Botón */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
            onClick={handleNext}
            disabled={!formData.responsable?.nombres || !formData.responsable?.ci}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              formData.responsable?.nombres && formData.responsable?.ci
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};


const Confirmation = ({ navigate }) => {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-4">¡Registro Completado!</h2>
      <p className="text-gray-600">Los datos han sido guardados con éxito</p>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate('/subirComprobante')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

const InscripcionResponsable = () => {
  const steps = [
    'Responsable de Inscripción',
    'Competidor', 
    'Áreas de Competencia',
    'Tutor Legal',
    'Profesor',
    'Confirmación'
  ];

  return (
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
  );
};

export default InscripcionResponsable;