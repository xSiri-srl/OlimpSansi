import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import ImageCropper from "./ImageCropper";
import { API_URL } from "../../utils/api";
import axios from "axios";

const SubirComprobante = () => {
  const [sinModificarFile, setSinModificarFile] = useState(null);
  const [error, setError] = useState("");
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [comprobantePath, setComprobantePath] = useState("");
  const [comprobanteNombre, setcomprobanteNombre] = useState("");
  const [fechaComprobante, setfechaComprobante] = useState("");

  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [errorNumero, setErrorNumero] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [nombreResponsableRegistrado, setNombreResponsableRegistrado] = useState("");
  const [errorNumeroUnico, setErrorNumeroUnico] = useState("");

  const handleFinalizar = () => {
    let valid = true;

    // Limpiar errores previos
    setErrorNumero("");
    setErrorNombre("");
    setErrorFecha("");
    setErrorNumeroUnico("");

    // Validar número de comprobante
    const regexNumero = /^[0-9]+$/;
    if (!regexNumero.test(numeroComprobante)) {
      setErrorNumero("Sólo se permiten números.");
      valid = false;
    }

    // Validar nombre del responsable
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexNombre.test(comprobanteNombre)) {
      setErrorNombre("Sólo se permiten letras, acentuación y espacios en blanco.");
      valid = false;
    }

    // Validar fecha
    const regexFecha = /^\d{2}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fechaComprobante)) {
      setErrorFecha("Sólo fechas con el formato dd-mm-aa");
      valid = false;
    } else {
      const [day, month, year] = fechaComprobante.split("-").map(Number);
      const parsedYear = 2000 + year;
      const comprobanteDate = new Date(parsedYear, month - 1, day);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      if (
        parsedYear < currentYear ||
        (parsedYear === currentYear && month - 1 < currentMonth)
      ) {
        setErrorFecha("Sólo se permiten comprobantes del mes y año vigentes.");
        valid = false;
      }
    }

    if (valid) {
      guardarComprobante();
    }
  };

  const handleAceptar = () => {
    setCodigoGenerado("");
    setStep(1);
    setSelectedFile(null);
    setPreview(null);
    setError("");
    setLoading(false);
    setNumeroComprobante("");
    setcomprobanteNombre("");
    setfechaComprobante("");
    setComprobantePath("");
    setNombreResponsableRegistrado("");
    setErrorNumeroUnico("");

    window.location.href = "/";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validExtensions = ["image/jpg", "image/png", "image/jpeg"];
      if (!validExtensions.includes(file.type)) {
        setError("Solo se permiten archivos JPG, PNG y JPEG.");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("El archivo es demasiado grande. El límite es 3MB.");
        setSelectedFile(null);
        setPreview(null);
        return;
      }
      setSinModificarFile(file);
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

  const handleScanAgain = () => {
    setStep(3);
  };

  const verificarCodigo = async () => {
    if (!codigoGenerado.trim()) {
      setError("Por favor, ingresa el código generado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/verificar-codigo-generado`,
        {
          codigo_generado: codigoGenerado,
        }
      );

      if (response.status === 200) {
        // Obtener el nombre del responsable registrado
        try {
          const responsableResponse = await axios.post(
            `${API_URL}/api/obtener-nombre-responsable`,
            {
              codigo_generado: codigoGenerado,
            }
          );
          setNombreResponsableRegistrado(responsableResponse.data.nombre_responsable);
        } catch (err) {
          console.error("Error al obtener nombre del responsable:", err);
        }
        
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al verificar el código.");
      return;
    } finally {
      setLoading(false);
    }
  };

  const procesarComprobante = async () => {
    if (
      !selectedFile?.numero ||
      !selectedFile?.nombre ||
      !selectedFile?.fecha
    ) {
      setError(
        "Por favor, realiza los recortes para el número, el nombre y la fecha."
      );
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("comprobante_numero", selectedFile.numero);
    formData.append("comprobante_nombre", selectedFile.nombre);
    formData.append("fecha_comprobante", selectedFile.fecha);

    try {
      const response = await axios.post(
        `${API_URL}/api/procesar-comprobanteOCR`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        const {
          numero_comprobante,
          comprobante_path,
          nombre_pagador,
          fecha_comprobante,
        } = response.data;
        setNumeroComprobante(numero_comprobante);
        setcomprobanteNombre(nombre_pagador);
        setfechaComprobante(fecha_comprobante);
        setComprobantePath(comprobante_path);
        setStep(4);
      }
    } catch (err) {
      setError("Hubo un error, intente subir la imagen de nuevo.");
    } finally {
      setLoading(false);
    }
  };

const guardarComprobante = async () => {
  if (!numeroComprobante || !selectedFile || !codigoGenerado) {
    setError("Faltan datos para guardar.");
    return;
  }

  setLoading(true);
  setError(null);
  setErrorNumeroUnico("");
  setErrorNombre(""); // Limpiar error de nombre

  const formData = new FormData();
  formData.append("codigo_generado", codigoGenerado);
  formData.append("numero_comprobante", numeroComprobante);
  formData.append("comprobante", sinModificarFile);
  formData.append("nombre_pagador", comprobanteNombre);

  try {
    const response = await axios.post(
      `${API_URL}/api/guardar-comprobante`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status === 200) {
      setStep(5);
    }
  } catch (err) {
    console.error("Error al guardar comprobante:", err);
    
    const errorMessage = err.response?.data?.message || "Error al guardar.";
    const errorField = err.response?.data?.field;
    
    if (errorField === 'numero_comprobante') {
      setErrorNumeroUnico(errorMessage);
    } else if (errorField === 'nombre_pagador') {
      setErrorNombre(errorMessage);
    } else {
      setError(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
        <div className="flex flex-center justify-between flex-nowrap overflow-x-auto mb-6">
          {[
            "Ingresar código",
            "Subir comprobante",
            "Escanear",
            "Ver datos escaneados",
            "Finalizar",
          ].map((stepLabel, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-shrink-0 w-24"
            >
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

        {step === 1 && (
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
                  {loading ? "Verificando..." : "Verificar código"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-2 text-gray-500">
                Sube tu comprobante de pago
              </h2>
              <label className="border-2 border-dashed border-gray-400 p-6 w-full flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-200">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-4xl">
                    <FaCloudUploadAlt size={60} />
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    Seleccionar imagen
                  </p>
                </div>
              </label>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              {selectedFile && (
                <p className="text-sm text-green-600 mt-2">
                  {selectedFile.name}
                </p>
              )}
            </div>
            <div className="bg-gray-300 p-6 rounded-md flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Ejemplo:
              </h3>
              <div className="bg-gray-400 p-4 rounded-md flex items-center justify-center">
                <img
                  src="/images/boleta.jpg"
                  alt="Boleta"
                  className="w-full max-w-xl h-auto rounded-md shadow-lg"
                />
              </div>
            </div>
          </div>
        )}

{step === 3 && (
  <div style={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
    <div className="flex justify-center px-2">
      <div 
        className="bg-gray-400 p-2 rounded-md flex flex-col items-center justify-center" 
        style={{ 
          width: '100%', 
          maxWidth: 'calc(100vw - 32px)',
          boxSizing: 'border-box'
        }}
      >
        <img
          src="/images/recibo.jpg"
          alt="Boleta"
          className="rounded-md shadow-lg"
          style={{ 
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '250px',
            objectFit: 'contain',
            display: 'block'
          }}
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
          onCrop={(croppedFile) => {
            const previewUrl = URL.createObjectURL(croppedFile);
            if (selectedFile?.numeroPreview) {
              URL.revokeObjectURL(selectedFile.numeroPreview);
            }
            setSelectedFile((prev) => ({
              ...prev,
              numero: croppedFile,
              numeroPreview: previewUrl,
            }));
          }}
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
          onCrop={(croppedFile) => {
            const previewUrl = URL.createObjectURL(croppedFile);
            if (selectedFile?.nombrePreview) {
              URL.revokeObjectURL(selectedFile.nombrePreview);
            }
            setSelectedFile((prev) => ({
              ...prev,
              nombre: croppedFile,
              nombrePreview: previewUrl,
            }));
          }}
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
          onCrop={(croppedFile) => {
            const previewUrl = URL.createObjectURL(croppedFile);
            if (selectedFile?.fechaPreview) {
              URL.revokeObjectURL(selectedFile.fechaPreview);
            }
            setSelectedFile((prev) => ({
              ...prev,
              fecha: croppedFile,
              fechaPreview: previewUrl,
            }));
          }}
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
      
      {/* Layout responsive para las vistas previas */}
      <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6">
        {selectedFile?.numeroPreview && (
          <div className="flex flex-col items-center">
            <p className="text-center text-sm mb-2 text-gray-500">
              Número
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
              Nombre
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
              Fecha
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
        onClick={() => setStep(2)}
        className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md w-full sm:w-auto"
      >
        Atrás
      </button>
      <button
        onClick={procesarComprobante}
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
)}

        {step === 4 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">
              Comprobante de pago
            </h2>

            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
              <div className="border-2 border-blue-500 p-4 w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
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
                      className="max-w-full max-h-full rounded-lg"
                    />
                  )
                ) : (
                  <span className="text-gray-500">Vista previa</span>
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
                      onChange={(e) => {
                        setNumeroComprobante(e.target.value);
                        setErrorNumeroUnico(""); // Limpiar error al escribir
                      }}
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
                      placeholder="Nombre completo del responsable"
                      value={comprobanteNombre}
                      onChange={(e) => {
                        setcomprobanteNombre(e.target.value);
                        setErrorNombre(""); 
                      }}
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
                onClick={handleScanAgain}
                className="bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500 shadow-md"
              >
                Volver a escanear
              </button>
              <button
                onClick={handleFinalizar}
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

            {/* Mostrar error general si existe */}
            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-4">
                ¡Su comprobante fue subido con éxito!
              </h2>
              <p className="text-gray-600">FINALIZÓ SU INSCRIPCIÓN</p>
              <button
                onClick={handleAceptar}
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