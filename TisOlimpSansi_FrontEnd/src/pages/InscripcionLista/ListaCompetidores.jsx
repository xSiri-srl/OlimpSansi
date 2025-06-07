import { useState, useEffect, useMemo } from "react";
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
import { API_URL } from "../../utils/api";
import axios from "axios";

const ListaCompetidores = ({ setStep }) => {
  const { globalData, setGlobalData } = useFormData();
  const responsableInscripcion = globalData.responsable_inscripcion;
  const [showTooManyErrorsModal, setShowTooManyErrorsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [areasHabilitadas, setAreasHabilitadas] = useState([]);
  const [areasLoaded, setAreasLoaded] = useState(false);

  const { estudiantes, setEstudiantes } = useFormData();

  const areaIcons = {
    Matemáticas: <FaCalculator className="text-blue-600" />,
    Física: <FaAtom className="text-purple-600" />,
    Química: <FaFlask className="text-green-600" />,
    Biología: <FaFlask className="text-green-800" />,
    Informática: <FaFileAlt className="text-yellow-600" />,
    Robótica: <FaRobot className="text-gray-600" />,
    "Astronomía y Astrofísica": <FaAtom className="text-indigo-600" />,
  };

  const normalizeArea = (area) => {
    if (!area) return "";
    return area
      .toUpperCase()
      .replace("Á", "A")
      .replace("É", "E")
      .replace("Í", "I")
      .replace("Ó", "O")
      .replace("Ú", "U")
      .replace("Ñ", "N")
      .trim();
  };

  const convertirCategoriaAOriginal = (categoriaUI) => {
    if (!categoriaUI) return "";

    if (/^[A-Z0-9]+[PS]?$/.test(categoriaUI)) {
      return categoriaUI;
    }

    const uiToOriginalMapping = {
      '"Guacamayo" 5to a 6to Primaria': "GUACAMAYO",
      '"Guanaco" 1ro a 3ro Secundaria': "GUANACO",
      '"Londra" 1ro a 3ro Secundaria': "LONDRA",
      '"Bufeo" 1ro a 3ro Secundaria': "BUFEO",
      '"Jucumari" 4to a 6to Secundaria': "JUCUMARI",
      '"Puma" 4to a 6to Secundaria': "PUMA",
      '"Builders P" 5to a 6to Primaria': "BUILDERS P",
      '"Lego P" 5to a 6to Primaria': "LEGO P",
      '"Builders S" 1ro a 6to Secundaria': "BUILDERS S",
      '"Lego S" 1ro a 6to Secundaria': "LEGO S",
      "1ro Primaria": "1P",
      "2do Primaria": "2P",
      "3RO PRIMARIA": "3P",
      "4TO PRIMARIA": "4P",
      "5TO PRIMARIA": "5P",
      "6TO PRIMARIA": "6P",
      "1RO SECUNDARIA": "1S",
      "2DO SECUNDARIA": "2S",
      "3RO SECUNDARIA": "3S",
      "4TO SECUNDARIA": "4S",
      "5TO SECUNDARIA": "5S",
      "6TO SECUNDARIA": "6S",
    };

    if (uiToOriginalMapping[categoriaUI]) {
      return uiToOriginalMapping[categoriaUI];
    }

    const match = categoriaUI.match(/\"([^\"]+)\"/);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }

    return categoriaUI.toUpperCase();
  };

  useEffect(() => {
    const obtenerAreasHabilitadas = async () => {
      try {
        const olimpiadaId = globalData.olimpiada;
        const response = await axios.get(
          `${API_URL}/areas-habilitadas/${olimpiadaId}`
        );
        const areasData = response.data.data || [];
        setAreasHabilitadas(areasData);
        setAreasLoaded(true);
      } catch (error) {
        setAreasHabilitadas([]);
        setAreasLoaded(true);
      }
    };

    if (globalData.olimpiada) {
      obtenerAreasHabilitadas();
    }
  }, [globalData.olimpiada]);

  const normalizeString = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  const processedEstudiantes = useMemo(() => {
    if (!areasLoaded) {
      return estudiantes.map((est, index) => ({
        id: index + 1,
        nombres: est.estudiante?.nombre || "",
        apellidoPaterno: est.estudiante?.apellido_pa || "",
        apellidoMaterno: est.estudiante?.apellido_ma || "",
        ci: est.estudiante?.ci || "",
        areas: est.areas_competencia
          ? est.areas_competencia
              .map((area) => area.nombre_area)
              .filter((area) => area)
          : [],
        error: false,
        mensajeError: "Cargando validaciones...",
        todosErrores: [],
        originalData: est,
      }));
    }

    return estudiantes.map((est, index) => {
      const errores = [];
      let hasError = false;
      let mensajeError = "";

      if (est.areas_competencia && Array.isArray(est.areas_competencia)) {
        for (const area of est.areas_competencia) {
          const areaHabilitada = areasHabilitadas.find((ah) => {
            const coincide =
              normalizeArea(ah.area) === normalizeArea(area.nombre_area);
            return coincide;
          });

          if (!areaHabilitada) {
            errores.push(
              `El área ${area.nombre_area} no está habilitada para esta olimpiada`
            );
            hasError = true;
            continue;
          }

          if (area.categoria) {
            const categoriaOriginal = convertirCategoriaAOriginal(
              area.categoria
            );

            const categoriaValida = areaHabilitada.categorias.some((cat) => {
              const coincide =
                cat.toUpperCase() === categoriaOriginal.toUpperCase();
              return coincide;
            });

            if (!categoriaValida) {
              errores.push(
                `La categoría "${area.categoria}" no está disponible para el área ${area.nombre_area}`
              );
              hasError = true;
            }
          } else {
            errores.push(
              `Falta especificar la categoría para el área ${area.nombre_area}`
            );
            hasError = true;
          }
        }
      }

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
      mensajeError = errores.length > 0 ? errores[0] : "";

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
        error: hasError,
        mensajeError: mensajeError,
        todosErrores: errores,
        originalData: est,
      };
    });
  }, [estudiantes, areasHabilitadas, areasLoaded]);

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

  useEffect(() => {
    const errorsCount = processedEstudiantes.filter((est) => est.error).length;
    if (errorsCount > 10) {
      setShowTooManyErrorsModal(true);
    }
  }, [processedEstudiantes]);

  const handleTooManyErrorsClose = () => {
    setShowTooManyErrorsModal(false);
    setStep(3);
  };

  const handleStudentClick = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleSaveEdit = (updatedData) => {
    const updatedEstudiantes = estudiantes.map((est, index) => {
      if (index === selectedStudent.id - 1) {
        return updatedData;
      }
      return est;
    });

    setEstudiantes(updatedEstudiantes);

    setShowEditModal(false);
    setSelectedStudent(null);
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
      {!areasLoaded && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <p className="text-blue-700 text-sm">
            Cargando configuración de áreas habilitadas...
          </p>
        </div>
      )}
      <>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Lista de Competidores
        </h2>

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
              competidores con errores que deben corregirse antes de continuar.
              Las filas marcadas en rojo indican los registros con problemas.
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
