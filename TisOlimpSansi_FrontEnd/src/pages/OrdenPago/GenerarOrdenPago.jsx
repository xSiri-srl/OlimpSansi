import { useState } from "react";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";
import axios from "axios";

const GenerarOrdenPago = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [resumen, setResumen] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [descargando, setDescargando] = useState(false);

  const endpoint = "http://localhost:8000/api";

  const verificarCodigo = async () => {
    setLoading(true);
    setError("");
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
      setResumen(response.data.resumen);
    } catch (error) {
      console.error("Error obteniendo el resumen:", error);
      setError("Error al obtener el resumen");
    }
  };
  const handleGenerarOrden = async () => {
    setGenerando(true);
    try {
      await axios.post(`${endpoint}/orden-pago/pdf`, {
        codigo_generado: codigoGenerado,
      })
      console.log("generado bien")
     
    } catch (error) {
      console.error("Error al Generar una Orden de Pago:", error);
      alert("Error al Generar una Orden de Pago");
    } finally{
      setGenerando(false);
    }
  };

  const handleDownload = async () => {
    setDescargando(true);
    try {
      const response = await axios.get(`${endpoint}/orden-pago/${codigoGenerado}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orden_pago_${codigoGenerado}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("Error al descargar la orden de pago");
    } finally{
      setDescargando(false);
    }
  };


  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-9 shadow-lg rounded-lg">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Por favor, ingrese el código de orden de pago proporcionado en el formulario de REGISTRAR COMPETIDOR.
          </h2>
          <input
            type="text"
            value={codigoGenerado}
            onChange={(e) => {
              setCodigoGenerado(e.target.value);
              setResumen(null);          
              setError("");             
            }}
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
            
            {/* Sección del responsable de inscripción */}
            <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-left max-w-3xl mx-auto">
              <div className="mb-6 border-b pb-4">
                <h3 className="text-lg font-semibold text-blue-600">Responsable de Inscripción</h3>
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
                    <p className="font-medium">{resumen.responsable.ci || ""}</p>
                  </div>
                  
                </div>
              </div>

              {/* Sección de resumen de competidores */}
              <div className={`mt-6 ${resumen.inscritos.length > 25 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
              <div className="mb-6 border-b pb-4">
                <h3 className="text-lg font-semibold text-blue-600">Resumen de Competidores</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Nombre</th>
                        <th className="px-4 py-2 border">Categoría</th>
                        <th className="px-4 py-2 border">Área</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.inscritos.map((inscrito, index) => (
                        <tr key={index} className="text-gray-800">
                          <td className="px-4 py-2 border">{index + 1}</td>
                          <td className="px-4 py-2 border">{inscrito.nombre_estudiante}</td>
                          <td className="px-4 py-2 border">{inscrito.categoria}</td>
                          <td className="px-4 py-2 border">{inscrito.area}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              </div>
              <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-blue-600 mb-3">Importe</h3>

          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600 font-medium">Costo por área</span>
            <span className="font-semibold">20 Bs.</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600 font-medium">Total de áreas</span>
            <span className="font-semibold">{resumen.inscritos.length}</span>
          </div>
          <div className="flex justify-between py-2 text-blue-700 font-bold text-lg">
            <span>Total a pagar</span>
            <span>{resumen.inscritos.length*20} Bs</span>
          </div>
        
      </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleGenerarOrden}
                disabled={generando}
                className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md flex items-center gap-2 ${
                  !generando
                    ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {generando ? "Generando..." : "Generar Orden de Pago"}
              </button>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDownload}
                disabled={descargando}
                className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md flex items-center gap-2 ${
                 !descargando
                    ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <FaDownload />
                {descargando ? "Descargando..." : "Descargar PDF"}
              </button>
            </div>
          </div>
          
        )}
      </div>
      
    </div>
  );
};

export default GenerarOrdenPago;
