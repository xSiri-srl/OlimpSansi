import React from "react";

export default function ModalConfirmacion({
  area,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirmación</h3>
        <p className="mb-6">
          ¿Cuenta con un profesor/entrenador para el área de {area}?
          <br />
          <br />
          Estos datos se considerarán en caso de ser acreedor de un premio académico.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            No, continuar
          </button>
          <button
            className="px-4 py-2 bg-[#4C8EDA] text-white rounded-md hover:bg-[#2e4f96]"
            onClick={onConfirm}
          >
            Sí, registrar profesor
          </button>
        </div>
      </div>
    </div>
  );
}