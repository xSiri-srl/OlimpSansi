import { FaSave, FaSpinner } from "react-icons/fa";

const AccionesFooter = ({
  guardarConfiguracion,
  olimpiadaSeleccionada,
  guardando,
  mensajeExito,
}) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div></div>
      
      <div className="flex items-center">
        {mensajeExito && (
          <span className="mr-4 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
            {mensajeExito}
          </span>
        )}
        
        <button
          onClick={guardarConfiguracion}
          disabled={guardando || !olimpiadaSeleccionada}
          className={`flex items-center px-4 py-2 rounded shadow-sm transition-colors ${
            olimpiadaSeleccionada
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {guardando ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AccionesFooter;