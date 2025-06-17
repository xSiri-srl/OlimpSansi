import {
  FaUser,
  FaCalculator,
  FaFlask,
  FaRobot,
  FaAtom,
  FaFileAlt,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const TablaEstudiantes = ({
  processedEstudiantes,
  totalErrors,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filteredEstudiantes,
  totalPages,
  handleStudentClick,
  paginate,
}) => {
  const areaIcons = {
    Matemáticas: <FaCalculator className="text-blue-600" />,
    Física: <FaAtom className="text-purple-600" />,
    Química: <FaFlask className="text-green-600" />,
    Biología: <FaFlask className="text-green-800" />,
    Informática: <FaFileAlt className="text-yellow-600" />,
    Robótica: <FaRobot className="text-gray-600" />,
    "Astronomía y Astrofísica": <FaAtom className="text-indigo-600" />,
  };

  console.log(filteredEstudiantes);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstudiantes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );


  return (
    <>
      <div className="bg-white p-3 rounded-lg shadow-md mb-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium mr-2">Total inscripciones:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
            {processedEstudiantes.length}
          </span>
          <span className="font-medium mx-2">Con errores:</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">
            {totalErrors}
          </span>
        </div>
        <div className="flex mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="border rounded-l-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="border-l-0 border rounded-r-md px-2 py-1 bg-gray-50 focus:outline-none"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="todos">Todos</option>
            <option value="errores">Con errores</option>
          </select>
        </div>
      </div>
      {totalErrors > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 flex items-start">
          <FaExclamationCircle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
          <p className="text-yellow-700 text-sm">
            <span className="font-bold">Nota:</span> Existen {totalErrors}{" "}
            competidores con errores que deben corregirse. Las filas marcadas en
            rojo indican los registros con problemas.
          </p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Competidor
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Áreas
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((estudiante) => (
                <tr
                  key={estudiante.id}
                  onClick={() => handleStudentClick(estudiante)}
                  className={`${
                    estudiante.error ? "bg-red-50" : "hover:bg-gray-50"
                  } cursor-pointer transition`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-600 text-xs" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {estudiante.apellidoPaterno}{" "}
                          {estudiante.apellidoMaterno}
                        </div>
                        <div className="text-sm text-gray-500">
                          {estudiante.nombres}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap">
                      {estudiante.areas.map((area, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-0.5 mr-1 mb-1 rounded-full text-xs 
                            ${
                              estudiante.error &&
                              estudiante.mensajeError.includes(area)
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100"
                            }`}
                        >
                          {areaIcons[area] || (
                            <FaAtom className="text-gray-600" />
                          )}
                          <span className="ml-1 truncate max-w-[80px]">
                            {area}
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {estudiante.error ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Error
                        </span>
                        <p
                          className="text-red-500 text-xs mt-1 max-w-[200px] truncate"
                          title={estudiante.mensajeError}
                        >
                          {estudiante.mensajeError}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Correcto
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                  No se encontraron competidores con los criterios de búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-500">
          Mostrando {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredEstudiantes.length)} de{" "}
          {filteredEstudiantes.length}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>
          <div className="px-2 py-1">
            Página {currentPage} de {totalPages || 1}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FaChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center">
          <label className="text-sm text-gray-500 mr-2">Mostrar:</label>
          <select
            className="border rounded-md px-2 py-1 text-sm bg-white"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default TablaEstudiantes;
