import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarTimes } from "react-icons/fa";

export default function ModalPeriodo({ isOpen, onClose, fechaIni, fechaFin, titulo }) {
  
  const obtenerFechaBolivia = () => {
    const ahora = new Date();
    const fechaBolivia = new Date(ahora.toLocaleString("en-US", {timeZone: "America/La_Paz"}));
    return fechaBolivia;
  };

  const formatFecha = (fechaString) => {
    try {
      const fechaLimpia = fechaString.replace('T00:00:00-04:00', '').replace('T23:59:59-04:00', '');
      const fecha = new Date(fechaLimpia + 'T12:00:00');
      
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      const fecha = new Date(fechaString.split('T')[0]);
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getEstadoInscripcion = () => {
    try {
      const ahoraBolivia = obtenerFechaBolivia();
      
      const fechaIniStr = fechaIni.replace('T00:00:00-04:00', '').replace('T23:59:59-04:00', '');
      const fechaFinStr = fechaFin.replace('T00:00:00-04:00', '').replace('T23:59:59-04:00', '');
      
      const inicio = new Date(fechaIniStr + 'T00:00:00');
      const fin = new Date(fechaFinStr + 'T23:59:59');
      
      const soloFechaHoy = new Date(ahoraBolivia.getFullYear(), ahoraBolivia.getMonth(), ahoraBolivia.getDate());
      const soloFechaInicio = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
      const soloFechaFin = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());

      if (soloFechaHoy < soloFechaInicio) {
        return "no_iniciada";
      } else if (soloFechaHoy > soloFechaFin) {
        return "finalizada";
      }
      return "activa";
    } catch (error) {
      console.error('Error al determinar estado:', error);
      const ahora = new Date();
      const inicio = new Date(fechaIni.split('T')[0]);
      const fin = new Date(fechaFin.split('T')[0]);

      const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      const inicioSoloFecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
      const finSoloFecha = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());

      if (hoy < inicioSoloFecha) {
        return "no_iniciada";
      } else if (hoy > finSoloFecha) {
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
            ? "Generación de orden aún no disponible"
            : "Período de inscripción finalizado"}
        </h2>

        <div className="text-gray-600 mb-6">
          <p className="mb-4">
            {estadoInscripcion === "no_iniciada"
              ? "La generación de órdenes de pago para esta olimpiada aún no está disponible."
              : "El período de inscripción para esta olimpiada ya ha finalizado. No se pueden generar nuevas órdenes de pago."}
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