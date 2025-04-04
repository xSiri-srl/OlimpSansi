import React, { useState } from 'react';
import RegistroResponsable from './RegistroResponsable';
import SubirArchivo from './SubirArchivo';

const RegistroPorLista = () => {
  const [step, setStep] = useState(1);

  const pasos = [
    'Registrar responsable',
    'Subir lista',
    'Lista de competidores',
    'Confirmar',
  ];

  return (
    <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
      {/* Progreso */}
      <div className="flex items-center justify-between mb-6">
        {pasos.map((stepLabel, index) => (
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

      {/* Contenido de cada paso */}
      {step === 1 && <RegistroResponsable setStep={setStep} />}
      {step === 2 && <SubirArchivo setStep={setStep} />}
    </div>
  );
};

export default RegistroPorLista;
