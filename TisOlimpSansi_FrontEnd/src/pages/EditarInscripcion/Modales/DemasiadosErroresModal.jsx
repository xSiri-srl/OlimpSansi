import { FaExclamationTriangle } from "react-icons/fa";

const DemasiadosErroresModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mr-3" />
          <h3 className="text-xl font-semibold text-yellow-700">
            Demasiados errores
          </h3>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-700">
            Se han detectado más de 10 competidores con errores. Por favor,
            revise su archivo Excel y asegúrese de que todos los campos
            obligatorios estén correctamente completados.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors shadow-md"
          >
            Volver a subir archivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemasiadosErroresModal;
