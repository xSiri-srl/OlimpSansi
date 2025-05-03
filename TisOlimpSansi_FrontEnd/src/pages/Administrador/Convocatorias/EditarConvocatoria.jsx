import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Lista de áreas, puede obtenerse desde la base de datos si se prefiere
const areas = [
  { id: 1, nombre: "Informática" },
  { id: 2, nombre: "Robótica" },
  { id: 3, nombre: "Química" },
  { id: 4, nombre: "Astronomía Astrofísica" },
  { id: 5, nombre: "Matemáticas" },
  { id: 6, nombre: "Física" },
  { id: 7, nombre: "Biología" },
];

const EditarConvocatoria = () => {
  const { id } = useParams(); // Obtiene el id desde la URL
  const navigate = useNavigate();

  // Estado para almacenar los datos de la convocatoria
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [area, setArea] = useState("");
  const [imagen, setImagen] = useState(null);
  const [documento, setDocumento] = useState(null);
  const [imagenNombre, setImagenNombre] = useState("");
  const [documentoNombre, setDocumentoNombre] = useState("");
  const [fileKey, setFileKey] = useState(0);

  // Cargar datos de la convocatoria al iniciar el componente
  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        console.log(response)
        const data = response.data;
        const areaEncontrada = areas.find((a) => a.id === data.id_area);
        
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setArea(areaEncontrada ? areaEncontrada.nombre : "");
        setFecha(data.fecha_publicacion ?? "");
        
        // Guardar las rutas completas
        setImagen(`http://localhost:8000/${data.imagen}`);
        setDocumento(`http://localhost:8000/${data.documento_pdf}`);
        
        // Extraer y guardar los nombres de archivo
        const imagenPath = data.imagen || "";
        const documentoPath = data.documento_pdf || "";
        
        // Extraer solo el nombre del archivo de la ruta
        const imagenNombreArchivo = imagenPath.split('/').pop();
        const documentoNombreArchivo = documentoPath.split('/').pop();
        
        setImagenNombre(imagenNombreArchivo);
        setDocumentoNombre(documentoNombreArchivo);
      } catch (error) {
        console.error("Error al obtener convocatoria:", error);
        alert("Error al cargar los datos de la convocatoria.");
      }
    };

    fetchConvocatoria();
  }, [id]);

  // Manejar el envío de la edición de la convocatoria
  const handleEditar = async () => {
    if (!titulo || !area) {
      alert("Por favor completa los campos obligatorios de título y área.");
      return;
    }

    const areaSeleccionada = areas.find((a) => a.nombre === area);
    if (!areaSeleccionada) {
      alert("Área no válida.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("id_area", areaSeleccionada.id);
    
    // Solo añadir archivos si se han seleccionado nuevos
    if (imagen instanceof File) {
      formData.append("imagen", imagen);
    }
    
    if (documento instanceof File) {
      formData.append("documento_pdf", documento);
    }

    try {
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
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

  // Manejadores para actualizar los archivos y sus nombres
  const handleImagenChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setImagenNombre(file.name);
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
              {areas.map((areaOption) => (
                <option key={areaOption.id} value={areaOption.nombre}>
                  {areaOption.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-cyan-800 mb-1">
                    Imagen
                </label>
                <input
                    key={`imagen-${fileKey}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="w-full border border-dashed border-cyan-300 p-3 bg-gray-50 rounded-lg text-sm file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {/* Mostrar el nombre del archivo existente o del nuevo archivo seleccionado */}
                <p className="text-sm text-gray-600 mt-2">
                    {imagenNombre ? (
                        <span>Archivo actual: <strong>{imagenNombre}</strong></span>
                    ) : (
                        "No hay imagen seleccionada"
                    )}
                </p>
            </div>

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
                {/* Mostrar el nombre del archivo existente o del nuevo archivo seleccionado */}
                <p className="text-sm text-gray-600 mt-2">
                    {documentoNombre ? (
                        <span>Archivo actual: <strong>{documentoNombre}</strong></span>
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