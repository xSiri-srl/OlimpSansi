import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubirConvocatoria = () => {
  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState("");
  const [documento, setDocumento] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileKey, setFileKey] = useState(0);
  const [areas, setAreas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/areas");
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
      const res = await axios.get(`http://localhost:8000/api/convocatoriaPorArea/${id_area}`);
      
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

  const handlePublicar = async () => {
    if (!validarCampos()) return;

    const areaSeleccionada = areas.find((a) => a.nombre_area === area);
    if (!areaSeleccionada) {
      alert("Área no válida.");
      return;
    }

    const yaExiste = await existeConvocatoria(areaSeleccionada.id);
    if (yaExiste.existe) {
      const confirmar = window.confirm(
        `Existe una convocatoria publicada para ${areaSeleccionada.nombre_area}. ¿Desea reemplazarla?`
      );
      if (!confirmar) return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo.trim());
    formData.append("id_area", areaSeleccionada.id);
    formData.append("documento_pdf", documento);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/agregarConvocatoria",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Convocatoria publicada con éxito.");
      console.log(response.data);

      // Resetear formulario
      setTitulo("");
      setArea("");
      setDocumento(null);
      setErrors({});
      setFileKey((prevKey) => prevKey + 1);

      navigate("/admin/convocatoria");

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
        {/* TÍTULO */}
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

        {/* ÁREA */}
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">Área</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-white"
          >
            <option value="">Selecciona un área</option>
            {areas.map((a) => (
              <option key={a.id} value={a.nombre_area}>
                {a.nombre_area}
              </option>
            ))}
          </select>
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">⚠️ {errors.area}</p>
          )}
        </div>

        {/* PDF */}
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
              <div className="text-4xl">📄</div>
              <span className="text-cyan-800 font-semibold">
                {documento ? documento.name : "Haz clic o arrastra un archivo PDF aquí"}
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

        {/* BOTÓN */}
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
    </div>
  );
};

export default SubirConvocatoria;
