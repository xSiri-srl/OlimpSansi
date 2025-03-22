import { useState } from "react";

const SubirComprobante = () => {
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setStep(3);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      {/* Progreso */}
      <div className="flex items-center justify-between mb-6">
        {["Ingresar código", "Subir comprobante", "Escanear", "Ver datos escaneados", "Finalizar"].map((stepLabel, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                index + 1 === step ? "bg-blue-600 text-white border-blue-600" : "border-gray-400 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span className={`text-xs mt-2 ${index + 1 === step ? "text-blue-600" : "text-gray-400"}`}>
              {stepLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Paso 1 - Ingresar código */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Ingrese el código generado en el formulario anterior para continuar con su inscripción
            </h2>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Ingrese el código"
            />
            <button onClick={() => setStep(2)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Verificar
            </button>
          </div>

          <div className="bg-gray-300 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Ejemplo:</h3>
            <div className="bg-gray-400 p-6 rounded-md flex flex-col items-center justify-center">
              <div className="bg-gray-200 w-full h-16 mb-4"></div>
              <div className="bg-red-500 text-white px-2 py-1 rounded-md">4481451</div>
            </div>
          </div>
        </div>
      )}

      {/* Paso 2 - Subir comprobante */}
      {step === 2 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Sube tu comprobante</h2>
            <label className="border-2 border-dashed border-gray-400 p-6 w-full flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-200">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <div className="flex flex-col items-center">
                <span className="text-gray-500">📤</span>
                <p className="text-sm text-gray-500 mt-2">Seleccionar imagen</p>
                <p className="text-xs text-gray-400">o arrastra y suelta la imagen aquí</p>
              </div>
            </label>
            {selectedFile && <p className="text-sm text-green-600 mt-2">{selectedFile.name}</p>}
          </div>
        </div>
      )}

      {/* Paso 3 - Vista previa */}
      {step === 3 && (
        <div>
          <div className="flex justify-center">
            <div className="border-2 border-blue-500 p-4 w-64 h-64 flex items-center justify-center bg-gray-100">
              {preview ? (
                <img src={preview} alt="Comprobante" className="max-w-full max-h-full rounded-lg" />
              ) : (
                <div className="text-gray-500">Vista previa</div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <button onClick={() => setStep(2)} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-700">
              Atrás
            </button>
            <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Escanear
            </button>
          </div>
        </div>
      )}

      {/* Paso 4 - Datos escaneados */}
      {step === 4 && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Comprobante de pago</h2>

          <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center shadow-md">
            <div className="w-full h-20 bg-gray-300 rounded mb-2 flex items-center justify-center">
              <span className="text-gray-600">Imagen escaneada</span>
            </div>
            <div className="w-full flex justify-between bg-white p-4 rounded-lg border">
              <div>
                <p className="text-gray-700 text-sm font-medium">Número de comprobante *</p>
                <input
                  type="text"
                  placeholder="Número de comprobante"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Nombre *</p>
                <input
                  type="text"
                  placeholder="Nombre del responsable"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold mt-6">¿Están correctos los datos?</p>
          <div className="flex justify-center mt-4 space-x-4">
            <button onClick={() => setStep(3)} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
              Volver a Escanear
            </button>
            <button onClick={() => setStep(5)} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Finalizar
            </button>
          </div>
        </div>
      )}

      {/* Paso 5 - Finalización */}
      {step === 5 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">¡Su comprobante fue subido con éxito!</h2>
            <p className="text-gray-600">FINALIZO SU INSCRIPCIÓN</p>
            <button onClick={() => setStep(1)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubirComprobante;
