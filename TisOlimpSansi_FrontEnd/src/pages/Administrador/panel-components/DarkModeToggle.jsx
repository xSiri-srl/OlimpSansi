import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-colors duration-200 ${
        darkMode ? "bg-gray-700 text-yellow-300" : "bg-blue-100 text-gray-800"
      }`}
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
};

export default DarkModeToggle;