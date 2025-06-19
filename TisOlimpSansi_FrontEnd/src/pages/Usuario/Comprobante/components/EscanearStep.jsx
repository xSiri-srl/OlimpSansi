import ImageCropper from "./ImageCropper";

const EscanearStep = ({ 
  preview, 
  selectedFile, 
  loading, 
  error, 
  onBack, 
  onCropSelection, 
  onProcesar 
}) => {
  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <div className="flex justify-center">
        <div className="bg-gray-400 p-6 rounded-md flex flex-col items-center justify-center">
          <img
            src="/images/recibo.jpg"
            alt="Boleta"
            className="max-w-full h-auto md:max-w-md lg:max-w-lg rounded-md shadow-lg"
          />
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg text-center font-semibold mb-2 text-gray-500">
          Por favor, seleccione el NÚMERO DEL COMPROBANTE
        </h2>
        <div className="flex justify-center mt-4">
          <ImageCropper
            image={preview}
            onCrop={(croppedFile) => onCropSelection('numero', croppedFile)}
          />
        </div>
        <p className="flex justify-center text-sm text-green-600 mt-2">
          {selectedFile?.numero
            ? selectedFile.numero.name
            : "No hay recorte de número"}
        </p>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg text-center font-semibold mb-2 text-gray-500">
          Por favor, seleccione el NOMBRE
        </h2>
        <div className="flex justify-center mt-4">
          <ImageCropper
            image={preview}
            onCrop={(croppedFile) => onCropSelection('nombre', croppedFile)}
          />
        </div>
        <p className="flex justify-center text-sm text-green-600 mt-2">
          {selectedFile?.nombre
            ? selectedFile.nombre.name
            : "No hay recorte de nombre"}
        </p>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg text-center font-semibold mb-2 text-gray-500">
          Por favor, seleccione la FECHA
        </h2>
        <div className="flex justify-center mt-4">
          <ImageCropper
            image={preview}
            onCrop={(croppedFile) => onCropSelection('fecha', croppedFile)}
          />
        </div>
        <p className="flex justify-center text-sm text-green-600 mt-2">
          {selectedFile?.fecha
            ? selectedFile.fecha.name
            : "No hay recorte de fecha"}
        </p>
      </div>
      
      <div className="mt-8 px-4">
        <h2 className="text-center text-lg font-semibold text-gray-600 mb-4">
          Vista previa del recorte
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6">
          {selectedFile?.numeroPreview && (
            <div className="flex flex-col items-center">
              <p className="text-center text-sm mb-2 text-gray-500">
                Número:
              </p>
              <img
                src={selectedFile.numeroPreview}
                alt="Número Recortado"
                className="w-full max-w-xs max-h-32 sm:max-h-48 object-contain border rounded shadow"
              />
            </div>
          )}
          
          {selectedFile?.nombrePreview && (
            <div className="flex flex-col items-center">
              <p className="text-center text-sm mb-2 text-gray-500">
                Nombre:
              </p>
              <img
                src={selectedFile.nombrePreview}
                alt="Nombre Recortado"
                className="w-full max-w-xs max-h-32 sm:max-h-48 object-contain border rounded shadow"
              />
            </div>
          )}
          
          {selectedFile?.fechaPreview && (
            <div className="flex flex-col items-center">
              <p className="text-center text-sm mb-2 text-gray-500">
                Fecha:
              </p>
              <img
                src={selectedFile.fechaPreview}
                alt="Fecha Recortado"
                className="w-full max-w-xs max-h-32 sm:max-h-48 object-contain border rounded shadow"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4 px-4">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md w-full sm:w-auto"
        >
          Atrás
        </button>
        <button
          onClick={onProcesar}
          disabled={
            loading ||
            !selectedFile?.numero ||
            !selectedFile?.nombre ||
            !selectedFile?.fecha
          }
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md w-full sm:w-auto ${
            selectedFile?.numero &&
            selectedFile?.nombre &&
            selectedFile?.fecha &&
            !loading
              ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Escaneando..." : "Escanear"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4 px-4">{error}</div>
      )}
    </div>
  );
};

export default EscanearStep;