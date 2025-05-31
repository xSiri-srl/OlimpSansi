"use client";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
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
  FaDownload,
  FaSave,
} from "react-icons/fa";
import EditarEstudianteModal from "./Modales/EditarEstudianteModal";

const CodigoPreInscripcion = () => {
  const navigate = useNavigate();
  const [codigoPreInscripcion, setCodigoPreInscripcion] = useState("");
  const [error, setError] = useState("");
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const endpoint = "http://127.0.0.1:8000/api";
  
  // Estado para manejar la lista de estudiantes
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursoAreaCategoria, setCursoAreaCategoria] = useState(null);
  const [processedEstudiantes, setProcessedEstudiantes] = useState([]);
  
  // Estados para paginación y filtrado
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("todos"); // 'todos', 'errores'
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para modales personalizados
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    type: ""
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Verificar código y obtener datos
  const verificarCodigo = async () => {
    if (!codigoPreInscripcion.trim()) return;

    setLoading(true);
    setError("");
    setResumen(null);
    setEstudiantes([]);
    setProcessedEstudiantes([]);

    try {
      // Paso 1: Verificar si ya se generó una orden de pago
      const ordenPagoResponse = await axios.get(`${endpoint}/orden-pago-existe/${codigoPreInscripcion}`);
      if (ordenPagoResponse.data?.existe) {
        setError("Ya se generó una orden de pago. Solo se puede editar la inscripción antes de generarla.");
        setLoading(false);
        return;
      }
    } catch (ordenError) {
      if (axios.isAxiosError(ordenError) && ordenError.response?.status === 404) {
        setError("Código no encontrado.");
      } else {
        setError("Error al verificar si existe una orden de pago.");
      }
      console.error(ordenError);
      setLoading(false);
      return;
    }

    try {
      // Paso 2: Buscar preinscripciones si no hay orden generada
      const response = await axios.get(`${endpoint}/preinscritos-por-codigo`, {
        params: { codigo: codigoPreInscripcion },
      });

      console.log(response.data);
      setResumen(response.data);

      // Paso 3: Si hay estudiantes y hay un id_olimpiada, cargar áreas y categorías
      const estudiantesLista = Array.isArray(response.data)
        ? response.data
        : response.data.estudiantes;

      if (estudiantesLista?.length > 0 && estudiantesLista[0].id_olimpiada) {
        try {
          const response = await axios.get(`${endpoint}/cursoAreaCategoriaPorOlimpiada?id=${estudiantesLista[0].id_olimpiada}`);
          setCursoAreaCategoria(response.data);
        } catch (err2) {
          console.error("Error al obtener las áreas y categorías:", err2);
          setError("No se pudieron cargar las áreas y categorías.");
        }
      }

      // Guardar estudiantes
      if (estudiantesLista && Array.isArray(estudiantesLista)) {
        setEstudiantes(estudiantesLista);
        processStudents(estudiantesLista);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("No se encontraron Pre Inscripciones asociadas a este código.");
      } else {
        setError("Error al verificar el código. Intente nuevamente.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para procesar estudiantes
  const processStudents = (estudiantesData) => {
    const processed = estudiantesData.map((est, index) => {
      // Arrays para recopilar todos los errores posibles
      const errores = [];
      let hasError = false;
      let mensajeError = "";
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

      // Obtener áreas para mostrar
      const areas = est.areas_competencia && Array.isArray(est.areas_competencia)
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
        correo: est.estudiante?.correo || "",
        fechaNacimiento: est.estudiante?.fecha_nacimiento || "",
        areas: areas,
        error: hasError, // Este valor determina si la tarjeta se muestra en rojo
        mensajeError: mensajeError, // Mensaje que se muestra en la tarjeta
        todosErrores: errores, // Lista completa de errores para depuración
        originalData: est,
      };
    });

    setProcessedEstudiantes(processed);
  };

  // Mapa de íconos para áreas
  const areaIcons = {
    Matemáticas: <FaCalculator className="text-blue-600" />,
    Física: <FaAtom className="text-purple-600" />,
    Química: <FaFlask className="text-green-600" />,
    Biología: <FaFlask className="text-green-800" />,
    Informática: <FaFileAlt className="text-yellow-600" />,
    Robótica: <FaRobot className="text-gray-600" />,
    "Astronomía y Astrofísica": <FaAtom className="text-indigo-600" />,
  };

  // Filtrado de estudiantes
  const filteredEstudiantes = processedEstudiantes.filter((estudiante) => {
    const matchesSearch =
      estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "errores") {
      return estudiante.error && matchesSearch;
    }

    return matchesSearch;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstudiantes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);

  // Función para manejar el clic en un estudiante
  const handleStudentClick = (estudiante) => {
    setSelectedStudent(estudiante);
    setModalContent({
      title: "Detalles del Estudiante",
      content: estudiante,
      type: "details"
    });
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };
const handleCloseModal2 = () => {
    setShowModal(false);
    setSelectedStudent(null);
    navigate("/")
  };
  // Función para guardar cambios después de editar
  const handleSaveEdit = (updatedData) => {
    // Implementar la lógica para guardar los cambios
    console.log("Datos actualizados:", updatedData);
    
    // Simulación de actualización
    const updatedEstudiantes = estudiantes.map((est, index) => {
      if (index === selectedStudent.id - 1) {
        // Aquí deberías integrar los cambios de updatedData en est
        return {...est, ...updatedData};
      }
      return est;
    });

    // Actualizar el estado
    setEstudiantes(updatedEstudiantes);
    processStudents(updatedEstudiantes);
    
    // Cerrar el modal
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Función para enviar todos los cambios al servidor
  const guardarTodosLosCambios = async () => {
    if (!codigoPreInscripcion.trim()) {
      setError("No hay código de pre-inscripción válido.");
      return;
    }

    setSavingChanges(true);
    setError("");

    try {
      const datosParaEnviar = {
        estudiantes: estudiantes
      };
      console.log("ENVIANDO",datosParaEnviar)
      const response = await axios.post(`${endpoint}/editarLista`, datosParaEnviar);

      if (response.data.success || response.status === 200) {
        // Mostrar mensaje de éxito
        setModalContent({
          title: "Éxito",
          content: "Los cambios se han guardado correctamente.",
          type: "success"
        });
        setShowModal(true);
        
      }
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      let errorMessage = "Error al guardar los cambios. Intente nuevamente.";
      
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status === 422) {
          errorMessage = "Datos inválidos. Verifique la información ingresada.";
        } else if (err.response?.status === 404) {
          errorMessage = "No se encontró el código de pre-inscripción.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setSavingChanges(false);
    }
  };

  // Función para la paginación
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Calcular el total de errores
  const totalErrors = processedEstudiantes.filter((e) => e.error).length;

  const descargarResumenPDF = () => {
    // Implementar la lógica para descargar el PDF
    console.log("Descargando resumen en PDF...");
  };

  // Componente Modal personalizado para reemplazar los módulos importados
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
        <div className="relative w-full max-w-2xl mx-auto my-6">
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-gray-600 hover:text-gray-900 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              {children}
            </div>
            <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
              <button
                className="text-gray-500 background-transparent font-medium px-4 py-2 text-sm rounded hover:bg-gray-100 mr-2"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-9 shadow-lg rounded-lg">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Por favor, ingrese el código de pre inscripcion proporcionado al
            finalizar el formulario de REGISTRAR COMPETIDOR.
          </h2>
          <input
            type="text"
            value={codigoPreInscripcion}
            onChange={(e) => {
              setCodigoPreInscripcion(e.target.value);
              setResumen(null);
              setError("");
              setEstudiantes([]);
              setProcessedEstudiantes([]);
            }}
            className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el código"
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="flex justify-center mt-6">
            <button
              onClick={verificarCodigo}
              disabled={loading || !codigoPreInscripcion.trim()}
              className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
                codigoPreInscripcion.trim() && !loading
                  ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          </div>
        </div>

        {/* Lista de Competidores */}
        {processedEstudiantes.length > 0 && (
          <div className="mt-8">
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
                  competidores con errores que deben corregirse. Las filas marcadas en rojo indican 
                  los registros con problemas.
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

            {/* Botón para guardar todos los cambios */}
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
                    <strong>Importante:</strong> Debe corregir todos los errores antes de poder guardar los cambios.
                    Haga clic en cada fila con error para editarla.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal personalizado para reemplazar los modales importados */}
      {showModal && selectedStudent && modalContent.type !== "success" && (
        <EditarEstudianteModal
            estudiante={selectedStudent}
            onClose={handleCloseModal}
            onSave={handleSaveEdit}
            cursoAreaCategoria={cursoAreaCategoria}
            estudiantes={estudiantes}
            onEstudiantesChange={setEstudiantes}
        />
      )}

      {/* Modal de éxito */}
      {showModal && modalContent.type === "success" && (
        <Modal show={showModal} onClose={handleCloseModal2} title={modalContent.title}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FaSave className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {modalContent.title}
            </h3>
            <p className="text-sm text-gray-500">
              {modalContent.content}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CodigoPreInscripcion;