import { useState } from "react";
import {
  FaCheckCircle,
  FaCopy,
  FaEnvelope,
  FaPaperPlane,
  FaTimes
} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../../utils/api";

const ModalEnvioCodigo = ({ 
  codigoGenerado, 
  onClose, 
  globalData 
}) => {
  const [correoEnvio, setCorreoEnvio] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [errorEnvioCorreo, setErrorEnvioCorreo] = useState("");
  const [codigoCopiado, setCodigoCopiado] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoGenerado);
    setCodigoCopiado(true);
    setTimeout(() => setCodigoCopiado(false), 2000);
  };

  const enviarCorreoCodigo = async () => {
    if (!correoEnvio || !codigoGenerado) return;

    setEnviandoCorreo(true);
    setErrorEnvioCorreo("");

    try {
      await axios.post(`${API_URL}/api/enviar-codigo-preinscripcion`, {
        correo_tutor: correoEnvio,
        codigo: codigoGenerado,
        nombreResponsable: `${globalData.responsable_inscripcion?.nombre} ${globalData.responsable_inscripcion?.apellido_pa}`,
        nombreEstudiante: `${globalData.estudiante?.nombre} ${globalData.estudiante?.apellido_pa}`
      });
      
      setCorreoEnviado(true);
      setTimeout(() => setCorreoEnviado(false), 3000);
    } catch (error) {
      setErrorEnvioCorreo("Error al enviar el correo. Intente nuevamente.");
      console.error("Error al enviar correo:", error);
    } finally {
      setEnviandoCorreo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm overflow-hidden relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1"
        >
          <FaTimes className="text-sm" />
        </button>

        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 text-white text-center">
          <div className="flex justify-center mb-1">
            <div className="bg-white bg-opacity-20 p-1.5 rounded-full">
              <FaCheckCircle className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-base font-bold mb-0.5">¡Preinscripción Exitosa!</h3>
          <p className="text-green-100 text-xs">Registro procesado correctamente</p>
        </div>

        <div className="p-3">
          <div className="text-center mb-3">
            <p className="text-xs text-gray-600 mb-1">Código de Preinscripción:</p>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-2 mb-2">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-base font-bold text-blue-600 tracking-wider">
                  {codigoGenerado}
                </span>
                <button
                  onClick={copiarCodigo}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-all ${
                    codigoCopiado 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <FaCopy className="text-xs" />
                  {codigoCopiado ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-1.5">
              <div className="bg-blue-100 p-0.5 rounded-full">
                <FaEnvelope className="text-blue-600 text-xs" />
              </div>
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <h4 className="text-xs font-semibold text-gray-800 mb-2">
              Enviar código por correo
            </h4>
            
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correoEnvio}
                  onChange={(e) => setCorreoEnvio(e.target.value)}
                  className="w-full px-2.5 py-1.5 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
                <FaEnvelope className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              </div>
              
              <button
                onClick={enviarCorreoCodigo}
                disabled={!correoEnvio || enviandoCorreo || !codigoGenerado}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all ${
                  !correoEnvio || enviandoCorreo || !codigoGenerado
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <FaPaperPlane className="text-xs" />
                {enviandoCorreo ? 'Enviando...' : 'Enviar Código'}
              </button>
              
              {correoEnviado && (
                <div className="flex items-center justify-center gap-1.5 text-green-600 bg-green-50 p-1.5 rounded-lg">
                  <FaCheckCircle className="text-xs" />
                  <span className="text-xs font-medium">¡Correo enviado!</span>
                </div>
              )}
              
              {errorEnvioCorreo && (
                <div className="text-red-600 text-xs text-center bg-red-50 p-1.5 rounded-lg">
                  {errorEnvioCorreo}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-2.5 text-center">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-md hover:shadow-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEnvioCodigo;