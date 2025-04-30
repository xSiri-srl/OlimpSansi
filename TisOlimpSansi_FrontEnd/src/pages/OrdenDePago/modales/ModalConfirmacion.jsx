import React from "react";
import { FaChalkboardTeacher, FaQuestion } from "react-icons/fa";

export default function ModalConfirmacion({ area, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {/* Icono llamativo */}
          <div className="text-blue-600 mb-4">
            <FaChalkboardTeacher size={60} className="animate-pulse" />
          </div>

          <h3 className="text-xl font-semibold mb-4">Confirmación</h3>
          
          <p className="mb-6">
            ¿Cuenta con un profesor/entrenador para el área de <br/>
            <span className="font-bold text-blue-700 text-lg">
              {area}
            </span>? 
            <br /><br />
            Estos datos se considerarán en caso de ser acreedor de un premio académico.
          </p>
          
          <div className="flex justify-center gap-3 w-full mt-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-all hover:-translate-y-1 hover:shadow-md"
              onClick={onCancel}
            >
              No, continuar
            </button>
            <button
              className="px-4 py-2 bg-[#4C8EDA] text-white rounded-md hover:bg-[#2e4f96] transition-all hover:-translate-y-1 hover:shadow-md"
              onClick={onConfirm}
            >
              Sí, registrar profesor de {area}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}