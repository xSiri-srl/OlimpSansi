import React, { useState, useEffect } from 'react';
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
  const [hasFormData, setHasFormData] = useState(false);

  const [formData, setFormData] = useState({
    flow: { 
      redirectToProfesor: false,
      currentAreaIndex: 0,
      pendingAreas: [],
      skipProfesor: false      
    },
    profesores: { areasRegistradas: [] }
  });

  // Verificar si hay datos en el formulario para mostrar advertencia
  useEffect(() => {
    const checkFormData = () => {
      const hasData = 
        formData.flow.pendingAreas.length > 0 ||
        formData.profesores.areasRegistradas.length > 0 ||
        Object.values(formData.flow).some(val => val !== false && val !== 0);
      
      setHasFormData(hasData);
    };

    checkFormData();
  }, [formData]);

  // Configurar advertencia antes de recargar/cerrar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro? Los datos del formulario no se guardarán si sales de esta página.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasFormData]);

  useEffect(() => {
    if (formData.flow?.skipProfesor === true && step === 5) {
      setStep(6);
    }
  }, [formData.flow?.skipProfesor, step]);

  const handleNext = () => {
    if (formData.flow?.skipProfesor === true) {
      setStep(6);
      return;
    }
  
    if (step === 5 && !formData.flow.redirectToProfesor) {
      if (formData.flow.pendingAreas && formData.flow.pendingAreas.length > 0) {
        setFormData(prev => ({
          ...prev,
          flow: {
            ...prev.flow,
            showNextAreaModal: true
          }
        }));
      } else {
        setStep(6); 
      }
    }
    else if (formData.flow?.redirectToProfesor) {
      setStep(5);
    } 
    else if (step < steps.length) {
      if (step === 4 && formData.flow?.skipProfesor === true) {
        setStep(6); 
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
      if (step === 6) {
        setFormData(prev => ({
          ...prev,
          flow: {
            ...prev.flow,
            editingTutores: true,
            skipProfesor: false,  
            redirectToProfesor: false,
            pendingAreas: [], 
            showNextAreaModal: false
          }
        }));
        setStep(5);
      } else {
        setStep(step - 1);
      }
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
    <div className="p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-4 md:p-7 shadow-lg rounded-lg">
        {/* Stepper responsive */}
        <div className="relative mb-8">
          <div className="hidden sm:block absolute top-4 left-0 right-0 h-0.5 bg-gray-300">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between min-w-max sm:min-w-0 sm:w-full px-2">
              {steps.map((stepLabel, index) => (
                <div key={index} className="flex flex-col items-center relative px-2 sm:px-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 transition-all
                      ${index + 1 < step 
                        ? "bg-blue-500 text-white border-blue-500"
                        : index + 1 === step
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-400 text-gray-400"}
                    `}
                  >
                    {index + 1}
                  </div>
                  
                  <span
                    className={`text-xs mt-2 text-center w-16 sm:w-20 md:w-24 transition-all
                      ${index + 1 < step 
                        ? "text-blue-500"
                        : index + 1 === step
                          ? "text-blue-600 font-medium"
                          : "text-gray-400"}
                    `}
                  >
                    {stepLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
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