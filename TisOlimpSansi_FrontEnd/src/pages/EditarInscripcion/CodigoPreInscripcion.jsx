import { useState } from 'react';
import axios from 'axios';

const CodigoPreInscripcion = () => {
  // Estados
  const [codigoPreInscripcion, setCodigoCodigoPreInscripcion] = useState('');
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const endpoint = "http://127.0.0.1:8000/api";

  // Función para verificar el código (simulada)
  const verificarCodigo = async () => {
    if (!codigoPreInscripcion.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${endpoint}/preinscritos-por-codigo`, {
        params: {
          codigo: codigoPreInscripcion
        }
      });
      console.log("Mensaje del backend:", response.data?.res); // "Hola"      
    } catch (err) {
      setError('Error al verificar el código. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="p-10">
  <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
    {/* Barra de pasos */}
    <div className="flex flex-center justify-between flex-nowrap overflow-x-auto mb-6">
      {[
        "Ingresar código",
        "paso?",
        "paso?",
        "paso?",
        "paso?",
        "Finalizar",
      ].map((stepLabel, index) => (
        <div key={index} className="flex flex-col items-center flex-shrink-0 w-24">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              index + 1 === step
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-400 text-gray-400"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`text-[13px] mt-2 text-center break-words ${
              index + 1 === step ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {stepLabel}
          </span>
        </div>
      ))}
    </div>

    {/* Paso1 Ingresar código */}
    {step === 1 && (
      <div className="bg-gray-200 p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-500">
          Por favor, ingrese el código de pre inscripcion proporcionado al
          finalizar el formulario de REGISTRAR COMPETIDOR.
        </h2>
        <input
          type="text"
          value={codigoPreInscripcion}
          onChange={(e) => setCodigoCodigoPreInscripcion(e.target.value)}
          className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingrese el código"
        />

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="flex justify-center mt-6">
          <button
            onClick={verificarCodigo}
            disabled={loading || !codigoPreInscripcion.trim()}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              codigoPreInscripcion.trim() && !loading
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>
        </div>
      </div>
    )}
  </div>
</div>
  );
};

export default CodigoPreInscripcion;