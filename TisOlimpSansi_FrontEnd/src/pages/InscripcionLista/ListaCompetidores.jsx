"use client";

import { useState, useEffect } from "react";
import {
  FaUser,
  FaCalculator,
  FaFlask,
  FaRobot,
  FaAtom,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { useFormData } from "./form-context";
import ErrorModal from "./Modales/RegistrosInvalidosModal";
import DemasiadosErroresModal from "./Modales/DemasiadosErroresModal";
import ExitoModal from "./Modales/ExitoModal";
import EditarEstudianteModal from "./Modales/EditarEstudianteModal";

const ListaCompetidores = ({ setStep }) => {
  const { globalData, setGlobalData } = useFormData();

  const responsableInscripcion = globalData.responsable_inscripcion;
  const [showTooManyErrorsModal, setShowTooManyErrorsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("todos"); // 'todos', 'errores'
  const [searchTerm, setSearchTerm] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState("");

  // Get students from context
  const { estudiantes, setEstudiantes } = useFormData();
 
  // Map area names to icons
  const areaIcons = {
    Matemáticas: <FaCalculator className="text-blue-600" />,
    Física: <FaAtom className="text-purple-600" />,
    Química: <FaFlask className="text-green-600" />,
    Biología: <FaFlask className="text-green-800" />,
    Informática: <FaFileAlt className="text-yellow-600" />,
    Robótica: <FaRobot className="text-gray-600" />,
    "Astronomía y Astrofísica": <FaAtom className="text-indigo-600" />,
  };

  const processedEstudiantes = estudiantes.map((est, index) => {
    // Arrays para recopilar todos los errores posibles
    const errores = [];
    let hasError = false;
    let mensajeError = "";

    // PASO 1: Verificar si hay áreas de competencia que necesitan categoría pero no la tienen
    if (est.areas_competencia) {
      for (const area of est.areas_competencia) {
        if (
          area.nombre_area === "Informática" ||
          area.nombre_area === "Robótica"
        ) {
          // Si no hay categoría seleccionada, es un error
          if (!area.categoria || area.categoria.trim() === "") {
            errores.push(
              `Falta seleccionar categoría para ${area.nombre_area}`
            );
            hasError = true; // Marcar el registro como erróneo
          } else {
            // Si hay categoría, verificar que corresponda al curso
            const curso = est.colegio?.curso || "";
            const esPrimaria = curso.includes("Primaria");
            const esSecundaria = curso.includes("Secundaria");
            const numeroCurso = Number.parseInt(curso.match(/\d+/)?.[0] || "0");

            let categoriaIncorrecta = false;

            if (area.nombre_area === "Informática") {
              if (esPrimaria && (numeroCurso === 5 || numeroCurso === 6)) {
                categoriaIncorrecta = !area.categoria.includes("Guacamayo");
              } else if (esSecundaria && numeroCurso >= 1 && numeroCurso <= 3) {
                categoriaIncorrecta =
                  !area.categoria.includes("Guanaco") &&
                  !area.categoria.includes("Londra") &&
                  !area.categoria.includes("Bufeo");
              } else if (esSecundaria && numeroCurso >= 4 && numeroCurso <= 6) {
                categoriaIncorrecta =
                  !area.categoria.includes("Jucumari") &&
                  !area.categoria.includes("Puma");
              }
            }

            if (area.nombre_area === "Robótica") {
              if (esPrimaria && (numeroCurso === 5 || numeroCurso === 6)) {
                categoriaIncorrecta =
                  !area.categoria.includes("Builders P") &&
                  !area.categoria.includes("Lego P");
              } else if (esSecundaria) {
                categoriaIncorrecta =
                  !area.categoria.includes("Builders S") &&
                  !area.categoria.includes("Lego S");
              }
            }

            if (categoriaIncorrecta) {
              errores.push(
                `La categoría de ${area.nombre_area} no corresponde al curso ${curso}`
              );
              hasError = true; // Marcar el registro como erróneo
            }
          }
        }
      }
    }

    // PASO 2: Verificar otros errores solo si aún no se encontró ninguno
    if (!hasError) {
      if (
        est.estudiante?.nombre &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(est.estudiante.nombre)
      ) {
        errores.push("El nombre debe contener solo letras");
        hasError = true;
      } else if (
        est.estudiante?.apellido_pa &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(est.estudiante.apellido_pa)
      ) {
        errores.push("El apellido paterno debe contener solo letras");
        hasError = true;
      } else if (
        est.estudiante?.apellido_ma &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(est.estudiante.apellido_ma)
      ) {
        errores.push("El apellido materno debe contener solo letras");
        hasError = true;
      }
    }

    // Mensaje de error: mostrar el primer error encontrado
    mensajeError = errores.length > 0 ? errores[0] : "";

    // Log para depuración
    if (hasError) {
      console.log(
        `Estudiante ${index + 1} tiene errores: ${errores.join(", ")}`
      );
    }

    // Obtener áreas para mostrar
    const areas = est.areas_competencia
      ? est.areas_competencia
          .map((area) => area.nombre_area)
          .filter((area) => area)
      : [];

    return {
      id: index + 1,
      nombres: est.estudiante?.nombre || "",
      apellidoPaterno: est.estudiante?.apellido_pa || "",
      apellidoMaterno: est.estudiante?.apellido_ma || "",
      ci: est.estudiante?.ci || "",
      areas: areas,
      error: hasError, // Este valor determina si la tarjeta se muestra en rojo
      mensajeError: mensajeError, // Mensaje que se muestra en la tarjeta
      todosErrores: errores, // Lista completa de errores para depuración
      originalData: est,
    };
  });

  // Filtrar estudiantes
  const filteredEstudiantes = processedEstudiantes.filter((estudiante) => {
    const matchesSearch =
      estudiante.nombres.includes(searchTerm.toUpperCase()) ||
      estudiante.apellidoPaterno.includes(searchTerm.toUpperCase()) ||
      estudiante.apellidoMaterno.includes(searchTerm.toUpperCase());

    if (filter === "errores") {
      return estudiante.error && matchesSearch;
    }

    return matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstudiantes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);

  // Validar si hay más de 10 competidores con errores
  useEffect(() => {
    const errorsCount = processedEstudiantes.filter((est) => est.error).length;
    if (errorsCount > 10) {
      setShowTooManyErrorsModal(true);
    }
  }, []);

  const handleTooManyErrorsClose = () => {
    setShowTooManyErrorsModal(false);
    // Redirigir a la pantalla de subir archivo
    setStep(3);
  };

  // Modificado para mostrar directamente el modal de edición
  const handleStudentClick = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleSaveEdit = (updatedData) => {
    // Actualizar el estudiante en el array de estudiantes
    const updatedEstudiantes = estudiantes.map((est, index) => {
      if (index === selectedStudent.id - 1) {
        return updatedData;
      }
      return est;
    });

    // Actualizar el estado global
    setEstudiantes(updatedEstudiantes);

    // Cerrar el modal de edición
    setShowEditModal(false);
    setSelectedStudent(null);

    console.log("Datos actualizados:", updatedData);
  };

  const handleSiguiente = () => {
    const hayErrores = processedEstudiantes.some((est) => est.error);

    if (hayErrores) {
      setErrorMessage(
        "Hay estudiantes con errores. Por favor, corríjalos antes de continuar."
      );
      setShowErrorModal(true);
      return;
    }

    if (!responsableInscripcion) {
      setErrorMessage("Responsable de inscripción no encontrado.");
      setShowErrorModal(true);
      return;
    }

    // Avanzar directamente al paso 5 (confirmación)
    setStep(5);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalErrors = processedEstudiantes.filter((e) => e.error).length;

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="p-4">
      <>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Lista de Competidores
        </h2>

        {/* Panel de resumen */}
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

        {/* Mensaje de advertencia */}
        {totalErrors > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 flex items-start">
            <FaExclamationCircle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
            <p className="text-yellow-700 text-sm">
              <span className="font-bold">Nota:</span> Existen {totalErrors}{" "}
              competidores con errores que deben corregirse antes de continuar.
              Las filas marcadas en rojo indican los registros con problemas.
            </p>
          </div>
        )}

        {/* Tabla compacta de competidores */}
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
            estudiante.error && estudiante.mensajeError.includes(area)
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
                  <td
                    colSpan="3"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No se encontraron competidores con los criterios de
                    búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
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

        {/* Botones de navegación */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setStep(3)}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Atrás
          </button>
          <button
            onClick={handleSiguiente}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Siguiente
          </button>
        </div>
      </>

      {showEditModal && selectedStudent && (
        <EditarEstudianteModal
          estudiante={selectedStudent}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
      {showProgressBar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Registrando competidores...
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              {uploadProgress < 100
                ? "Enviando datos al servidor..."
                : "Completado"}
            </p>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <ExitoModal
          mensaje="La lista de competidores ha sido registrada exitosamente."
          onClose={handleSuccessModalClose}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          mensaje={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
      {showTooManyErrorsModal && (
        <DemasiadosErroresModal onClose={handleTooManyErrorsClose} />
      )}
    </div>
  );
};

export default ListaCompetidores;
