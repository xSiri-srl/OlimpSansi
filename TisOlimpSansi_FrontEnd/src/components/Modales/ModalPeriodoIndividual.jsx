import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarTimes } from "react-icons/fa";

export default function ModalPeriodo({ isOpen, onClose, fechaIni, fechaFin }) {
  const formatFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString("es-ES", {
        timeZone: "America/La_Paz",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getEstadoInscripcion = () => {
    try {
      const ahoraUTC = new Date();
      const offsetBolivia = -4 * 60; // Bolivia es UTC-4 (en minutos)
      const ahoraBolivia = new Date(ahoraUTC.getTime() + (offsetBolivia * 60 * 1000));
      
      const inicio = new Date(fechaIni);
      const fin = new Date(fechaFin);

      if (ahoraBolivia < inicio) {
        return "no_iniciada";
      } else if (ahoraBolivia > fin) {
        return "finalizada";
      }
      return "activa";
    } catch (error) {
      console.error('Error al determinar estado:', error);
      const ahora = new Date();
      const inicio = new Date(fechaIni);
      const fin = new Date(fechaFin);

      if (ahora < inicio) {
        return "no_iniciada";
      } else if (ahora > fin) {
        return "finalizada";
      }
      return "activa";
    }
  };

  const estadoInscripcion = getEstadoInscripcion();
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <FaCalendarTimes className="text-red-500 text-6xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {estadoInscripcion === "no_iniciada"
            ? "Inscripción aún no disponible"
            : "Inscripción finalizada"}
        </h2>

        <div className="text-gray-600 mb-6">
          <p className="mb-4">
            {estadoInscripcion === "no_iniciada"
              ? "El período de inscripción para esta olimpiada aún no ha comenzado."
              : "El período de inscripción para esta olimpiada ya ha finalizado."}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">
              Período de inscripción:
            </p>
            <p>
              <span className="font-medium">Inicia:</span>{" "}
              {formatFecha(fechaIni)}
            </p>
            <p>
              <span className="font-medium">Finaliza:</span>{" "}
              {formatFecha(fechaFin)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Horario de Bolivia (UTC-4)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition duration-300 ease-in-out"
        >
          Entendido
        </button>
      </motion.div>
    </motion.div>
  );
}