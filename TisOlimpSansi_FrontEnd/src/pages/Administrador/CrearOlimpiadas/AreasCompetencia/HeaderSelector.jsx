const HeaderSelector = ({ 
  nombreOlimpiada, 
  olimpiadas, 
  olimpiadaSeleccionada, 
  setOlimpiadaSeleccionada,
  titulo = "Áreas de Competencia",
  subtitulo = "Configure las áreas de competencia, categorías y niveles para la olimpiada seleccionada.",
  cargando = false,
  error = ""
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        {titulo}
      </h1>
      
      {nombreOlimpiada && (
        <h2 className="text-xl font-semibold text-center mb-6 text-blue-600">
          {nombreOlimpiada}
        </h2>
      )}

      <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow">
        <p className="text-gray-700">
          {subtitulo}
        </p>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <label className="font-semibold block mb-2">Seleccionar olimpiada:</label>
        
        {cargando ? (
          <div className="flex items-center text-gray-500">
            <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <span>Cargando olimpiadas...</span>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <select
            value={olimpiadaSeleccionada}
            onChange={(e) => setOlimpiadaSeleccionada(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          >
            <option value="">-- Seleccione una olimpiada --</option>
            {olimpiadas.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titulo}
              </option>
            ))}
          </select>
        )}
      </div>
    </>
  );
};

export default HeaderSelector;