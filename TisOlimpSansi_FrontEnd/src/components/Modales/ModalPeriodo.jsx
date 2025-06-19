import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarTimes } from "react-icons/fa";

export default function ModalPeriodo({ isOpen, onClose, fechaIni, fechaFin }) {
  
  console.log("ModalPeriodo - fechaIni recibida:", fechaIni);
  console.log("ModalPeriodo - fechaFin recibida:", fechaFin);
  
  const obtenerFechaBolivia = () => {
    const ahora = new Date();
    const fechaBolivia = new Date(ahora.toLocaleString("en-US", {timeZone: "America/La_Paz"}));
    return fechaBolivia;
  };

  const formatFecha = (fechaString) => {
    try {
      console.log("Formateando fecha:", fechaString);
      
      if (!fechaString || fechaString === "") {
        console.error("Fecha vacía o undefined");
        return "Fecha no disponible";
      }
      

      let fechaSolo;
      if (fechaString.includes('T')) {
        fechaSolo = fechaString.split('T')[0];
      } else {
        fechaSolo = fechaString;
      }
      
      console.log("Fecha extraída:", fechaSolo);
      
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaSolo)) {
        console.error("Formato de fecha inválido:", fechaSolo);
        return "Formato de fecha inválido";
      }
      
      const [año, mes, dia] = fechaSolo.split('-').map(Number);
      
      if (año < 1900 || año > 2100 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
        console.error("Valores de fecha fuera de rango:", { año, mes, dia });
        return "Fecha fuera de rango";
      }
      
      const fecha = new Date(año, mes - 1, dia);
      console.log("Fecha creada:", fecha);
      
      if (isNaN(fecha.getTime())) {
        console.error("Fecha inválida después de parsing");
        return "Fecha inválida";
      }
      
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error, 'Fecha original:', fechaString);
      return "Error en fecha";
    }
  };

  const getEstadoInscripcion = () => {
    try {
      const ahoraBolivia = obtenerFechaBolivia();
      
      const fechaIniSolo = fechaIni.includes('T') ? fechaIni.split('T')[0] : fechaIni;
      const fechaFinSolo = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
      
      const [añoIni, mesIni, diaIni] = fechaIniSolo.split('-').map(Number);
      const [añoFin, mesFin, diaFin] = fechaFinSolo.split('-').map(Number);
      
      const inicio = new Date(añoIni, mesIni - 1, diaIni);
      const fin = new Date(añoFin, mesFin - 1, diaFin);
      
      const soloFechaHoy = new Date(ahoraBolivia.getFullYear(), ahoraBolivia.getMonth(), ahoraBolivia.getDate());

      if (soloFechaHoy < inicio) {
        return "no_iniciada";
      } else if (soloFechaHoy > fin) {
        return "finalizada";
      }
      return "activa";
    } catch (error) {
      console.error('Error al determinar estado de inscripción:', error);
      return "finalizada";
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
            ? "Período de inscripción aún no disponible"
            : "Período de inscripción finalizado"}
        </h2>

        <div className="text-gray-600 mb-6">
          <p className="mb-4">
            {estadoInscripcion === "no_iniciada"
              ? "El período para subir comprobantes de esta olimpiada aún no está disponible."
              : "El período para subir comprobantes de esta olimpiada ya ha finalizado."}
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