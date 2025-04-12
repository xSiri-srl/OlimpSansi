import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ExitoModal = ({ mensaje, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex flex-col items-center mb-4">
          <FaCheckCircle className="text-green-500 text-5xl mb-3" />
          <h3 className="text-xl font-semibold text-green-600">¡Operación exitosa!</h3>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-700">{mensaje}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitoModal;