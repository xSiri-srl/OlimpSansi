import { FaSave, FaSpinner } from "react-icons/fa";

const AccionesFooter = ({
  guardarConfiguracion,
  olimpiadaSeleccionada,
  guardando,
  mensajeExito,
  textoBoton = "Guardar Cambios"
}) => {
  return (
    <>
      <div className="flex justify-between items-center mt-6">
        <div></div>
        <button
          onClick={guardarConfiguracion}
          disabled={guardando || !olimpiadaSeleccionada}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
            olimpiadaSeleccionada && !guardando
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {guardando ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {guardando ? "Guardando..." : textoBoton}
        </button>
      </div>

      {mensajeExito && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
          {mensajeExito}
        </div>
      )}
    </>
  );
};

export default AccionesFooter;