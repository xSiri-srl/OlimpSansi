import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SiGoogledocs } from "react-icons/si";
import { API_URL } from "../../../utils/api";
import axios from "axios"
const EditarConvocatoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [documento, setDocumento] = useState(null);
  const [documentoNombre, setDocumentoNombre] = useState("");
  const [rutaDocumento, setRutaDocumento] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [errores, setErrores] = useState({
    titulo: false,
    area: false,
    documento: false,
  });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/areas`);
        setAreas(response.data?.data);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
        alert("No se pudieron cargar las áreas.");
      }
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/convocatoria/${id}`);
        const data = response.data;
        setTitulo(data.titulo);
        setArea(data.id_area);

        const documentoPath = data.documento_pdf || "";
        setRutaDocumento(documentoPath);
        const nombre = documentoPath.split("/").pop();
        setDocumentoNombre(decodeURIComponent(nombre));
        setDocumento(null);
      } catch (error) {
        console.error("Error al obtener convocatoria:", error);
        alert("Error al cargar los datos de la convocatoria.");
      }
    };

    fetchConvocatoria();
  }, [id]);

  const validarCampos = () => {
    const nuevosErrores = {
      titulo: titulo.trim() === "",
      area: area === "",
      documento: !documentoNombre && !(documento instanceof File),
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(Boolean);
  };

  const handleEditar = async () => {
    if (!validarCampos()) return;

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("id_area", area);

    if (documento instanceof File) {
      formData.append("documento_pdf", documento);
    }

    try {
      await axios.post(`${API_URL}/api/actualizarConvocatoria/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al actualizar la convocatoria:", error);
      setShowErrorModal(true);
    }
  };

  const handleDocumentoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumento(file);
      setDocumentoNombre(file.name);
      setRutaDocumento(""); // Se elimina el documento anterior
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/admin/convocatoria");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-cyan-900">
        Editar Convocatoria
      </h1>

      <div className="space-y-6">
        {/* TÍTULO */}
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={`w-full border px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 ${
              errores.titulo ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-cyan-500"
            }`}
            placeholder="Ej. Convocatoria Nacional 2025"
          />
          {errores.titulo && <p className="text-red-500 text-sm mt-1">El título es obligatorio.</p>}
        </div>

        {/* ÁREA */}
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">Área</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={`w-full border px-4 py-2 rounded-lg bg-white transition focus:outline-none focus:ring-2 ${
              errores.area ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-cyan-500"
            }`}
          >
            <option value="">Selecciona un área</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre_area}
              </option>
            ))}
          </select>
          {errores.area && <p className="text-red-500 text-sm mt-1">Debes seleccionar un área.</p>}
        </div>

        {/* DOCUMENTO */}
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">
            Subir el documento PDF de la convocatoria
          </label>
          <div
            className={`p-6 border-2 border-dashed rounded-xl text-center transition hover:bg-cyan-100 ${
              errores.documento
                ? "border-red-400 bg-red-50"
                : documento instanceof File
                ? "border-cyan-500 bg-cyan-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <SiGoogledocs className="text-cyan-800 h-12 w-12" />
              <span className="text-cyan-800 font-semibold">
                {documento instanceof File ? documento.name : "Seleccionar un archivo"}
              </span>
              <input
                key={fileKey}
                type="file"
                accept="application/pdf"
                onChange={handleDocumentoChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-600 mt-2">
              {!(documento instanceof File) && documentoNombre && (
                <span>
                  Archivo actual: <strong>{documentoNombre}</strong>
                </span>
              )}
            </p>
            {errores.documento && (
              <p className="text-red-500 text-sm mt-1">Debes subir o mantener un documento PDF.</p>
            )}
          </div>
        </div>

        {/* BOTÓN */}
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
            onClick={handleEditar}
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* MODAL DE ÉXITO */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-semibold text-green-600 flex items-center justify-center gap-2">
              ✅ ¡Convocatoria actualizada con éxito!
            </h2>
            <button
              onClick={handleCloseSuccessModal}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE ERROR */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-semibold text-red-600 flex items-center justify-center gap-2">
              ❌ Error al actualizar la convocatoria.
            </h2>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarConvocatoria;
