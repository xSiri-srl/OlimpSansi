import React from "react";

const CodigoVerificacion = ({
  codigoGenerado,
  error,
  loading,
  verificarCodigo,
  handleCodigoChange,
}) => {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
        Ingrese el código de orden de pago proporcionado en el formulario de
        REGISTRAR COMPETIDOR.
      </h2>
      <input
        type="text"
        value={codigoGenerado}
        onChange={(e) => handleCodigoChange(e.target.value)}
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
  );
};

export default CodigoVerificacion;
