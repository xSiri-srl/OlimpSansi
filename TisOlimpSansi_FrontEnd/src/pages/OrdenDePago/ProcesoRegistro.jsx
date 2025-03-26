import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaIdCard, FaSchool } from 'react-icons/fa';

const ProcesoRegistro = ({ 
  steps, 
  initialStep = 1, 
  nextRoute, 
  backRoute 
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState({});

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
      if (step === steps.length - 1) {
        navigate(nextRoute);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(backRoute);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
        {/* Progress Tracking */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((stepLabel, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  index + 1 === step
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-400 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xss mt-2 ${index + 1 === step ? "text-blue-600" : "text-gray-400"}`}
              >
                {stepLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1 - Responsible Person */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-500">
                Información del Responsable
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-black" />
                      <label>Apellido Paterno</label>
                    </div>
                    <input
                      type="text"
                      value={formData.apellidoPaterno || ''}
                      onChange={(e) => handleInputChange('apellidoPaterno', e.target.value)}
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
                      value={formData.apellidoMaterno || ''}
                      onChange={(e) => handleInputChange('apellidoMaterno', e.target.value)}
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
                    value={formData.nombres || ''}
                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                    className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombres"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <FaIdCard className="text-black" />
                    <label>Número de Identidad</label>
                  </div>
                  <input
                    type="text"
                    value={formData.ci || ''}
                    onChange={(e) => handleInputChange('ci', e.target.value)}
                    className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de Carnet de Identidad"
                    maxLength="8"
                  />
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNext}
                  disabled={!formData.nombres || !formData.ci}
                  className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
                    formData.nombres && formData.ci
                      ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>

            <div className="bg-gray-300 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Ejemplo:</h3>
              <div className="bg-gray-400 p-6 rounded-md flex flex-col items-center justify-center">
                <div className="bg-gray-200 w-full h-16 mb-4"></div>
                <div className="bg-red-500 text-white px-2 py-1 rounded-md">Datos de ejemplo</div>
              </div>
            </div>
          </div>
        )}

        {/* Additional steps can be added similarly */}
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">
              Información Adicional
            </h2>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
              >
                Atrás
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Final step */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">¡Registro Completado!</h2>
            <p className="text-gray-600">Los datos han sido guardados con éxito</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcesoRegistro;
