import React, { useState,useEffect } from 'react';
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
    flow: { 
      redirectToProfesor: false,
      currentAreaIndex: 0,
      pendingAreas: [],
      skipProfesor: false       // Agregar esta bandera
    },
    profesores: { areasRegistradas: [] }
  });

  useEffect(() => {
    if (formData.flow?.skipProfesor === true && step === 5) {
      // Saltar al paso de confirmación (paso 6) cuando se decidió no registrar profesores
      setStep(6);
    }
  }, [formData.flow?.skipProfesor, step]);

  const handleNext = () => {
    // Si se indicó que no hay profesores que registrar, saltamos al paso de confirmación
    if (formData.flow?.skipProfesor === true) {
      console.log("Saltando al paso de confirmación porque skipProfesor es true");
      setStep(6); // Ir directamente al paso de confirmación (paso 6)
      return;
    }
  
    // Si estamos en el paso del profesor y hay que continuar
    if (step === 5 && !formData.flow.redirectToProfesor) {
      // Verificar si hay más áreas pendientes por procesar
      if (formData.flow.pendingAreas && formData.flow.pendingAreas.length > 0) {
        // Aún hay áreas por procesar, mostrar el siguiente modal (en InscripcionTutorAcademico)
        setFormData(prev => ({
          ...prev,
          flow: {
            ...prev.flow,
            showNextAreaModal: true
          }
        }));
      } else {
        // No hay más áreas pendientes, ir al paso final
        setStep(6); // Confirmación
      }
    }
    // Si necesitamos redirigir al registro de profesor
    else if (formData.flow?.redirectToProfesor) {
      // Ir al paso del profesor
      setStep(5);
    } 
// Caso normal: avanzar al siguiente paso
  else if (step < steps.length) {
    // Si estamos en el paso 4 (tutor legal) y skipProfesor es true
    if (step === 4 && formData.flow?.skipProfesor === true) {
      setStep(6); // Saltar al paso 6 (confirmación)
    } else {
      setStep(step + 1);
    }
    
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