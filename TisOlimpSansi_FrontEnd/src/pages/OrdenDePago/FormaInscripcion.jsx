import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FormularioEstudiante() {
  const navigate = useNavigate();

  const handleSeleccion = () => {
    navigate(`/inscripcion/responsable`);
  };

  const handleSeleccionLista = () => {
    navigate(`/inscripcion-lista/tutorial`);
  };

  return (
    <div className="flex flex-col items-center justify-center from-indigo-100 to-purple-200 p-6">
      <h1 className="text-sky-950 font-bold text-4xl mb-4 text-center">
        SELECCIONE SU FOMA DE INSCRIPCIÓN
      </h1>

      <div className="flex flex-wrap justify-center mt-8 gap-16">
        {/* Opción Individual */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center cursor-pointer group"
          onClick={handleSeleccion}
        >
          <div className="bg-gradient-to-r shadow-lg rounded-xl p-8 w-56 h-56 flex items-center justify-center transition-all group-hover:bg-indigo-200">
            <FaUserAlt size={100} className="text-indigo-600 group-hover:text-indigo-800 transition-all" />
          </div>
          <span className=" font-mono mt-4 text-2xl font-semibold text-gray-600 group-hover:text-indigo-700">
            Individual
          </span>
        </motion.div>

        {/* Opción Lista */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center cursor-pointer group"
          onClick={handleSeleccionLista}
        >
          <div className="bg-gradient-to-r shadow-lg rounded-xl p-8 w-56 h-56 flex items-center justify-center transition-all group-hover:bg-purple-200">
            <FaUsers size={100} className="text-purple-600 group-hover:text-purple-800 transition-all" />
          </div>
          <span className="font-mono mt-4 text-2xl font-semibold text-gray-600 group-hover:text-purple-700">
            Por lista
          </span>
        </motion.div>
      </div>
    </div>
  );
}
