import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

const convocatorias = [
  { id: 1, title: "CONVOCATORIA FÍSICA", image: "/images/geografia.png" },
  { id: 2, title: "CONVOCATORIA DIGITAL", image: "/images/biologia.png" },
  { id: 3, title: "CONVOCATORIA 2025", image: "/images/informatica.png" },
 
];

const ConvocatoriasPublicadas = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-10 min-h-screen bg-gradient-to-br from-cyan-50 to-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-cyan-900">
        Convocatorias Publicadas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {convocatorias.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white w-full h-80 max-w-sm mx-auto rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={item.image}
              alt="Convocatoria"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {item.title}
              </h2>
              <div className="flex justify-end gap-3">
                <button
                  data-tooltip-id={`edit-${item.id}`}
                  className="text-cyan-600 hover:text-cyan-800 transition-colors"
                >
                  <FaEdit />
                </button>
                <Tooltip id={`edit-${item.id}`} content="Editar" />
                <button
                  data-tooltip-id={`delete-${item.id}`}
                  className="text-red-500 hover:text-red-700 transition-colors"
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
    </div>
  );
};

export default ConvocatoriasPublicadas;
