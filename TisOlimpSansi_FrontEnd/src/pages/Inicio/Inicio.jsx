import React from 'react';
import { motion } from 'framer-motion';

const Inicio = () => {
  return (
    <div className="h-screen flex items-center justify-center  bg-gradient-to-r from-blue-800 via-purple-700 to-red-700">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-white text-left mb-10 md:mb-0">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
          >
            Bienvenido a <br></br>O! SANSI
          </motion.h1>

          <motion.p
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-lg mt-4 text-gray-200"
          >
            Olimpiada de Ciencia y Tecnología
          </motion.p>
        </div>

        <motion.img
          src="/images/Ohsansi_Logo.png"
          alt="OlimpSansi Logo"
          initial={{ x: 50, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 2.2,
            delay: 0.4,
            type: 'spring',
            stiffness: 80
          }}
          className="h-80 w-auto drop-shadow-xl"
        />
      </motion.div>
    </div>
  );
};

export default Inicio;
