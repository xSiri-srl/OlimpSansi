import React from 'react';
import DarkModeToggle from "./DarkModeToggle";

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="relative flex flex-col items-center mb-6">
      <div className="text-center mb-4">
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          Panel de Administración
        </h1>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          Estadísticas de la O! Sansi 2025
        </p>
      </div>
      <div className="absolute right-0 top-0">
        <DarkModeToggle
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    </div>
  );
};

export default Header;