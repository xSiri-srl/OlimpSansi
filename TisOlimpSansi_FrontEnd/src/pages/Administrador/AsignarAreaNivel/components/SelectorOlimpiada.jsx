import React from "react";

const SelectorOlimpiada = ({
  nombreOlimpiada,
  olimpiadas,
  olimpiadaSeleccionada,
  setOlimpiadaSeleccionada,
  cargando,
  error,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Seleccionar Olimpiada:
      </label>
      
      {error ? (
        <div className="text-red-600 bg-red-100 p-3 rounded border">
          {error}
        </div>
      ) : (
        <select
          value={olimpiadaSeleccionada}
          onChange={(e) => setOlimpiadaSeleccionada(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={cargando}
        >
          <option value="">
            {cargando ? "Cargando olimpiadas..." : "Selecciona una olimpiada"}
          </option>
          {olimpiadas.map((olimpiada) => (
            <option key={olimpiada.id} value={olimpiada.id}>
              {olimpiada.titulo}
            </option>
          ))}
        </select>
      )}

      {nombreOlimpiada && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">
            <strong>Olimpiada seleccionada:</strong> {nombreOlimpiada}
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectorOlimpiada;