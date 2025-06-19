const DatosEscaneadosStep = ({
  preview,
  selectedFile,
  numeroComprobante,
  setNumeroComprobante,
  comprobanteNombre,
  setcomprobanteNombre,
  fechaComprobante,
  setfechaComprobante,
  errorNumero,
  errorNombre,
  errorFecha,
  errorNumeroUnico,
  setErrorNumeroUnico,
  loading,
  error,
  onScanAgain,
  onFinalizar
}) => {
  const handleNumeroChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 7) {
      setNumeroComprobante(value);
      setErrorNumeroUnico("");
    }
  };

  const handleNombreChange = (e) => {
    const value = e.target.value.toUpperCase();
    setcomprobanteNombre(value);
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-600">
        Comprobante de pago
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <div className="border-2 border-blue-500 p-2 sm:p-4 w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl h-48 sm:h-72 md:h-96 lg:h-[28rem] xl:h-[32rem] flex items-center justify-center bg-gray-100 rounded-lg mx-auto">
          {preview ? (
            selectedFile?.type === "application/pdf" ? (
              <embed
                src={preview}
                type="application/pdf"
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            ) : (
              <img
                src={preview}
                alt="Comprobante"
                className="max-w-full max-h-full rounded-lg object-contain"
              />
            )
          ) : (
            <span className="text-gray-500 text-sm sm:text-base text-center px-2">
              Vista previa
            </span>
          )}
        </div>
        <div className="w-full bg-gray-50 p-4 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1">
                Número de comprobante * 
              </label>
              <input
                type="text"
                placeholder="Ej. 123456"
                value={numeroComprobante}
                onChange={handleNumeroChange}
                maxLength={7}
                className={`w-full p-2 border ${
                  errorNumero || errorNumeroUnico ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2`}
              />
              {errorNumero && (
                <p className="text-red-500 text-sm mt-1">{errorNumero}</p>
              )}
              {errorNumeroUnico && (
                <p className="text-red-500 text-sm mt-1">{errorNumeroUnico}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1">
                Nombre del responsable *
              </label>
              <input
                type="text"
                placeholder="Ej. JUAN PÉREZ"
                value={comprobanteNombre}
                onChange={handleNombreChange}
                style={{ textTransform: 'uppercase' }}
                className={`w-full p-2 border ${
                  errorNombre ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2`}
              />
              {errorNombre && (
                <p className="text-red-500 text-sm mt-1">{errorNombre}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1">
                Fecha*
              </label>
              <input
                type="text"
                placeholder="Ej. 04-02-22"
                value={fechaComprobante}
                onChange={(e) => setfechaComprobante(e.target.value)}
                className={`w-full p-2 border ${
                  errorFecha ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2`}
              />
              {errorFecha && (
                <p className="text-red-500 text-sm mt-1">{errorFecha}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-3xl font-bold mt-6">
        Verifique que sus datos estén correctos
      </p>
      <p className="text-2xl font-semibold mt-6">
        ¿Los datos que ingresó son correctos?
      </p>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={onScanAgain}
          className="bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500 shadow-md"
        >
          Volver a escanear
        </button>
        <button
          onClick={onFinalizar}
          disabled={loading || !selectedFile}
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
            selectedFile && !loading
              ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Finalizando..." : "Finalizar"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">{error}</div>
      )}
    </div>
  );
};

export default DatosEscaneadosStep;