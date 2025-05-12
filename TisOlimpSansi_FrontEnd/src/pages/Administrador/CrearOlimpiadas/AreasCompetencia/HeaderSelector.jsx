import React from "react";

const HeaderSelector = ({
  nombreOlimpiada,
  olimpiadas,
  olimpiadaSeleccionada,
  setOlimpiadaSeleccionada,
  cargando,
  error
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Áreas de Competencia
      </h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex-1 w-full md:w-auto">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="olimpiada">
            Seleccionar Olimpiada
          </label>
          <select
            id="olimpiada"
            className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={olimpiadaSeleccionada}
            onChange={(e) => setOlimpiadaSeleccionada(e.target.value)}
            disabled={cargando}
          >
            <option value="">Seleccionar...</option>
            {olimpiadas.map((olimpiada) => (
              <option key={olimpiada.id} value={olimpiada.id}>
                {olimpiada.titulo}
              </option>
            ))}
          </select>
        </div>
        
        {nombreOlimpiada && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center flex-1">
            <h3 className="text-sm text-blue-500 font-semibold">Olimpiada Seleccionada</h3>
            <p className="text-xl font-bold text-blue-800">{nombreOlimpiada}</p>
          </div>
        )}
      </div>
      
      {olimpiadaSeleccionada && (
        <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="text-green-700 text-center">
            Seleccione las áreas de competencia que desea asociar a esta olimpiada
          </p>
        </div>
      )}
    </div>
  );
};

export default HeaderSelector;