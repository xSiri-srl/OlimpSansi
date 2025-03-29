import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios'; 

const SubirComprobante = () => {
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [comprobantePath, setComprobantePath] = useState("");
 
  

  const endpoint = "http://127.0.0.1:8000/api";

  // Manejo del archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const validExtensions = ["image/jpeg", "image/png", "application/pdf"];
      if (!validExtensions.includes(file.type)) {
        setError("Solo se permiten archivos JPG, PNG o PDF.");
        setSelectedFile(null);
        setPreview(null);
        return;
      }
  
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("El archivo es demasiado grande. El límite es 5MB.");
        setSelectedFile(null);
        setPreview(null);
        return;
      }
  
      setSelectedFile(file);
      setError("");
  
      if (file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setPreview(fileURL);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
  
      setStep(3);
    }
  };

  const handleFinalizar = () => {
    setCodigoGenerado("");
    setStep(1);
    setSelectedFile(null);
    setPreview(null);
    setError("");
    setLoading(false);
    setNumeroComprobante("");
    setComprobantePath("");
    window.location.href = "/";  
  };

  // Verificar código
  const verificarCodigo = async () => {
    if (!codigoGenerado.trim()) {
      setError("Por favor, ingresa el código generado.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(`${endpoint}/verificar-codigo-generado`, { 
        codigo_generado: codigoGenerado 
      });
  
      if (response.status === 200) {
        console.log(response.data.message);
        setStep(2);  
      }
    } catch (err) {
      console.error("Error al verificar código:", err);
  

      setError(err.response?.data?.message || "Error al verificar el código.");
  
      return;
    } finally {
      setLoading(false);
    }
  };
 
 
// 🔹 1️⃣ FUNCIÓN PARA ESCANEAR EL COMPROBANTE (OCR)
const procesarComprobante = async () => {
  if (!selectedFile) {
    setError("Por favor, sube el comprobante.");
    return;
  }

  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("codigo_generado", codigoGenerado);
  formData.append("comprobante", selectedFile);

  try {
    const response = await axios.post(`${endpoint}/procesar-comprobanteOCR`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      const { numero_comprobante, comprobante_path } = response.data;
      
      // Guardar en el estado para usar después
      setNumeroComprobante(numero_comprobante);
      setComprobantePath(comprobante_path);
      
      console.log("Número de comprobante:", numero_comprobante);
      console.log("Ruta de la imagen:", comprobante_path);
      setStep(4);  
    }
  } catch (err) {
    console.error("Error al procesar el comprobante:", err);
    setError(err.response?.data?.message || "Error al procesar.");
  } finally {
    setLoading(false);
  }
};

//  GUARDAR EL COMPROBANTE
const guardarComprobante = async () => {
  if (!numeroComprobante || !comprobantePath || !selectedFile || !codigoGenerado) {
    setError("Faltan datos para guardar.");
    return;
  }

  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("codigo_generado", codigoGenerado);
  formData.append("numero_comprobante", numeroComprobante);
  formData.append("comprobante_path", comprobantePath);
 
  try {
    const response = await axios.post(`${endpoint}/guardar-comprobante`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      console.log("Comprobante guardado exitosamente:", response.data);
      setStep(5);  
    }
  } catch (err) {
    console.error("Error al guardar el comprobante:", err);
    setError(err.response?.data?.message || "Error al guardar.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
        {/* Progreso */}
        <div className="flex items-center justify-between mb-6">
          {["Ingresar código", "Subir comprobante", "Escanear", "Ver datos escaneados", "Finalizar"].map(
            (stepLabel, index) => (
              <div key={index} className="flex flex-col items-center">
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
                  className={`text-xss mt-2 ${index + 1 === step ? "text-blue-600" : "text-gray-400"}`}
                >
                  {stepLabel}
                </span>
              </div>
            )
          )}
        </div>

        {/* Paso 1 - Ingresar código */}
        {step === 1 && (
     <div className="grid grid-cols-2 gap-6">
     <div>
       <h2 className="text-lg font-semibold mb-2 text-gray-500">
         Por favor, ingrese el código proporcionado en el formulario de ORDEN DE PAGO.
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
           onClick={async () => {
             await verificarCodigo(); 
           }}
           disabled={loading || !codigoGenerado.trim()} 
           className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
             codigoGenerado.trim() && !loading
               ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
               : "bg-gray-400 cursor-not-allowed"
           }`}
         >
           {loading ? "Verificando..." : "Verificar Código"}
         </button>
       </div>  
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
              <h2 className="text-lg font-semibold mb-2 text-gray-500">Sube tu comprobante</h2>
              <label className="border-2 border-dashed border-gray-400 p-6 w-full flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-200">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-4xl">
                    <FaCloudUploadAlt size={60} />
                  </span>
                  <p className="text-sm text-gray-500 mt-2">Seleccionar imagen</p>
                  <p className="text-xs text-gray-400">o arrastra y suelta la imagen aquí</p>
                </div>
              </label>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              {selectedFile && <p className="text-sm text-green-600 mt-2">{selectedFile.name}</p>}
            </div>
            <div className="bg-gray-300 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Ejemplo:</h3>
              <div className="bg-gray-400 p-6 rounded-md flex flex-col items-center justify-center">
                <div className="bg-gray-200 w-full h-16 mb-4"></div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3 - Vista previa */}
        {step === 3 && (
          <div>
          <div className="flex justify-center">
    <div className="border-2 border-blue-500 p-4 w-64 h-64 flex items-center justify-center bg-gray-100">
      {preview ? (
        selectedFile?.type === "application/pdf" ? (
          <embed src={preview} type="application/pdf" width="100%" height="100%" />
        ) : (
          <img src={preview} alt="Comprobante" className="max-w-full max-h-full rounded-lg" />
        )
      ) : (
        <div className="text-gray-500">Vista previa</div>
      )}
    </div>
  </div>
  <p className="flex justify-center text-sm text-green-600 mt-2">
    {selectedFile ? selectedFile.name : "No hay archivo seleccionado"}
  </p>
  <div className="flex justify-center mt-6 space-x-4">
    <button
      onClick={() => setStep(2)}
      className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
    >
      Atrás
    </button>
    <button
      onClick={procesarComprobante} 
      disabled={loading || !selectedFile} 
      className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
        selectedFile && !loading
          ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {loading ? "Escaneando..." : "Escanear"}
    </button>
  </div>
  </div>
)}

        {/* Paso 4 - Datos escaneados */}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">Comprobante de pago</h2>

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
        value={numeroComprobante} 
        onChange={(e) => setNumeroComprobante(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">Nombre del responsable *</p>
                  <input
        type="text"
        placeholder="Nombre del responsable"
        value={numeroComprobante} 
        onChange={(e) => setNumeroComprobante(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold mt-6">¿Están correctos los datos?</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setStep(3)}
                className="bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-red-500 shadow-md"
              >
                Volver a Escanear
              </button>
              <button
      onClick={guardarComprobante} 
      disabled={loading || !selectedFile} 
      className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
        selectedFile && !loading
          ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {loading ? "Guardando..." : "Finalizar"}
    </button>
            </div>
          </div>
        )}

        {/* Paso 5 - Finalización */}
        {step === 5 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-4">¡Su comprobante fue subido con éxito!</h2>
              <p className="text-gray-600">FINALIZÓ SU INSCRIPCIÓN</p>
              <button
        onClick={handleFinalizar}  
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
      >
        Aceptar
      </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubirComprobante;
