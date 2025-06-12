import { useState } from "react";
import {
  FaCheckCircle,
  FaCopy,
  FaEnvelope,
  FaPaperPlane,
  FaTimes,
  FaExclamationTriangle,
  FaEye,
  FaCamera,
  FaBook,
} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../../utils/api";

const ModalEnvioCodigo = ({ codigoGenerado, onClose, globalData }) => {
  const [correoEnvio, setCorreoEnvio] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [errorEnvioCorreo, setErrorEnvioCorreo] = useState("");
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoGenerado);
    setCodigoCopiado(true);
    setTimeout(() => setCodigoCopiado(false), 2000);
  };

  const confirmarEnvio = () => {
    setMostrarConfirmacion(true);
  };

  const enviarCorreoCodigo = async () => {
    if (!correoEnvio || !codigoGenerado) return;

    setMostrarConfirmacion(false);
    setEnviandoCorreo(true);
    setErrorEnvioCorreo("");

    try {
      await axios.post(`${API_URL}/api/enviar-codigo-preinscripcion`, {
        correo_tutor: correoEnvio,
        codigo: codigoGenerado,
        nombreResponsable: `${globalData.responsable_inscripcion?.nombre} ${globalData.responsable_inscripcion?.apellido_pa}`,
        nombreEstudiante: `${globalData.estudiante?.nombre} ${globalData.estudiante?.apellido_pa}`,
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

  if (mostrarConfirmacion) {
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
              <p className="text-sm font-semibold text-gray-800">
                {correoEnvio}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded-lg font-semibold text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={enviarCorreoCodigo}
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
  }

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
          <h3 className="text-base font-bold mb-0.5">
            ¡Preinscripción Exitosa!
          </h3>
          <p className="text-green-100 text-xs">
            Registro procesado correctamente
          </p>
        </div>

        <div className="p-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 animate-pulse">
            <div className="flex items-center text-red-800 p-2">
              <FaExclamationTriangle className="text-red-700 text-4xl mr-2 flex-shrink-0" />

              <p className="text-xl font-medium">
                <strong>¡Importante!</strong> Guarda este código antes de
                continuar
              </p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg mb-4 p-2">
              <h4 className="text-red-800 font-bold text-sm mb-2 flex items-center">
                <FaEye className="mr-2 animate-spin-slow" />
                Guarda tu código de estas formas:
              </h4>
              <div className="space-y-2 text-xs text-red-700">
                <div className="flex items-center transition-transform hover:scale-105">
                  <FaEnvelope className="mr-2 text-red-500" />
                  <span>
                    <strong>Envía a tu correo</strong> el código
                  </span>
                </div>
                <div className="flex items-center transition-transform hover:scale-105">
                  <FaCamera className="mr-2 text-red-500" />
                  <span>
                    <strong>Captura de pantalla</strong> de esta ventana
                  </span>
                </div>
                <div className="flex items-center transition-transform hover:scale-105">
                  <FaBook className="mr-2 text-red-500" />
                  <span>
                    <strong>Anótalo</strong> en tu cuaderno o agenda
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-3">
            <p className="text-xs text-gray-600 mb-1">
              Código de Preinscripción:
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-dashed border-blue-300 rounded-lg p-3 mb-2 shadow-inner">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-lg font-black text-blue-700 tracking-wider">
                  {codigoGenerado}
                </span>
                <button
                  onClick={copiarCodigo}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                    codigoCopiado
                      ? "bg-green-500 text-white animate-pulse"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                  }`}
                >
                  <FaCopy className="text-xs" />
                  {codigoCopiado ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
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
                onClick={confirmarEnvio}
                disabled={!correoEnvio || enviandoCorreo || !codigoGenerado}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                  !correoEnvio || enviandoCorreo || !codigoGenerado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                <FaPaperPlane className="text-xs" />
                {enviandoCorreo ? "Enviando..." : "Enviar Código"}
              </button>

              {correoEnviado && (
                <div className="flex items-center justify-center gap-1.5 text-green-600 bg-green-50 p-2 rounded-lg animate-pulse">
                  <FaCheckCircle className="text-xs" />
                  <span className="text-xs font-medium">
                    ¡Correo enviado exitosamente!
                  </span>
                </div>
              )}

              {errorEnvioCorreo && (
                <div className="text-red-600 text-xs text-center bg-red-50 p-1.5 rounded-lg border border-red-200">
                  {errorEnvioCorreo}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-2.5 text-center">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEnvioCodigo;
