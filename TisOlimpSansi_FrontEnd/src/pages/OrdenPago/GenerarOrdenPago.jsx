import { useEffect, useState } from "react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { API_URL } from "../../utils/api";
import axios from "axios";


const GenerarOrdenPago = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenYaGenerada, setOrdenYaGenerada] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null); // Estado para la previsualización
  const [mostrarPrevisualizacion, setMostrarPrevisualizacion] = useState(false); // Estado para mostrar/ocultar previsualización


  // Efecto para la barra de progreso
  useEffect(() => {
    let timer;
    if (cargando || descargando) {
      setProgreso(0);
      timer = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [cargando, descargando]);

  // Nueva función para obtener el PDF
  const obtenerPdf = async () => {
    try {
      const pdfResponse = await axios.get(
        `${API_URL}/api/orden-pago/${codigoGenerado}`,
        { responseType: "blob" }
      );
      const pdfBlob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setMostrarPrevisualizacion(true); // Mostrar previsualización automáticamente
    } catch (error) {
      console.error("Error obteniendo el PDF:", error);
      setError("Error al obtener el PDF para previsualización");
    }
  };

  // Verificar si el código existe y obtener el resumen
  const verificarCodigo = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URL}/api/obtener-orden-pago/${codigoGenerado}`
      );
      if (response.status === 200) {
        await obtenerResumen(codigoGenerado);
        // Verificar si la orden ya está generada
        const existeResponse = await axios.get(
          `${API_URL}/api/orden-pago-existe/${codigoGenerado}`
        );
        setOrdenYaGenerada(existeResponse.data.existe);
        if (existeResponse.data.existe) {
          // Si la orden ya existe, obtener el PDF para previsualización
          await obtenerPdf();
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No existe una orden de pago asociada a ese código.");
      } else {
        setError("Error al verificar el código.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener el resumen de la orden
  const obtenerResumen = async (codigo) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/resumen-orden-pago/${codigo}`
      );
      setResumen(response.data.resumen);
    } catch (error) {
      console.error("Error obteniendo el resumen:", error);
      setError("Error al obtener el resumen");
    }
  };

  // Generar la orden de pago
  const confirmarGenerarOrden = async () => {
    setMostrarModal(false);
    setCargando(true);
    setProgreso(0);

    try {
      const response = await axios.get(
        `${API_URL}/api/orden-pago-existe/${codigoGenerado}`
      );
      if (response.data.existe) {
        setOrdenYaGenerada(true);
        setCargando(false);
        await obtenerPdf(); // Obtener el PDF si ya existe
        return;
      }

      await axios.post(
        `${API_URL}/api/orden-pago/pdf`,
        { codigo_generado: codigoGenerado },
        { responseType: "blob" }
      );
      console.log("Orden de pago generada correctamente");
      setOrdenYaGenerada(true);

      // Obtener el PDF recién generado para previsualización
      await obtenerPdf();
    } catch (error) {
      console.error("Error generando la orden de pago:", error);
      setError("Error generando la orden de pago.");
    } finally {
      setTimeout(() => {
        setCargando(false);
        setProgreso(0);
      }, 1000);
    }
  };

  // Descargar el PDF
  const handleDownload = async () => {
    setDescargando(true);
    setProgreso(0);

    try {
      if (pdfUrl) {
        // Usar el pdfUrl existente para la descarga
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", `orden_pago_${codigoGenerado}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // Si no hay pdfUrl, obtener el PDF del servidor
        await obtenerPdf();
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", `orden_pago_${codigoGenerado}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("Error descargando PDF:", error);
      setError("Error al descargar la orden de pago");
    } finally {
      setTimeout(() => {
        setDescargando(false);
        setProgreso(0);
      }, 1000);
    }
  };

  // Alternar previsualización
  const togglePrevisualizacion = () => {
    setMostrarPrevisualizacion(!mostrarPrevisualizacion);
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 sm:p-9 shadow-lg rounded-lg">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
            Ingrese el código de orden de pago proporcionado en el formulario de
            REGISTRAR COMPETIDOR.
          </h2>
          <input
            type="text"
            value={codigoGenerado}
            onChange={(e) => {
              setCodigoGenerado(e.target.value);
              setResumen(null);
              setError("");
              setOrdenYaGenerada(false);
              setPdfUrl(null);
              setMostrarPrevisualizacion(false);
            }}
            className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el código"
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="flex justify-center mt-6">
            <button
              onClick={verificarCodigo}
              disabled={loading || !codigoGenerado.trim()}
              className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
                codigoGenerado.trim() && !loading
                  ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          </div>
        </div>

        {/* Resumen de preinscripción */}
        {resumen && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-500">
              Resumen de Preinscripción
            </h2>

            {/* Sección del responsable de inscripción */}
            <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-left max-w-3xl mx-auto">
              <div className="mb-6 border-b pb-4">
                <h3 className="text-lg font-semibold text-blue-600">
                  Responsable de Inscripción
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Nombre Completo</p>
                    <p className="font-medium">
                      {`${resumen.responsable.nombre || ""} 
                        ${resumen.responsable.apellido_pa || ""} 
                        ${resumen.responsable.apellido_ma || ""}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Carnet de Identidad</p>
                    <p className="font-medium">
                      {resumen.responsable.ci || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección de resumen de competidores */}
              <div
                className={`mt-6 ${
                  resumen.inscritos.length > 25
                    ? "max-h-96 overflow-y-auto pr-2"
                    : ""
                }`}
              >
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Resumen de Competidores
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="px-4 py-2 border">#</th>
                          <th className="px-4 py-2 border">Nombre</th>
                          <th className="px-4 py-2 border">Categoría</th>
                          <th className="px-4 py-2 border">Área</th>
                          <th className="px-4 py-2 border">Curso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumen.inscritos.map((inscrito, index) => (
                          <tr key={index} className="text-gray-800">
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                              {inscrito.nombre_estudiante}
                            </td>
                            <td className="px-4 py-2 border">
                              {inscrito.categoria}
                            </td>
                            <td className="px-4 py-2 border">
                              {inscrito.area}
                            </td>
                            <td className="px-4 py-2 border">
                              {inscrito.grado}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  Importe
                </h3>
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 font-medium">
                    Costo por área
                  </span>
                  <span className="font-semibold">20 Bs.</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 font-medium">
                    Total de áreas
                  </span>
                  <span className="font-semibold">
                    {resumen.inscritos.length}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-blue-700 font-bold text-lg">
                  <span>Total a pagar</span>
                  <span>{resumen.inscritos.length * 20} Bs</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                  onClick={confirmarGenerarOrden}
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

            {/* Modal de confirmación o orden ya generada */}
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
                    <>
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
                          <div className="flex justify-center mb-4">
                            <FaExclamationTriangle className="text-yellow-500 text-5xl animate-pulse" />
                          </div>

                          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                            ¿Estás seguro?
                          </h2>
                          <p className="text-gray-600 text-sm mb-6">
                            Esta acción generar una orden de pago ¿Deseas
                            continuar?
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
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Modal de carga */}
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

            {/* Modal de descarga */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerarOrdenPago;
