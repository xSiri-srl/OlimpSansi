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
      skipProfesor: false      
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
      // Verificar si hay más áreas pendientes
      if (formData.flow.pendingAreas && formData.flow.pendingAreas.length > 0) {
        // Aún hay áreas por procesar, mostrar el siguiente modal 
        setFormData(prev => ({
          ...prev,
          flow: {
            ...prev.flow,
            showNextAreaModal: true
          }
        }));
      } else {
        // No hay más áreas pendientes
        setStep(6); 
      }
    }
    else if (formData.flow?.redirectToProfesor) {
      setStep(5);
    } 
// Caso normal: avanzar al siguiente paso
  else if (step < steps.length) {
    // Si estamos en el paso 4 (tutor legal) y skipProfesor es true
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
    console.log("handleBack called, current step:", step);
    
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
            showNextAreaModal: false // Asegurarse de que no aparezca el modal
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
          {/* Barra de progreso horizontal */}
          <div className="hidden sm:block absolute top-4 left-0 right-0 h-0.5 bg-gray-300">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          {/* Contenedor scrollable para dispositivos pequeños */}
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between min-w-max sm:min-w-0 sm:w-full px-2">
              {steps.map((stepLabel, index) => (
                <div key={index} className="flex flex-col items-center relative px-2 sm:px-0">
                  {/* Círculo numerado */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 transition-all
                      ${index + 1 < step 
                        ? "bg-blue-500 text-white border-blue-500" // Paso completado
                        : index + 1 === step
                          ? "bg-blue-600 text-white border-blue-600" // Paso actual
                          : "bg-white border-gray-400 text-gray-400"} // Paso pendiente
                    `}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Etiqueta del paso */}
                  <span
                    className={`text-xs mt-2 text-center w-16 sm:w-20 md:w-24 transition-all
                      ${index + 1 < step 
                        ? "text-blue-500" // Paso completado
                        : index + 1 === step
                          ? "text-blue-600 font-medium" // Paso actual 
                          : "text-gray-400"} // Paso pendiente
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