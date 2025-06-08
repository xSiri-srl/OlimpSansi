import { FaSave } from "react-icons/fa";

const PanelAcciones = ({
  totalErrors,
  savingChanges,
  guardarTodosLosCambios,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <FaSave className="text-green-600 mr-2" />
          <span className="text-sm text-gray-700">
            {totalErrors > 0
              ? "Corrija los errores antes de guardar los cambios"
              : "Todos los datos están correctos. Puede guardar los cambios."}
          </span>
        </div>
        <button
          onClick={guardarTodosLosCambios}
          disabled={savingChanges || totalErrors > 0}
          className={`px-6 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center ${
            totalErrors > 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : savingChanges
              ? "bg-green-400 text-white cursor-wait"
              : "bg-green-600 hover:bg-green-700 hover:shadow-lg text-white"
          }`}
        >
          <FaSave className="mr-2" />
          {savingChanges ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
      {totalErrors > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-yellow-700 text-xs">
            <strong>Importante:</strong> Debe corregir todos los errores antes
            de poder guardar los cambios. Haga clic en cada fila con error para
            editarla.
          </p>
        </div>
      )}
    </div>
  );
};

export default PanelAcciones;
