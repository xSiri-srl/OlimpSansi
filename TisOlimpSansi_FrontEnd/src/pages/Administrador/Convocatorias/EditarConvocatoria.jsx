import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditarConvocatoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]); // ← ahora es dinámico
  const [documento, setDocumento] = useState(null);
  const [documentoNombre, setDocumentoNombre] = useState("");
  const [fileKey, setFileKey] = useState(0);

  // Cargar áreas desde la base de datos
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/areas");
        console.log(response)
        setAreas(response.data?.data);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
        alert("No se pudieron cargar las áreas.");
      }
    };

    fetchAreas();
  }, []);

  // Cargar datos de la convocatoria
  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/convocatoria/${id}`);
        const data = response.data;
        setTitulo(data.titulo);
        setDocumento(`http://localhost:8000/${data.documento_pdf}`);

        const documentoPath = data.documento_pdf || "";
        const documentoNombreArchivo = documentoPath.split("/").pop();
        setDocumentoNombre(documentoNombreArchivo);

        // Espera a que las áreas estén cargadas antes de seleccionar
        setArea(data.id_area); // ← guardamos directamente el ID
      } catch (error) {
        console.error("Error al obtener convocatoria:", error);
        alert("Error al cargar los datos de la convocatoria.");
      }
    };

    fetchConvocatoria();
  }, [id]);

  const handleEditar = async () => {
    if (!titulo || !area) {
      alert("Por favor completa los campos obligatorios de título y área.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("id_area", area);

    if (documento instanceof File) {
      formData.append("documento_pdf", documento);
    }

    try {
      await axios.post(
        `http://localhost:8000/api/actualizarConvocatoria/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Convocatoria actualizada con éxito.");
      navigate("/admin/convocatoria");
    } catch (error) {
      console.error("Error al actualizar la convocatoria:", error);
      alert("Hubo un error al actualizar la convocatoria.");
    }
  };

  const handleDocumentoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumento(file);
      setDocumentoNombre(file.name);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-cyan-900">
        Editar Convocatoria
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">
            Título
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="Ej. Convocatoria Nacional 2025"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Área
            </label>
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Documento (PDF)
            </label>
            <input
              key={`documento-${fileKey}`}
              type="file"
              accept="application/pdf"
              onChange={handleDocumentoChange}
              className="w-full border border-dashed border-cyan-300 p-3 bg-gray-50 rounded-lg text-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              {documentoNombre ? (
                <span>
                  Archivo actual: <strong>{documentoNombre}</strong>
                </span>
              ) : (
                "No hay documento seleccionado"
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
            onClick={handleEditar}
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarConvocatoria;