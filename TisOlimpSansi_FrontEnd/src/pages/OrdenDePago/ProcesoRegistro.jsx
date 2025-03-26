import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProcesoRegistro = ({ 
  steps, 
  initialStep = 1, 
  nextRoute, 
  backRoute,
  children 
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    flow: { redirectToProfesor: false }
  });

  const handleNext = () => {
    // Si necesitamos redirigir al registro de profesor
    if (formData.flow?.redirectToProfesor) {
      // Ir al paso del profesor (índice 4 en el array de pasos)
      setStep(5); // Ajusta este valor según la posición de la pantalla del profesor
    } else if (step < steps.length) {
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

  const handleInputChange = (namespace, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [namespace]: {
        ...prev[namespace],
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">

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

        {React.Children.map(children, (child, index) => {
          if (index + 1 === step) {
            return React.cloneElement(child, {
              formData,
              handleInputChange,
              handleNext,
              handleBack,
              navigate
            });
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ProcesoRegistro;