import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import { API_URL } from "../../../utils/api";

const SubirConvocatoria = () => {
  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState("");
  const [documento, setDocumento] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileKey, setFileKey] = useState(0);
  const [areas, setAreas] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/areas`);
        if (res.data && Array.isArray(res.data.data)) {
          setAreas(res.data.data);
        } else {
          console.warn("Respuesta inesperada al cargar áreas:", res.data);
        }
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        alert("No se pudieron cargar las áreas. Intenta más tarde.");
      }
    };

    fetchAreas();
  }, []);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!titulo.trim()) {
      nuevosErrores.titulo = "El título es obligatorio.";
    } else if (titulo.trim().length < 5 || titulo.trim().length > 100) {
      nuevosErrores.titulo = "El título debe tener entre 5 y 100 caracteres.";
    }

    if (!area) {
      nuevosErrores.area = "Selecciona un área.";
    }

    if (!documento) {
      nuevosErrores.documento = "El documento PDF es obligatorio.";
    } else {
      const esPDF = documento.type === "application/pdf";
      const esMenorDe5MB = documento.size <= 5 * 1024 * 1024;
      if (!esPDF) {
        nuevosErrores.documento = "Solo se permiten archivos en formato PDF.";
      } else if (!esMenorDe5MB) {
        nuevosErrores.documento = "El archivo no debe superar los 5 MB.";
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const existeConvocatoria = async (id_area) => {
    try {
      const res = await axios.get(`${API_URL}/api/convocatoriaPorArea/${id_area}`);
      return {
        existe: res.data?.existe || false,
        data: res.data?.data || null,
      };
    } catch (error) {
      console.error("Error al verificar convocatoria existente:", error);
      return {
        existe: false,
        data: null,
      };
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/admin/convocatoria");
  };

  const handlePublicar = async () => {
    if (!validarCampos()) return;
  
    // Since we're now using IDs directly, we don't need to find the area
    const id_area = area;
    
    const yaExiste = await existeConvocatoria(id_area);
    if (yaExiste.existe) {
      const confirmar = window.confirm(
        `Existe una convocatoria publicada para esta área. ¿Desea reemplazarla?`
      );
      if (confirmar) {
        try {
          const idConvocatoria = yaExiste.data.id;
          const formData = new FormData();
          formData.append("titulo", titulo);
          formData.append("id_area", id_area); // Use id_area directly
          if (documento instanceof File) {
            formData.append("documento_pdf", documento);
          }
  
          await axios.post(
            `${API_URL}/api/actualizarConvocatoria/${idConvocatoria}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
  
          setShowSuccessModal(true);
          return;
        } catch (error) {
          console.error("Error al actualizar convocatoria existente:", error);
          alert("Error al actualizar convocatoria existente.");
          return;
        }
      } else {
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("titulo", titulo.trim());
    formData.append("id_area", id_area); // Use id_area directly
    formData.append("documento_pdf", documento);

    try {
      await axios.post(
        `${API_URL}/api/agregarConvocatoria`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setTitulo("");
      setArea("");
      setDocumento(null);
      setErrors({});
      setFileKey((prevKey) => prevKey + 1);

      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error al subir la convocatoria:", error.response?.data || error.message);
      alert("Hubo un error al publicar la convocatoria.");
    }
  };

  const camposValidos =
    titulo.trim().length >= 5 &&
    titulo.trim().length <= 100 &&
    area &&
    documento &&
    documento.type === "application/pdf" &&
    documento.size <= 10 * 1024 * 1024;

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-cyan-900">
        Publicar Convocatoria
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            className={`w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 ${
              errors.titulo
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-cyan-500"
            }`}
            placeholder="Ej. Convocatoria Nacional 2025"
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">⚠️ {errors.titulo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">Área</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-white"
          >
            <option value="">Selecciona un área</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre_area}
              </option>
            ))}
          </select>
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">⚠️ {errors.area}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">
            Subir el documento PDF de la convocatoria
          </label>
          <div
            className={`p-6 border-2 border-dashed rounded-xl text-center transition ${
              errors.documento
                ? "border-red-400 bg-red-50"
                : "border-cyan-400 bg-cyan-50"
            }`}
          >
            <label className="cursor-pointer flex flex-col items-center gap-2">
            <SiGoogledocs className="text-cyan-800 h-10 w-10"/>
              <span className="text-cyan-800 font-semibold">
                {documento ? documento.name : "Seleccionar un archivo"}
              </span>
              <input
                key={fileKey}
                type="file"
                accept="application/pdf"
                onChange={(e) => setDocumento(e.target.files[0])}
                className="hidden"
              />
            </label>
            {errors.documento && (
              <p className="text-red-500 text-sm mt-2">⚠️ {errors.documento}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            disabled={!camposValidos}
            className={`px-6 py-2 rounded-md transition duration-300 ease-in-out shadow-md ${
              camposValidos
                ? "bg-blue-600 text-white hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handlePublicar}
          >
            Publicar
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex flex-col items-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl mb-3" />
              <h3 className="text-xl font-semibold text-green-600">¡Publicado correctamente!</h3>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-700">Se publicó correctamente la convocatoria.</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSuccessModalClose}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubirConvocatoria;
