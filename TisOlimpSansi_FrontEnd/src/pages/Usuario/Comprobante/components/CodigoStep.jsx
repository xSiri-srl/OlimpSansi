const CodigoStep = ({ 
  codigoGenerado, 
  setCodigoGenerado, 
  error, 
  loading, 
  onVerificar 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-300 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Ejemplo:</h3>
        <div className="bg-green-200 p-6 rounded-md flex flex-col items-center justify-center">
          <img
            src="/images/codigo.png"
            alt="Ejemplo Orden"
            className="w-40 h-10 md:h-10 lg:h-24 w-auto border-green-500 rounded-md border-4 border-dashed"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-500">
          Por favor, ingrese el código de orden de pago proporcionado en
          el formulario de REGISTRAR COMPETIDOR.
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
            onClick={onVerificar}
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
    </div>
  );
};

export default CodigoStep;