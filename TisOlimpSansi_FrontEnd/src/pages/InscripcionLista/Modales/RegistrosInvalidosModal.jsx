import { FaExclamationTriangle } from "react-icons/fa";

const RegistrosInvalidosModal = ({ mensaje, onClose }) => {
  const mensajeTexto =
    typeof mensaje === "string"
      ? mensaje
      : mensaje?.mensaje || "Ocurrió un error inesperado.";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full">
        <div className="flex items-center mb-4 text-red-600">
          <FaExclamationTriangle className="text-3xl mr-2" />
          <h2 className="text-xl font-bold">Error</h2>
        </div>

        <p className="text-gray-800 whitespace-pre-wrap">{mensajeTexto}</p>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrosInvalidosModal;
