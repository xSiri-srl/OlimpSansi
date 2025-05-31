import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import axios from "axios";

const ConvocatoriasPublicadas = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedConvocatoriaId, setSelectedConvocatoriaId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/convocatorias");
        setConvocatorias(response.data);
      } catch (error) {
        console.error("Error al obtener convocatorias", error);
      }
    };

    fetchConvocatorias();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/eliminarConvocatoria/${selectedConvocatoriaId}`);
      setConvocatorias((prev) => prev.filter((c) => c.id !== selectedConvocatoriaId));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al eliminar la convocatoria", error);
      alert("Ocurrió un error al eliminar.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/editar-convocatoria/${id}`);
  };

  const handleConfirmDelete = (id) => {
    setSelectedConvocatoriaId(id);
    setShowDeleteModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="px-6 py-10 min-h-screen  from-cyan-50 to-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-cyan-900">
        Convocatorias Publicadas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {convocatorias.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300 border"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {item.titulo}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-cyan-600 hover:text-cyan-800"
                    title="Editar"
                  >
                    <HiOutlinePencilSquare size={22} />
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    <HiOutlineTrash size={22} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-md overflow-hidden p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-700 text-sm font-medium">
                
                </div>
                <iframe
                src={item.documento_pdf}
                className="w-full h-80 mt-3 rounded-md border"
              ></iframe>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Card para añadir nueva convocatoria */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/nueva-convocatoria")}
          className="cursor-pointer bg-white border-2 border-dashed border-cyan-400 flex flex-col justify-center items-center text-center shadow-sm rounded-xl w-full h-90 transition-all hover:bg-cyan-50"
        >
          <HiOutlinePlusCircle size={48} className="text-cyan-500" />
          <p className="mt-2 text-lg text-cyan-700 font-medium">
            Añadir Convocatoria
          </p>
        </motion.div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-xs">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ¿Eliminar convocatoria?
            </h2>
            <p className="text-gray-600 text-sm text-center mb-4">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md w-full"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-md w-full"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-xs text-center">
            <HiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              ¡Convocatoria eliminada!
            </h3>
            <p className="text-gray-700 mb-4">
              La convocatoria fue eliminada exitosamente.
            </p>
            <button
              onClick={handleSuccessModalClose}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConvocatoriasPublicadas;
