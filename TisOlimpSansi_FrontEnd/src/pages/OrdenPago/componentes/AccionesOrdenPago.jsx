import React from "react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const AccionesOrdenPago = ({
  cargando,
  descargando,
  ordenYaGenerada,
  pdfUrl,
  mostrarPrevisualizacion,
  mostrarModal,
  progreso,
  codigoGenerado,
  confirmarGenerarOrden,
  togglePrevisualizacion,
  handleDownload,
  setMostrarModal,
}) => {
  return (
    <>
      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <button
          onClick={() => setMostrarModal(true)}
          disabled={cargando || descargando || ordenYaGenerada}
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md flex items-center gap-2 ${
            !cargando && !descargando && !ordenYaGenerada
              ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FaCloudUploadAlt />
          {ordenYaGenerada
            ? "Orden ya generada"
            : cargando
            ? "Generando..."
            : "Generar Orden de Pago"}
        </button>

        {pdfUrl && (
          <button
            onClick={togglePrevisualizacion}
            className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md flex items-center gap-2 bg-green-500 hover:-translate-y-1 hover:scale-110 hover:bg-green-600"
          >
            {mostrarPrevisualizacion ? <FaEyeSlash /> : <FaEye />}
            {mostrarPrevisualizacion
              ? "Ocultar Previsualización"
              : "Ver Previsualización"}
          </button>
        )}

        <button
          onClick={handleDownload}
          disabled={descargando || !ordenYaGenerada}
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md flex items-center gap-2 ${
            !descargando && ordenYaGenerada
              ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FaDownload />
          {descargando ? "Descargando..." : "Descargar PDF"}
        </button>
      </div>

      {/* Previsualización del PDF */}
      {mostrarPrevisualizacion && pdfUrl && (
        <div className="mt-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Previsualización de la Orden de Pago
          </h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <iframe
              src={pdfUrl}
              className="w-full h-[500px] border border-gray-300 rounded-md"
              title="Previsualización de la orden de pago"
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
            {ordenYaGenerada ? (
              <>
                <h2 className="text-xl font-bold text-red-600 mb-4">
                  ¡Ya existe una orden de pago generada!
                </h2>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
                  <div className="flex justify-center mb-4">
                    <FaExclamationTriangle className="text-yellow-500 text-5xl animate-pulse" />
                  </div>

                  <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                    ¿Estás seguro?
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Esta acción generar una orden de pago ¿Deseas continuar?
                  </p>

                  <div className="flex justify-center gap-6">
                    <button
                      onClick={confirmarGenerarOrden}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
                    >
                      <FaCheckCircle className="text-lg" />
                      Sí, crear
                    </button>
                    <button
                      onClick={() => setMostrarModal(false)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
                    >
                      <FaTimesCircle className="text-lg" />
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de carga - Generando */}
      {cargando && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white px-8 py-6 rounded-lg shadow-xl w-80 text-center">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Generando orden de pago...
            </h3>
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full text-white text-xs font-semibold text-center"
                style={{
                  width: `${progreso}%`,
                  transition: "width 0.3s ease-in-out",
                }}
              >
                {progreso}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de carga - Descargando */}
      {descargando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Descargando orden de pago...
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full text-white text-xs text-center transition-all duration-300"
                style={{ width: `${progreso}%` }}
              >
                {progreso}%
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccionesOrdenPago;
