import React from 'react';

function RegistroResponsable({ setStep }) {
  const handleSeleccion = () => {
    setStep(2); // Ir al paso 2
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Registro del responsable</h2>


      <button
        onClick={handleSeleccion}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Siguiente
      </button>
    </div>
  );
}

export default RegistroResponsable;
