import { FaExclamationCircle, FaTimes } from "react-icons/fa";

const RegistrosInvalidosModal = ({ mensaje, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 text-2xl mr-2" />
            <h3 className="text-xl font-semibold text-red-500">Error</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{mensaje}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrosInvalidosModal;
