import React from 'react';
import { motion } from "framer-motion";
const Inicio = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-700 to-red-700">
      {/* Título animado */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-extrabold text-white text-right mb-6 drop-shadow-md"
      >
        Bienvenido a
      </motion.h1>

      {/* Logo animado */}
      <motion.img
        src="/images/Ohsansi_Logo.png"
        alt="OlimpSansi Logo"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, type: "spring", stiffness: 80 }}
        className="h-26 w-auto drop-shadow-lg"
      />

    </div>
  );
};
export default Inicio;