import { useState, useEffect, useRef } from "react";
import RegistroResponsable from "./RegistroResponsable";
import SubirArchivo from "./SubirArchivo";
import ListaCompetidores from "./ListaCompetidores";
import ConfirmationLista from "./confirmationLista";
import RegistroColegio from "./RegistroColegio";

const RegistroPorLista = () => {
  const [step, setStep] = useState(1);
  const carouselRef = useRef(null);

  const pasos = [
    "Responsable de Inscripción",
    "Seleccionar Unidad Educativa",
    "Subir Lista ­",
    "Lista de Competidores ­ ",
    "Confirmación ­",
  ];

 
  useEffect(() => {
    const carousel = carouselRef.current;
    const activeStep = carousel.querySelector(`[data-step="${step}"]`);
    if (activeStep) {
      const stepWidth = activeStep.offsetWidth;
      const scrollPosition =
        activeStep.offsetLeft - carousel.offsetWidth / 2 + stepWidth / 2;
    
      if (window.innerWidth < 640) {
        carousel.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    }
  }, [step]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-200 p-6 sm:p-9 shadow-xl rounded-xl">

        <div className="relative mb-8 overflow-hidden">
          <div
            ref={carouselRef}
            className="flex items-center justify-between gap-4 sm:gap-6 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4 hide-scrollbar sm:justify-start lg:justify-between lg:overflow-x-hidden"
          >
            {pasos.map((stepLabel, index) => (
              <div
                key={index}
                data-step={index + 1}
                className="flex-none flex flex-col items-center snap-center min-w-[120px] sm:min-w-[150px] lg:flex-1"
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
                  className={`text-xs sm:text-sm mt-2 text-center font-medium transition-colors whitespace-nowrap sm:whitespace-normal ${
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
          {step === 1 && <RegistroResponsable setStep={setStep} />}
          {step === 2 && <RegistroColegio setStep={setStep} />}
          {step === 3 && <SubirArchivo setStep={setStep} />}
          {step === 4 && <ListaCompetidores setStep={setStep} />}
          {step === 5 && <ConfirmationLista setStep={setStep} />}
        </div>
      </div>
    </div>
  );
};

export default RegistroPorLista;