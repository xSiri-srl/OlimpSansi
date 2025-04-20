"use client"

import { useState, useEffect } from "react"
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
} from "react-icons/fa"
import { useFormData } from "./form-context"
import axios from "axios"
import ErrorModal from "./Modales/RegistrosInvalidosModal"
import DemasiadosErroresModal from "./Modales/DemasiadosErroresModal"
import ExitoModal from "./Modales/ExitoModal"
import EditarEstudianteModal from "./Modales/EditarEstudianteModal"

const ListaCompetidores = ({ setStep }) => {
  const { globalData, setGlobalData } = useFormData()

  const responsableInscripcion = globalData.responsable_inscripcion
  const [showTooManyErrorsModal, setShowTooManyErrorsModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filter, setFilter] = useState("todos") // 'todos', 'errores'
  const [searchTerm, setSearchTerm] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showProgressBar, setShowProgressBar] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [codigoGenerado, setCodigoGenerado] = useState("")

  // Get students from context
  const { estudiantes, setEstudiantes } = useFormData()
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
      est.areas_competencia.some((area) => {
        if (!area.nombre_area) return false
        // Normalizar el nombre del área para comparación insensible a mayúsculas/acentos
        const normalizedArea = area.nombre_area
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
        return (normalizedArea === "informatica" || normalizedArea === "robotica") && !area.categoria
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
      mensajeError: hasError
        ? est.areas_competencia &&
          est.areas_competencia.some((area) => {
            const normalizedArea = area.nombre_area
              ?.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
            return (normalizedArea === "informatica" || normalizedArea === "robotica") && !area.categoria
          })
          ? "Falta seleccionar categoría para Informática o Robótica"
          : "Faltan datos obligatorios del estudiante"
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

  // Validar si hay más de 10 competidores con errores
  useEffect(() => {
    const errorsCount = processedEstudiantes.filter((est) => est.error).length
    if (errorsCount > 10) {
      setShowTooManyErrorsModal(true)
    }
  }, [])

  const handleTooManyErrorsClose = () => {
    setShowTooManyErrorsModal(false)
    // Redirigir a la pantalla de subir archivo
    setStep(3)
  }

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
        return updatedData
      }
      return est
    })

    // Actualizar el estado global
    setEstudiantes(updatedEstudiantes)

    // Cerrar el modal de edición
    setShowEditModal(false)
    setSelectedStudent(null)

    console.log("Datos actualizados:", updatedData)
  }

  const handleSiguiente = () => {
    const hayErrores = processedEstudiantes.some((est) => est.error)

    if (hayErrores) {
      setErrorMessage("Hay estudiantes con errores. Por favor, corríjalos antes de continuar.")
      setShowErrorModal(true)
      return
    }

    if (!responsableInscripcion) {
      setErrorMessage("Responsable de inscripción no encontrado.")
      setShowErrorModal(true)
      return
    }

    // Mostrar la confirmación en lugar de enviar directamente
    setShowConfirmation(true)
  }

  const handleConfirmSubmit = async () => {
    // Estructura el JSON que se enviará
    const datosAEnviar = {
      responsable_inscripcion: responsableInscripcion,
      inscripciones: estudiantes,
    }

    console.log("Enviando datos:", datosAEnviar)
    // Iniciar barra de progreso
    setShowProgressBar(true)
    setUploadProgress(0)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newValue = prev + 2
        if (newValue >= 90) {
          clearInterval(progressInterval)
          return 90 // Mantenemos en 90% hasta que termine la petición
        }
        return newValue
      })
    }, 100)

    // Enviar los datos al servidor
    try {
      const response = await axios.post(`${endpoint}/inscribir-lista`, datosAEnviar)

      if (response.status === 201) {
        // Completar la barra de progreso
        setUploadProgress(100)
        clearInterval(progressInterval)

        // Guardar el código generado
        setCodigoGenerado(response.data.codigo_generado)

        // Actualizar el estado global con el código generado
        setGlobalData({
          ...globalData,
          codigoGenerado: response.data.codigo_generado,
        })

        // Generar PDF de orden de pago
        await axios.post(`${endpoint}/orden-pago/pdf`, {
          codigo_generado: response.data.codigo_generado,
        })

        // Mostrar modal de éxito en lugar de alerta
        setShowSuccessModal(true)
      } else {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al enviar la lista:", error)
      clearInterval(progressInterval)
      setShowProgressBar(false)
      setErrorMessage(`Hubo un error al enviar la lista: ${error.message}. Intenta nuevamente.`)
      setShowErrorModal(true)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setShowProgressBar(false)
    setShowConfirmation(false)
    setStep(5) // Avanzar al siguiente paso
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const totalErrors = processedEstudiantes.filter((e) => e.error).length

  const calcularTotalAreas = () => {
    let totalAreas = 0
    estudiantes.forEach((estudiante) => {
      if (estudiante.areas_competencia && Array.isArray(estudiante.areas_competencia)) {
        totalAreas += estudiante.areas_competencia.length
      }
    })
    return totalAreas
  }

  const calcularTotalImporte = () => {
    const totalAreas = calcularTotalAreas()
    return totalAreas * 20 // 20 Bs por área
  }

  const handleDownload = async () => {
    if (!codigoGenerado) {
      setErrorMessage("No hay código de orden de pago generado.")
      setShowErrorModal(true)
      return
    }

    try {
      const response = await axios.get(`${endpoint}/orden-pago/${codigoGenerado}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `orden_pago_lista_${codigoGenerado}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error descargando PDF:", error)
      setErrorMessage("Error al descargar la orden de pago")
      setShowErrorModal(true)
    }
  }

  return (
    <div className="p-4">
      {!showConfirmation ? (
        <>
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
                <span className="font-bold">Nota:</span> Existen {totalErrors} competidores con errores que deben
                corregirse antes de continuar. Las filas marcadas en rojo indican los registros con problemas.
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
                className={`p-1 rounded-md ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"
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
      ) : (
        // Pantalla de confirmación
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Resumen de Registro por Lista</h2>
          <p className="text-gray-600 mb-6">Por favor, revise la información antes de confirmar</p>

          {/* Resumen formateado de la información */}
          <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-left max-w-3xl mx-auto">
            {/* Sección del responsable de inscripción */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-blue-600">Responsable de Inscripción</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium">
                    {`${responsableInscripcion?.nombre || ""} 
                      ${responsableInscripcion?.apellido_pa || ""} 
                      ${responsableInscripcion?.apellido_ma || ""}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carnet de Identidad</p>
                  <p className="font-medium">{responsableInscripcion?.ci || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Correo Electrónico</p>
                  <p className="font-medium">{responsableInscripcion?.correo || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{responsableInscripcion?.numero_celular || ""}</p>
                </div>
              </div>
            </div>

            {/* Sección de resumen de estudiantes */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-blue-600">Resumen de Competidores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Total de Competidores</p>
                  <p className="font-medium">{estudiantes.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Áreas Registradas</p>
                  <p className="font-medium">{calcularTotalAreas()}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Distribución por Áreas</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {/* Conteo de áreas */}
                  {(() => {
                    const areaCount = {}
                    estudiantes.forEach((est) => {
                      if (est.areas_competencia && Array.isArray(est.areas_competencia)) {
                        est.areas_competencia.forEach((area) => {
                          if (area.nombre_area) {
                            areaCount[area.nombre_area] = (areaCount[area.nombre_area] || 0) + 1
                          }
                        })
                      }
                    })

                    return Object.entries(areaCount).map(([area, count]) => (
                      <div key={area} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                        <span>{area}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>

            {/* Sección de Desglose de Costos */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-blue-600">Importe</h3>
              <div className="mt-2">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <p className="font-medium">Costo por área</p>
                  <p className="font-medium">20 Bs.</p>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <p className="font-medium">Total de áreas</p>
                  <p className="font-medium">{calcularTotalAreas()}</p>
                </div>
                <div className="flex justify-between py-2 mt-2 font-bold text-blue-700">
                  <p>Total a pagar</p>
                  <p>{`${calcularTotalImporte()} Bs.`}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Recuerde que el pago debe ser realizado por el responsable de inscripción
              </p>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={handleCancelConfirmation}
              className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-600 shadow-md"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:bg-indigo-500 shadow-md"
            >
              Emitir Orden de Pago
            </button>
          </div>
        </div>
      )}

      {showEditModal && selectedStudent && (
        <EditarEstudianteModal estudiante={selectedStudent} onClose={handleCloseEditModal} onSave={handleSaveEdit} />
      )}
      {showProgressBar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">Registrando competidores...</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              {uploadProgress < 100 ? "Enviando datos al servidor..." : "Completado"}
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
      {showErrorModal && <ErrorModal mensaje={errorMessage} onClose={() => setShowErrorModal(false)} />}
      {showTooManyErrorsModal && <DemasiadosErroresModal onClose={handleTooManyErrorsClose} />}
    </div>
  )
}

export default ListaCompetidores
