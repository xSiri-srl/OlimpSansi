import { useState } from "react";
import { API_URL } from "../../../../utils/api";
import axios from "axios";

export const useSubirComprobante = () => {
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
  const [showModalExito, setShowModalExito] = useState(false);

  const validateFinalizar = () => {
    let valid = true;
    setErrorNumero("");
    setErrorNombre("");
    setErrorFecha("");
    setErrorNumeroUnico("");

    const regexNumero = /^[0-9]+$/;
    if (!regexNumero.test(numeroComprobante)) {
      setErrorNumero("Sólo se permiten números.");
      valid = false;
    }

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexNombre.test(comprobanteNombre)) {
      setErrorNombre("Sólo se permiten letras, acentuación y espacios en blanco.");
      valid = false;
    }

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

    return valid;
  };

  const handleFinalizar = () => {
    if (validateFinalizar()) {
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
    setShowModalExito(false);
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
        setShowModalExito(true);
      }
    } catch (err) {
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

  const handleCropSelection = (type, croppedFile) => {
    const previewUrl = URL.createObjectURL(croppedFile);
    if (selectedFile?.[`${type}Preview`]) {
      URL.revokeObjectURL(selectedFile[`${type}Preview`]);
    }
    setSelectedFile((prev) => ({
      ...prev,
      [type]: croppedFile,
      [`${type}Preview`]: previewUrl,
    }));
  };

  return {
    step,
    setStep,
    selectedFile,
    preview,
    loading,
    error,
    codigoGenerado,
    setCodigoGenerado,
    nombreResponsableRegistrado,
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
    showModalExito,
    verificarCodigo,
    handleFileChange,
    procesarComprobante,
    handleFinalizar,
    handleAceptar,
    handleScanAgain,
    handleCropSelection
  };
};