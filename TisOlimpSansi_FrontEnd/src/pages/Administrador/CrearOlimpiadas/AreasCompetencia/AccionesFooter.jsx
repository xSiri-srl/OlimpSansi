import React from "react";

const AccionesFooter = ({ 
  guardarConfiguracion, 
  olimpiadaSeleccionada, 
  guardando, 
  mensajeExito,
  textoBoton = "Guardar Configuración"
}) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <div>
        {mensajeExito && (
          <div className="text-green-600 font-medium animate-fadeIn">
            {mensajeExito}
          </div>
        )}
      </div>
      <button
        onClick={guardarConfiguracion}
        disabled={!olimpiadaSeleccionada || guardando}
        className={`px-4 py-2 text-white rounded-md shadow transition duration-150 ease-in-out ${
          !olimpiadaSeleccionada || guardando
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {guardando ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-opacity-50 border-t-blue-500 rounded-full animate-spin mr-2"></div>
            <span>Guardando...</span>
          </div>
        ) : (
          textoBoton
        )}
      </button>
    </div>
  );
};

export default AccionesFooter;