import { useState } from "react";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";
import axios from "axios";

const GenerarOrdenPago = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [resumen, setResumen] = useState(null);

  const endpoint = "http://localhost:8000/api";

  const verificarCodigo = async () => {
    setLoading(true);
    setError("");
    setMensaje("");
    try {
      const response = await axios.get(`${endpoint}/obtener-orden-pago/${codigoGenerado}`);
      if (response.status === 200) {
        obtenerResumen(codigoGenerado);
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

  const obtenerResumen = async (codigo) => {
    try {
      const response = await axios.get(`${endpoint}/resumen-orden-pago/${codigo}`);
      setResumen(response.data);
    } catch (error) {
      console.error("Error obteniendo el resumen:", error);
      setError("Error al obtener el resumen");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full bg-gray-200 p-7 shadow-lg rounded-lg text-center">
        {/* Paso 1 - Ingresar código */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Por favor, ingrese el código de orden de pago proporcionado en el formulario de REGISTRAR COMPETIDOR.
          </h2>
          <input
            type="text"
            value={codigoGenerado}
            onChange={(e) => setCodigoGenerado(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el código"
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="flex justify-center mt-6">
            <button
              onClick={verificarCodigo}
              disabled={loading || !codigoGenerado.trim()}
              className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${codigoGenerado.trim() && !loading
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
            <h2 className="text-lg font-semibold mb-4 text-gray-500">Resumen de Preinscripción</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 border">Nombre</th>
                    <th className="px-4 py-2 border">Edad</th>
                    <th className="px-4 py-2 border">Categoría</th>
                    <th className="px-4 py-2 border">Monto</th>
                    <th className="px-4 py-2 border">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800">
                    <td className="px-4 py-2 border">{resumen.nombre}</td>
                    <td className="px-4 py-2 border">{resumen.edad}</td>
                    <td className="px-4 py-2 border">{resumen.categoria}</td>
                    <td className="px-4 py-2 border">Bs. {resumen.monto}</td>
                    <td className="px-4 py-2 border">{resumen.estado}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Botón para descargar PDF */}
        {/* <div className="flex justify-center mt-6">
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <FaDownload className="mr-2" /> Descargar PDF
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default GenerarOrdenPago;
