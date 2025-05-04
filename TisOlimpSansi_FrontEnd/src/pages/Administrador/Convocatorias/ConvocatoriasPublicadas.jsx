import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import axios from "axios";

const ConvocatoriasPublicadas = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Para el modal de eliminación
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Para el modal de éxito
  const [selectedConvocatoriaId, setSelectedConvocatoriaId] = useState(null); // Para saber cuál eliminar
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
      setConvocatorias(prev => prev.filter(c => c.id !== selectedConvocatoriaId));
      setShowDeleteModal(false); // Cerrar modal de eliminación
      setShowSuccessModal(true); // Mostrar modal de éxito
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
    setShowDeleteModal(true); // Mostrar modal de confirmación
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false); // Cerrar el modal de éxito
  };

  return (
    <div className="px-6 py-10 min-h-screen bg-gradient-to-br from-cyan-50 to-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-cyan-900">Convocatorias Publicadas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {convocatorias.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white w-full h-80 max-w-sm mx-auto rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {item.titulo} {/* Mostramos el título de la convocatoria */}
              </h2>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(item.id)}
                  data-tooltip-id={`edit-${item.id}`}
                  className="text-cyan-600 hover:text-cyan-800 transition-colors"
                >
                  <FaEdit />
                </button>
                <Tooltip id={`edit-${item.id}`} content="Editar" />
                <button
                  data-tooltip-id={`delete-${item.id}`}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => handleConfirmDelete(item.id)} // Mostrar el modal de confirmación
                >
                  <FaTrash />
                </button>
                <Tooltip id={`delete-${item.id}`} content="Eliminar" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Card de añadir nueva convocatoria */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/nueva-convocatoria")}
          className="cursor-pointer bg-white w-full h-80 max-w-sm mx-auto rounded-xl border-2 border-dashed border-cyan-300 flex flex-col items-center justify-center h-64 text-cyan-400 hover:bg-cyan-50 transition-all duration-300"
        >
          <span className="text-6xl">+</span>
          <span className="mt-2 text-cyan-600 font-medium">Añadir Convocatoria</span>
        </motion.div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-xs">
            <h2 className="text-xl font-semibold mb-4">¿Estás seguro de eliminar esta convocatoria?</h2>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md w-full"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-md w-full"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito de eliminación */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-xs">
            <div className="flex flex-col items-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl mb-3" />
              <h3 className="text-lg font-semibold text-green-600">¡Eliminado correctamente!</h3>
            </div>
            <p className="text-gray-700 mb-4 text-center">La convocatoria se eliminó con éxito.</p>
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

export default ConvocatoriasPublicadas;
