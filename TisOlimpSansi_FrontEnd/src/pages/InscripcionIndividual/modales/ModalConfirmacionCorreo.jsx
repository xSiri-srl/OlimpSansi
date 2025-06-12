import { FaExclamationTriangle, FaPaperPlane } from "react-icons/fa";

const ModalConfirmacionCorreo = ({ correo, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-70 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <div className="bg-red-700 text-white text-center p-6">
          <div className="flex justify-center mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-full animate-bounce">
              <FaExclamationTriangle className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">¿Estás seguro?</h3>
          <p className="text-sm">Confirma el correo</p>
        </div>

        <div className="p-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 rounded-r-lg animate-pulse">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-600 text-5xl mr-5 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 font-bold text-sl mb-1">
                  ¡IMPORTANTE!
                </h4>
                <p className="text-red-700 text-xs leading-relaxed">
                  <strong>VERIFIQUE EL CORREO ANTES DE ENVIAR</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 mb-4 text-center">
            <p className="text-xs text-gray-600 mb-1">Se enviará a:</p>
            <p className="text-sm font-semibold text-gray-800">{correo}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded-lg font-semibold text-sm transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FaPaperPlane className="text-xs" />
              Sí, Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionCorreo;
