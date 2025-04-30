import React, { useState } from "react";

const SubirConvocatoria = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [area, setArea] = useState("");
  const [imagen, setImagen] = useState(null);
  const [documento, setDocumento] = useState(null);

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
              <option value="fisica">Física</option>
              <option value="quimica">Química</option>
              <option value="quimica">Robótica</option>
              <option value="quimica">Astronomia_Astrofísica</option>
              <option value="biologia">Biología</option>
              <option value="biologia">Matemáticas</option>
              <option value="informatica">Informática</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Imagen
            </label>
            <input
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
              type="file"
              accept="application/pdf"
              onChange={(e) => setDocumento(e.target.files[0])}
              className="w-full border border-dashed border-cyan-300 p-3 bg-gray-50 rounded-lg text-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubirConvocatoria;
