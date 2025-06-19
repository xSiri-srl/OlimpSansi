import React from 'react';

const ModalExitoComprobante = ({ isOpen, onAceptar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">
          ¡Su comprobante fue subido con éxito!
        </h2>
        <p className="text-gray-600">FINALIZÓ SU INSCRIPCIÓN</p>
        <button
          onClick={onAceptar}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ModalExitoComprobante;