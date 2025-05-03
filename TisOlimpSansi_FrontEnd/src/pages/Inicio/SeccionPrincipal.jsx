import React from "react";
import { motion } from "framer-motion";

const SeccionPrincipal = ({ scrollToRequisitos }) => {
  return (
    <>
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-blue-800 via-purple-700 to-red-700">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white text-left mb-10 md:mb-0 z-10">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg"
            >
              Bienvenido a <br></br>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500">
                O! SANSI
              </span>
            </motion.h1>

            <motion.p
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-lg mt-4 text-gray-200"
            >
              Olimpiada de Ciencia y Tecnología
            </motion.p>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-6 px-6 py-3 bg-white text-purple-800 font-bold rounded-full hover:bg-purple-100 transition duration-300 shadow-lg"
              onClick={scrollToRequisitos}
            >
              ¡Inscríbete ahora!
            </motion.button>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute w-full h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 blur-xl opacity-70"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.img
              src="/images/Ohsansi_Logo.png"
              alt="OlimpSansi Logo"
              initial={{ x: 50, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 2.2,
                delay: 0.4,
                type: "spring",
                stiffness: 80,
              }}
              className="h-60 sm:h-72 md:h-80 w-auto drop-shadow-xl relative z-10"
            />
          </motion.div>
        </motion.div>
      </div>
      <h1 className="text-3xl sm:text-4xl p-5 text-center font-bold text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          OLIMPIADA CIENTÍFICA NACIONAL
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            SAN SIMÓN 2025
          </span>
        </motion.div>
      </h1>
    </>
  );
};

export default SeccionPrincipal;