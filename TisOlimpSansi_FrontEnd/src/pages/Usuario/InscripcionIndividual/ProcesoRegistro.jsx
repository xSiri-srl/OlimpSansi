import React, { useState, useEffect, useRef } from "react";
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
  const carouselRef = useRef(null);

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

  useEffect(() => {
    const carousel = carouselRef.current;
    const activeStep = carousel.querySelector(`[data-step="${step}"]`);
    if (activeStep && window.innerWidth < 640) {
      const stepWidth = activeStep.offsetWidth;
      const scrollPosition =
        activeStep.offsetLeft - carousel.offsetWidth / 2 + stepWidth / 2;
      carousel.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [step]);

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
    setFormData((prev) => {
      const updatedNamespace = {
        ...prev[namespace],
        [field]: value,
      };

      if (
        namespace === "estudiante" &&
        field === "curso" &&
        (prev.estudiante?.areasSeleccionadas || prev.estudiante?.categoriasSeleccionadas)
      ) {
        updatedNamespace.areasSeleccionadas = [];
        updatedNamespace.categoriasSeleccionadas = {};
      }

      return {
        ...prev,
        [namespace]: updatedNamespace,
      };
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-200 p-6 sm:p-9 shadow-lg rounded-lg">
        <div className="relative mb-8 overflow-hidden">
          <div
            ref={carouselRef}
            className="flex items-center gap-4 sm:gap-6 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4 hide-scrollbar lg:flex-wrap lg:overflow-x-visible lg:justify-between"
          >
            {steps.map((stepLabel, index) => (
              <div
                key={index}
                data-step={index + 1}
                className="flex-none flex flex-col items-center snap-center min-w-[120px] sm:min-w-[150px] lg:flex-1 lg:min-w-0"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    index + 1 <= step
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-400 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs sm:text-sm mt-2 text-center font-medium transition-colors whitespace-nowrap lg:whitespace-normal ${
                    index + 1 <= step ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {stepLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
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
    </div>
  );
};

export default ProcesoRegistro;