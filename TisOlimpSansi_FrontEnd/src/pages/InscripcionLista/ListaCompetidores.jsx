"use client"

import { useState } from "react"
import {
  FaUser,
  FaCalculator,
  FaFlask,
  FaRobot,
  FaAtom,
  FaFileAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa"
import { useFormData } from "./form-context"
import axios from "axios"
import EditarEstudianteModal from "./EditarEstudianteModal" // Importar el componente de edición

const ListaCompetidores = ({ setStep }) => {
  const { globalData } = useFormData()

  const responsableInscripcion = globalData.responsable_inscripcion

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filter, setFilter] = useState("todos") // 'todos', 'errores'
  const [searchTerm, setSearchTerm] = useState("")

  // Get students from context
  const { estudiantes, setEstudiantes }= useFormData()
  const endpoint = "http://localhost:8000/api"

  // Map area names to icons
  const areaIcons = {
    Matemáticas: <FaCalculator className="text-blue-600" />,
    Física: <FaAtom className="text-purple-600" />,
    Química: <FaFlask className="text-green-600" />,
    Biología: <FaFlask className="text-green-800" />,
    Informática: <FaFileAlt className="text-yellow-600" />,
    Robótica: <FaRobot className="text-gray-600" />,
    "Astronomía y Astrofísica": <FaAtom className="text-indigo-600" />,
  }

  // Process students to match the expected format
  const processedEstudiantes = estudiantes.map((est, index) => {
    // Check if student has all required data
    const hasError =
    !est.estudiante?.nombre ||
    !est.estudiante?.apellido_pa ||
    !est.areas_competencia ||
    est.areas_competencia.length === 0 ||
    est.areas_competencia.some(area => {
      if (!area.nombre_area) return false;
      // Normalizar el nombre del área para comparación insensible a mayúsculas/acentos
      const normalizedArea = area.nombre_area.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return (normalizedArea === "informatica" || normalizedArea === "robotica") && !area.categoria;
    })

    // Get areas from the student data
    const areas = est.areas_competencia
      ? est.areas_competencia.map((area) => area.nombre_area).filter((area) => area)
      : []

    return {
      id: index + 1,
      nombres: est.estudiante?.nombre || "",
      apellidoPaterno: est.estudiante?.apellido_pa || "",
      apellidoMaterno: est.estudiante?.apellido_ma || "",
      ci: est.estudiante?.ci || "",
      areas: areas,
      error: hasError,
      mensajeError: hasError ? 
      (est.areas_competencia && est.areas_competencia.some(area => {
        const normalizedArea = area.nombre_area?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return (normalizedArea === "informatica" || normalizedArea === "robotica") && !area.categoria;
      })
      ? "Falta seleccionar categoría para Informática o Robótica" 
      : "Faltan datos obligatorios del estudiante") 
      : "",
      originalData: est,
    }
  })

  // Filtrar estudiantes
  const filteredEstudiantes = processedEstudiantes.filter((estudiante) => {
    const matchesSearch =
      estudiante.nombres.includes(searchTerm.toUpperCase()) ||
      estudiante.apellidoPaterno.includes(searchTerm.toUpperCase()) ||
      estudiante.apellidoMaterno.includes(searchTerm.toUpperCase())

    if (filter === "errores") {
      return estudiante.error && matchesSearch
    }

    return matchesSearch
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEstudiantes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage)

  // Modificado para mostrar directamente el modal de edición
  const handleStudentClick = (estudiante) => {
    setSelectedStudent(estudiante)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedStudent(null)
  }

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

  const handleSiguiente = async () => {
    const hayErrores = processedEstudiantes.some((est) => est.error)

    if (hayErrores) {
      alert("Hay estudiantes con errores. Por favor, corríjalos antes de continuar.")
      return
    }

    if (!responsableInscripcion) {
      alert("Responsable de inscripción no encontrado.")
      return
    }

    // Estructura el JSON que se enviará
    const datosAEnviar = {
      responsable_inscripcion: responsableInscripcion,
      inscripciones: estudiantes,
    }

    console.log("Enviando datos:", datosAEnviar) 

    // Enviar los datos al servidor
    try {
      const response = await axios.post(`${endpoint}/inscribir-lista`, datosAEnviar)

      if (response.status === 201) {
        alert("Lista enviada exitosamente.")
        setStep(4) // Avanzar al siguiente paso
      } else {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al enviar la lista:", error)
      alert(`Hubo un error al enviar la lista: ${error.message}. Intenta nuevamente.`)
    }
  }

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const totalErrors = processedEstudiantes.filter((e) => e.error).length

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Lista de Competidores</h2>

      {/* Panel de resumen */}
      <div className="bg-white p-3 rounded-lg shadow-md mb-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium mr-2">Total competidores:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{processedEstudiantes.length}</span>

          <span className="font-medium mx-2">Con errores:</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">{totalErrors}</span>
        </div>

        <div className="flex mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="border rounded-l-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />

          <select
            className="border-l-0 border rounded-r-md px-2 py-1 bg-gray-50 focus:outline-none"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setCurrentPage(1)
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
            <span className="font-bold">Nota:</span> Existen {totalErrors} competidores con errores que deben corregirse
            antes de continuar. Las filas marcadas en rojo indican los registros con problemas.
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
                  className={`${estudiante.error ? "bg-red-50" : "hover:bg-gray-50"} cursor-pointer transition`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-600 text-xs" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {estudiante.apellidoPaterno} {estudiante.apellidoMaterno}
                        </div>
                        <div className="text-sm text-gray-500">{estudiante.nombres}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap">
                      {estudiante.areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 mr-1 mb-1 rounded-full text-xs bg-gray-100"
                        >
                          {areaIcons[area] || <FaAtom className="text-gray-600" />}
                          <span className="ml-1 truncate max-w-[80px]">{area}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {estudiante.error ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Error
                      </span>
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

      {/* Paginación */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-500">
          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEstudiantes.length)} de{" "}
          {filteredEstudiantes.length}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"}`}
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>

          <div className="px-2 py-1">
            Página {currentPage} de {totalPages || 1}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1 rounded-md ${currentPage === totalPages || totalPages === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"}`}
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
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
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
          onClick={() => setStep(2)}
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

      {/* Modal de edición del estudiante (ahora mostrado directamente) */}
      {showEditModal && selectedStudent && (
        <EditarEstudianteModal
          estudiante={selectedStudent}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}

export default ListaCompetidores