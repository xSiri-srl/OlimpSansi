import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaUserAlt, FaFileAlt, FaCheckCircle, FaFileInvoiceDollar, 
  FaSave, FaPrint, FaWalking, FaUpload, FaCheckDouble,
  FaUsers, FaFileExcel, FaUserTie, FaEdit, FaCheck
} from "react-icons/fa";

const ProcesoInscripcion = () => {
  const [activeTab, setActiveTab] = useState("individual");

  const tabs = {
    individual: {
      title: "Inscripción Individual",
      icon: <FaUserAlt className="mr-2" />,
      description: "Para estudiantes que se inscriben individualmente",
      steps: [
        { icon: <FaUserAlt />, text: "Registrar Competidor, elegir forma individual" },
        { icon: <FaFileAlt />, text: "Llenar formulario con datos del responsable, estudiante, áreas de competencia y tutores" },
        { icon: <FaCheckCircle />, text: "Confirmar Datos" },
        { icon: <FaFileInvoiceDollar />, text: "Generar Orden de Pago" },
        { icon: <FaSave />, text: "Guardar código de inscripción" },
        { icon: <FaPrint />, text: "Imprimir orden de pago" },
        { icon: <FaWalking />, text: "Dirigirse a caja facultativa a pagar con la orden" },
        { icon: <FaUpload />, text: "Subir comprobante de pago y validar inscripción" },
        { icon: <FaCheckDouble />, text: "Fin Inscripción" }
      ]
    },
    lista: {
      title: "Inscripción Por Lista",
      icon: <FaUsers className="mr-2" />,
      description: "Para colegios o grupos que inscriben múltiples estudiantes",
      steps: [
        { icon: <FaUsers />, text: "Seleccionar forma de inscripción Por Lista" },
        { icon: <FaFileExcel />, text: "Descargar plantilla de excel para anotar estudiantes (una lista por colegio)" },
        { icon: <FaUserTie />, text: "Llenar datos de responsable de inscripción" },
        { icon: <FaUpload />, text: "Subir archivo de excel con los estudiantes por colegio" },
        { icon: <FaEdit />, text: "Corregir errores de registro en caso de que existan" },
        { icon: <FaCheck />, text: "Confirmar Datos" },
        { icon: <FaFileInvoiceDollar />, text: "Generar Orden de Pago" },
        { icon: <FaSave />, text: "Guardar código de inscripción" },
        { icon: <FaPrint />, text: "Imprimir orden de pago" },
        { icon: <FaWalking />, text: "Dirigirse a caja facultativa a pagar con la orden" },
        { icon: <FaUpload />, text: "Subir comprobante de pago y validar inscripción" },
        { icon: <FaCheckDouble />, text: "Fin Inscripción" }
      ]
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Proceso de Inscripción
            </span>
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Elige la modalidad de inscripción que mejor se adapte a tus necesidades. Sigue los pasos correspondientes para completar tu registro en la olimpiada.
          </p>
        </motion.div>
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full p-1 shadow-md">
            {Object.keys(tabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center py-2 px-5 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tabs[tab].icon}
                {tabs[tab].title}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-5">
            <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-purple-500"></div>
            <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500"></div>
          </div>

          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:space-x-8 mb-8">
              <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-500 p-6 rounded-2xl text-white text-center mb-6 md:mb-0">
                <div className="text-5xl mb-4">
                  {tabs[activeTab].icon.type({ className: "w-16 h-16 mx-auto" })}
                </div>
                <h3 className="text-xl font-bold">{tabs[activeTab].title}</h3>
                <p className="mt-2 text-sm opacity-90">{tabs[activeTab].description}</p>
                <Link to="/inscripcion/forma-inscripcion">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 bg-white text-purple-700 font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
                  >
                    Iniciar Inscripción
                  </motion.button>
                </Link>
              </div>

              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Sigue estos pasos:</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>

                  <div className="space-y-6">
                    {tabs[activeTab].steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start ml-0"
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg z-10">
                          {index + 1}
                        </div>
                        <div className="ml-4 flex items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 w-full">
                          <div className="text-purple-600 mr-3 text-xl">
                            {step.icon}
                          </div>
                          <p className="text-gray-700">{step.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-6">
              <p className="text-purple-800 text-center font-medium">
                <span className="font-bold">Importante:</span> El proceso de inscripción se considera completo únicamente después de subir el comprobante de pago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcesoInscripcion;