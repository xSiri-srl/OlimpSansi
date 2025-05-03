import React, { useState } from "react";
import axios from "axios";

const areas = [
  { id: 1, nombre: "Informática" },
  { id: 2, nombre: "Robótica" },
  { id: 3, nombre: "Química" },
  { id: 4, nombre: "Astronomía Astrofísica" },
  { id: 5, nombre: "Matemáticas" },
  { id: 6, nombre: "Física" },
  { id: 7, nombre: "Biología" },
];

const SubirConvocatoria = () => {
  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState("");
  const [documento, setDocumento] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileKey, setFileKey] = useState(0);

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!titulo.trim()) nuevosErrores.titulo = "El título es obligatorio.";
    if (!area) nuevosErrores.area = "Selecciona un área.";
    if (!documento) nuevosErrores.documento = "El documento PDF es obligatorio.";
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handlePublicar = async () => {
    if (!validarCampos()) return;

    const areaSeleccionada = areas.find((a) => a.nombre === area);
    if (!areaSeleccionada) {
      alert("Área no válida.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("id_area", areaSeleccionada.id); // ✅ ID correcto
    formData.append("documento_pdf", documento);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/agregarConvocatoria",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Convocatoria publicada con éxito.");
      console.log(response.data);

      // Limpiar formulario
      setTitulo("");
      setArea("");
      setDocumento(null);
      setErrors({});
      setFileKey((prevKey) => prevKey + 1);
    } catch (error) {
      if (error.response) {
        console.error("Error al subir la convocatoria:", error.response.data);
      } else {
        console.error("Error al subir la convocatoria:", error.message);
      }
      alert("Hubo un error al publicar la convocatoria.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-cyan-900">
        Publicar Convocatoria
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
  maxLength={35} 
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
              <option key={a.id} value={a.nombre}>
                {a.nombre}
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

        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
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
