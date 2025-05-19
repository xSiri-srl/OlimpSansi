import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProcesoRegistro = ({
  steps,
  initialStep = 1,
  nextRoute,
  backRoute,
  children,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [hasFormData, setHasFormData] = useState(false);

  const [formData, setFormData] = useState({
    flow: {
      redirectToProfesor: false,
      currentAreaIndex: 0,
      pendingAreas: [],
      skipProfesor: false,
    },
    profesores: { areasRegistradas: [] },
  });

  useEffect(() => {
    const checkFormData = () => {
      const hasData =
        formData.profesores.areasRegistradas.length > 0 ||
        Object.values(formData.flow).some((val) => {
          if (typeof val === "boolean" && val === true) return true;
          if (typeof val === "number" && val > 0) return true;
          if (Array.isArray(val) && val.length > 0) return true;
          return false;
        });

      setHasFormData(hasData);
    };

    checkFormData();
  }, [formData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData) {
        e.preventDefault();
        e.returnValue =
          "¿Estás seguro? Los datos del formulario no se guardarán si sales de esta página.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasFormData]);

  const handleNext = () => {
    if (step < steps.length) {
      window.scrollTo(0, 0);
      setStep(step + 1);
    } else if (step === steps.length) {
      navigate(nextRoute);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      window.scrollTo(0, 0);
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
      <div className="max-w-4xl mx-auto bg-gray-200 p-9 shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-6">
          {steps.map((stepLabel, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  index + 1 < step
                    ? "bg-blue-500 text-white border-blue-500"
                    : index + 1 === step
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-400 text-gray-400 bg-gray"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-2 text-center ${
                  index + 1 === step ? "text-blue-600" : "text-gray-400"
                }`}
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
              navigate,
            });
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ProcesoRegistro;
