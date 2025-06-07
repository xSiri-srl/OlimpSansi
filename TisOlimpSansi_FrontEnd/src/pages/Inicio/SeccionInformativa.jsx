import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";

const SeccionInformativa = ({ requisitosRef }) => {
  const cardStyle = "bg-white border border-gray-200 shadow-md";
  const textStyle = "text-gray-700";
  const headingStyle = "text-gray-900";

  return (
    <div className="px-4 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className={`rounded-xl p-6 md:p-8 ${cardStyle}`}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${headingStyle}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Presentación
            </span>
          </h2>
          <p className={`text-base sm:text-lg ${textStyle} leading-relaxed`}>
            El Comité de la Olimpiada Científica Nacional San Simón{" "}
            <strong className="text-purple-500">O! SANSI</strong>, a través de la Facultad de Ciencias y
            Tecnología de la Universidad Mayor de San Simón, convoca a los
            estudiantes del Sistema de Educación Regular a participar en las
            Olimpiadas <strong className="text-purple-500">O! SANSI 2025</strong>.
          </p>
        </motion.div>

        <motion.div
          ref={requisitosRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className={`rounded-xl p-6 md:p-8 ${cardStyle} scroll-mt-20`}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${headingStyle}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Requisitos
            </span>
          </h2>
          <ul className={`list-none space-y-4 ${textStyle}`}>
            {[
              "Ser estudiante de nivel primaria o secundaria en el sistema de Educación Regular del Estado Plurinacional de Bolivia.",
              "Registrar un tutor o profesor.",
              "Registrarse en el formulario de inscripción para el(las) área(s) que se postula.",
              "Cumplir los requisitos específicos de la categoría de competencia en la que se inscribe.",
              "Tener su documento de identificación personal vigente (cédula de identidad) en el desarrollo de la competencia.",
              "Contar con correo electrónico personal o del tutor."
            ].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-600 text-white mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`rounded-xl p-6 md:p-8 ${cardStyle}`}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${headingStyle}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Fechas importantes
              </span>
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h3 className="font-bold text-lg text-purple-600 mb-2">Etapa Clasificatoria</h3>
                <p className={textStyle}>
                  Las pruebas se llevarán a cabo de forma presencial el <strong className="text-purple-500">31 de mayo</strong> en el
                  Campus de la UMSS.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h3 className="font-bold text-lg text-purple-600 mb-2">Etapa Final</h3>
                <p className={textStyle}>
                  Las pruebas se llevarán a cabo el <strong className="text-purple-500">11 de julio</strong> en el Campus de
                  la UMSS.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`rounded-xl p-6 md:p-8 ${cardStyle}`}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${headingStyle}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Premios
              </span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-yellow-50">
                <div className="text-4xl mr-4">🥇</div>
                <div>
                  <h3 className="font-bold">Primer Lugar</h3>
                  <p className={`text-sm ${textStyle}`}>Medalla de Oro e ingreso libre a la FCyT (6to sec.)</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-lg bg-gray-100">
                <div className="text-4xl mr-4">🥈</div>
                <div>
                  <h3 className="font-bold">Segundo Lugar</h3>
                  <p className={`text-sm ${textStyle}`}>Medalla de Plata e ingreso libre a la FCyT (6to sec.)</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-lg bg-orange-50">
                <div className="text-4xl mr-4">🥉</div>
                <div>
                  <h3 className="font-bold">Tercer Lugar</h3>
                  <p className={`text-sm ${textStyle}`}>Medalla de Bronce e ingreso libre a la FCyT (6to sec.)</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-lg bg-blue-50">
                <div className="text-4xl mr-4">🏆</div>
                <div>
                  <h3 className="font-bold">4° y 5° Lugar</h3>
                  <p className={`text-sm ${textStyle}`}>Diplomas de honor</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SeccionInformativa;