import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProcesoRegistro from './ProcesoRegistro';
import { FaUser, FaIdCard } from 'react-icons/fa';
import InscripcionEstudiante from './InscripcionEstudiante';
import AreasCompetencia from './AreasCompetencia';
import InscripcionTutorLegal from './InscripcionTutorLegal';
import InscripcionTutorAcademico from './IncripcionTutorAcademico';
import axios from 'axios';

const ResponsableForm = ({ formData, handleInputChange, handleNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endpoint = "http://localhost:8000/api";

  const handleSubmitResponsable = async () => {
    setLoading(true);
    setError(null);
    if (!formData.responsable.nombres || !formData.responsable.apellidoPaterno || !formData.responsable.ci) {
      setError('Por favor complete todos los campos obligatorios');
      setLoading(false);
      return;
    }
    
    try {
      const datosParaEnviar = {
        nombre: formData.responsable.nombres,
        apellido_pa: formData.responsable.apellidoPaterno,
        apellido_ma: formData.responsable.apellidoMaterno || '',
        ci: formData.responsable.ci,
        complemento: formData.responsable.complemento || ''
      };
      
      console.log('Datos mapeados para enviar:', datosParaEnviar);
      
      const response = await axios.post(`${endpoint}/agregarTresponsableInscrip`, datosParaEnviar);
      
      console.log('Datos enviados correctamente:', response.data);
      
      handleNext();
    } catch (err) {
      console.error('Error al enviar datos:', err);
      setError(err.response?.data?.message || 'Error al enviar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Tutor Legal
          </h2>
          <p className="text-sm text-gray-600">
            Estos datos corresponden a la persona que pagará en caja.
          </p>
        </div>
       
        <div className='p-19 mt-8 mx-'>
          <div className="space-y-4">
            <div className="flex gap-4">
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
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <button
            onClick={loading ? null : handleSubmitResponsable}
            disabled={!formData.responsable?.nombres || !formData.responsable?.ci || loading}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              formData.responsable?.nombres && formData.responsable?.ci && !loading
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? 'Enviando...' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Confirmation = () => {
  const navigate = useNavigate(); 
  
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
  const [formData, setFormData] = useState({
    responsable: {
      apellidoPaterno: '',
      apellidoMaterno: '',
      nombres: '',
      ci: ''
    }
  });
  
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleNext = () => {
    console.log("Avanzando al siguiente paso");
  };

  const steps = [
    'Responsable de Inscripción',
    'Competidor', 
    'Áreas de Competencia',
    'Tutor Legal',
    'Profesor o Entrenador',
    'Confirmación'
  ];

  return (
    <ProcesoRegistro 
      steps={steps} 
      nextRoute="/subirComprobante"
      backRoute="/"
    >
      <ResponsableForm 
        formData={formData} 
        handleInputChange={handleInputChange} 
        handleNext={handleNext} 
      />
      <InscripcionEstudiante />
      <AreasCompetencia />
      <InscripcionTutorLegal />
      <InscripcionTutorAcademico />
      <Confirmation />
    </ProcesoRegistro>
  );
};

export default InscripcionResponsable;