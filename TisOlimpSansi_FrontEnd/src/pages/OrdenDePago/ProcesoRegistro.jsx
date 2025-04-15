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

  const [formData, setFormData] = useState(() => {
    // Intentar cargar datos guardados al inicio
    const savedData = localStorage.getItem('formDataTemp');
    return savedData ? JSON.parse(savedData) : {
      flow: {
        redirectToProfesor: false,
        currentAreaIndex: 0,
        pendingAreas: [],
        skipProfesor: false
      },
      profesores: { areasRegistradas: [] }
    };
  });

  // Efecto para manejar la advertencia antes de recargar/cerrar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Mostrar mensaje de advertencia solo si hay datos en el formulario
      if (Object.keys(formData).length > 0) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro? Los datos del formulario se perderán si recargas o cierras esta página.';
        return e.returnValue;
      }
    };

    // Guardar datos temporalmente en localStorage
    const saveTempData = () => {
      localStorage.setItem('formDataTemp', JSON.stringify(formData));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', saveTempData);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', saveTempData);
      // Limpiar datos temporales al salir normalmente
      localStorage.removeItem('formDataTemp');
    };
  }, [formData]);

  // Efecto para limpiar datos al completar el proceso
  useEffect(() => {
    if (step > steps.length) {
      localStorage.removeItem('formDataTemp');
    }
  }, [step, steps.length]);

  useEffect(() => {
    if (formData.flow?.skipProfesor && step === 5) {
      setStep(6);
    }
  }, [formData.flow?.skipProfesor, step]);

  const handleNext = () => {
    if (formData.flow?.skipProfesor && step === 4) {
      setStep(6);
      return;
    }

    if (step === 5 && !formData.flow.redirectToProfesor) {
      if (formData.flow.pendingAreas?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          flow: {
            ...prev.flow,
            showNextAreaModal: true
          }
        }));
      } else {
        setStep(6);
      }
    } else if (formData.flow?.redirectToProfesor) {
      setStep(5);
    } else {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep > steps.length && nextRoute) {
        localStorage.removeItem('formDataTemp'); // Limpiar al completar
        navigate(nextRoute);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 6) {
        setFormData((prev) => ({
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
      localStorage.removeItem('formDataTemp'); // Limpiar al salir
      navigate(backRoute);
    }
  };

  const handleInputChange = (namespace, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [namespace]: {
        ...prev[namespace],
        [field]: value
      }
    }));
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-9 shadow-lg rounded-lg">
        {/* Progreso simplificado */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((stepLabel, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  index + 1 === step
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-400 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-2 ${
                  index + 1 === step ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {stepLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Renderiza el paso actual */}
        {React.Children.map(children, (child, index) =>
          index + 1 === step
            ? React.cloneElement(child, {
                formData,
                handleInputChange,
                handleNext,
                handleBack,
                navigate
              })
            : null
        )}
      </div>
    </div>
  );
};

export default ProcesoRegistro;