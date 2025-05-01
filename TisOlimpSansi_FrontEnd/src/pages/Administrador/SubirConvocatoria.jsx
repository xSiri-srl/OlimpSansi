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
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(""); // Solo si la quieres enviar
  const [area, setArea] = useState("");
  const [imagen, setImagen] = useState(null);
  const [documento, setDocumento] = useState(null);
  const [fileKey, setFileKey] = useState(0); // Para forzar la recreación del input de archivo

  const handlePublicar = async () => {
    if (!titulo || !area || !imagen || !documento) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const areaSeleccionada = areas.find((a) => a.nombre === area);
    console.log(areaSeleccionada);
    if (!areaSeleccionada) {
      alert("Área no válida.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("id_area", areaSeleccionada.id);
    formData.append("imagen", imagen);
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

      // Limpiar el formulario después de la publicación
      setTitulo("");
      setDescripcion("");
      setFecha("");
      setArea("");
      setImagen(null);
      setDocumento(null);

      // Forzar la limpieza visual de los campos de archivo
      setFileKey((prevKey) => prevKey + 1);

    } catch (error) {
      // Verificar si error.response existe
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="Ej. Convocatoria Nacional 2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="Escribe una descripción breve..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Fecha de Publicación
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
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
              <option value="Informática">Informática</option>
              <option value="Robótica">Robótica</option>
              <option value="Química">Química</option>
              <option value="Astronomía Astrofísica">Astronomía Astrofísica</option>
              <option value="Matemáticas">Matemáticas</option>
              <option value="Física">Física</option>
              <option value="Biología">Biología</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Imagen
            </label>
            <input
              key={fileKey} // Aquí cambiamos el key para forzar la recreación
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
              className="w-full border border-dashed border-cyan-300 p-3 bg-gray-50 rounded-lg text-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Documento (PDF)
            </label>
            <input
              key={fileKey} // Aquí también cambiamos el key para forzar la recreación
              type="file"
              accept="application/pdf"
              onChange={(e) => setDocumento(e.target.files[0])}
              className="w-full border border-dashed border-cyan-300 p-3 bg-gray-50 rounded-lg text-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
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
