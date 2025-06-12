import { FaEnvelope, FaTimes, FaExclamationTriangle } from "react-icons/fa";

const ModalConfirmacionCorreo = ({ isOpen, onClose, onConfirm, correo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300">
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl p-4 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors duration-200 hover:rotate-90 transform"
          >
            <FaTimes className="text-lg" />
          </button>

          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center animate-bounce">
              <FaEnvelope className="text-2xl " />
            </div>
            <h3 className="text-xl font-bold">Confirmación de Correo</h3>
            <p className="text-blue-100 mt-1 text-sm">
              Verificación necesaria para continuar
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="text-center mb-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 animate-pulse">
              <div className="flex items-center justify-center mb-2">
                <FaExclamationTriangle className="text-red-500 text-xl mr-2" />
                <span className="text-red-700 font-semibold">Importante</span>
              </div>
              <p className="text-red-700 leading-relaxed text-sm">
                Se enviará un{" "}
                <span className="font-semibold text-red-600">código</span> al
                siguiente correo electrónico para generar la orden de pago:
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -mr-8 -mt-8 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-indigo-100 rounded-full -ml-6 -mb-6 opacity-30"></div>

              <div className="relative z-10">
                <FaEnvelope className="text-blue-500 text-lg mx-auto mb-2" />
                <p className="font-bold text-lg text-gray-800 break-all">
                  {correo}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-b-2xl p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium text-center"
            >
              Modificar Correo
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
            >
              Confirmar y Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionCorreo;
