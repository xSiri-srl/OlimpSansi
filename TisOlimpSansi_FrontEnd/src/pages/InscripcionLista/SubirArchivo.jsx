"use client"

import { useState } from "react"
import { FaFileExcel } from "react-icons/fa"
import * as XLSX from "xlsx"
import { useFormData } from "./form-context"

function SubirArchivo({ setStep }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const { globalData, setEstudiantes } = useFormData()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]

    if (file && (allowedTypes.includes(file.type) || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file)
      setError("")
      // Mostrar una vista previa de los datos
      previewExcelFile(file)
    } else {
      setSelectedFile(null)
      setPreviewData(null)
      setError("Solo se permiten archivos Excel (.xlsx o .xls)")
    }
  }

  const previewExcelFile = async (file) => {
    try {
      const data = await readExcelFile(file)
      // Mostrar solo los primeros 3 registros como vista previa
      setPreviewData(data.slice(0, 3))
    } catch (err) {
      console.error("Error al previsualizar el archivo:", err)
      setError("No se pudo leer el archivo Excel. Verifica que el formato sea correcto.")
    }
  }

  const processExcelFile = async (file) => {
    setLoading(true)
    try {
      const data = await readExcelFile(file)
      console.log("Datos leídos del Excel:", data)

      if (data.length === 0) {
        setError("El archivo Excel no contiene datos.")
        setLoading(false)
        return false
      }

      const formattedData = formatDataToJSON(data)
      console.log("Datos formateados a JSON:", formattedData)

      setEstudiantes(formattedData)
      setLoading(false)
      return true
    } catch (err) {
      console.error("Error al procesar el archivo:", err)
      setError(`Error al procesar el archivo: ${err.message}. Verifica que el formato sea correcto.`)
      setLoading(false)
      return false
    }
  }

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          // Convertir a JSON con encabezados
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false, // Convertir valores a strings
            defval: "", // Valor por defecto para celdas vacías
          })

          console.log("Datos del Excel:", jsonData)
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsArrayBuffer(file)
    })
  }

  const formatDataToJSON = (excelData) => {
    return excelData.map((row, index) => {
      console.log(`Procesando fila ${index + 1}:`, row)

      // Función para obtener un valor de manera segura
      const getValue = (obj, key, defaultValue = "") => {
        // Buscar la clave exacta
        if (obj[key] !== undefined) return obj[key]

        // Buscar de manera insensible a mayúsculas/minúsculas
        const lowerKey = key.toLowerCase()
        const matchingKey = Object.keys(obj).find((k) => k.toLowerCase() === lowerKey)
        return matchingKey !== undefined ? obj[matchingKey] : defaultValue
      }

      // Extraer datos del estudiante
      const estudiante = {
        nombre:
          getValue(row, "nombre_estudiante") || getValue(row, "nombre") || getValue(row, "nombres_estudiante") || "",
        apellido_pa:
          getValue(row, "apellido_paterno_estudiante") ||
          getValue(row, "apellido_paterno") ||
          getValue(row, "paterno") ||
          "",
        apellido_ma:
          getValue(row, "apellido_materno_estudiante") ||
          getValue(row, "apellido_materno") ||
          getValue(row, "materno") ||
          "",
        ci: getValue(row, "ci_estudiante") || getValue(row, "ci") || getValue(row, "carnet") || "",
        fecha_nacimiento: getValue(row, "fecha_nacimiento") || getValue(row, "nacimiento") || "",
        correo: getValue(row, "correo_estudiante") || getValue(row, "correo") || getValue(row, "email") || "",
        propietario_correo: getValue(row, "propietario_correo") || "Estudiante",
      }

      // Extraer datos del colegio
      const colegio = {
        nombre_colegio:
          getValue(row, "nombre_colegio") || getValue(row, "colegio") || getValue(row, "institucion") || "",
        departamento: getValue(row, "departamento") || getValue(row, "depto") || "",
        provincia: getValue(row, "provincia") || "",
        curso: getValue(row, "curso") || getValue(row, "grado") || "",
      }

      // Extraer datos del tutor legal
      const tutor_legal = {
        nombre: getValue(row, "nombre_tutor") || getValue(row, "tutor_nombre") || "",
        apellido_pa: getValue(row, "apellido_paterno_tutor") || getValue(row, "tutor_apellido_paterno") || "",
        apellido_ma: getValue(row, "apellido_materno_tutor") || getValue(row, "tutor_apellido_materno") || "",
        ci: getValue(row, "ci_tutor") || getValue(row, "tutor_ci") || "",
        correo: getValue(row, "correo_tutor") || getValue(row, "tutor_correo") || getValue(row, "tutor_email") || "",
        numero_celular:
          getValue(row, "celular_tutor") || getValue(row, "tutor_celular") || getValue(row, "tutor_telefono") || "",
        tipo: "Tutor Legal",
      }

      // Crear el objeto completo
      return {
        responsable_inscripcion: {
          nombre: globalData.responsable_inscripcion?.nombre || "",
          apellido_pa: globalData.responsable_inscripcion?.apellido_pa || "",
          apellido_ma: globalData.responsable_inscripcion?.apellido_ma || "",
          ci: globalData.responsable_inscripcion?.ci || "",
        },
        estudiante,
        colegio,
        areas_competencia: parseAreasCompetencia(row),
        tutor_legal,
        tutores_academicos: parseTutoresAcademicos(row),
      }
    })
  }

  // Función para parsear las áreas de competencia desde el Excel
  const parseAreasCompetencia = (row) => {
    const areas = []

    // Función para obtener un valor de manera segura
    const getValue = (obj, key, defaultValue = "") => {
      // Buscar la clave exacta
      if (obj[key] !== undefined) return obj[key]

      // Buscar de manera insensible a mayúsculas/minúsculas
      const lowerKey = key.toLowerCase()
      const matchingKey = Object.keys(obj).find((k) => k.toLowerCase() === lowerKey)
      return matchingKey !== undefined ? obj[matchingKey] : defaultValue
    }

    // Buscar áreas en diferentes formatos posibles
    const areasString = getValue(row, "areas") || getValue(row, "areas_competencia") || ""

    if (areasString) {
      const areasArray = areasString
        .split(/[,;]/)
        .map((area) => area.trim())
        .filter((area) => area)
      areasArray.forEach((area) => {
        areas.push({
          nombre_area: area,
          categoria: getValue(row, `categoria_${area.toLowerCase().replace(/\s+/g, "_")}`) || "",
        })
      })
    }

    // Buscar áreas individuales
    for (let i = 1; i <= 5; i++) {
      const areaKey = `area_${i}`
      const area = getValue(row, areaKey)
      if (area) {
        areas.push({
          nombre_area: area,
          categoria:
            getValue(row, `categoria_${i}`) ||
            getValue(row, `categoria_${area.toLowerCase().replace(/\s+/g, "_")}`) ||
            "",
        })
      }
    }

    // Buscar áreas específicas comunes
    const commonAreas = ["matematicas", "robótica", "física", "química", "informática", "programación"]
    commonAreas.forEach((commonArea) => {
      if (
        getValue(row, commonArea) === "si" ||
        getValue(row, commonArea) === "sí" ||
        getValue(row, commonArea) === "true" ||
        getValue(row, commonArea) === "1"
      ) {
        areas.push({
          nombre_area: commonArea.charAt(0).toUpperCase() + commonArea.slice(1),
          categoria: getValue(row, `categoria_${commonArea}`) || "",
        })
      }
    })

    // Si no se encontraron áreas, añadimos valores por defecto
    if (areas.length === 0) {
      areas.push({ nombre_area: "Matemáticas" })
      areas.push({ nombre_area: "Robótica", categoria: "" })
    }

    return areas
  }

  // Función para parsear los tutores académicos desde el Excel
  const parseTutoresAcademicos = (row) => {
    const tutores = []

    // Función para obtener un valor de manera segura
    const getValue = (obj, key, defaultValue = "") => {
      // Buscar la clave exacta
      if (obj[key] !== undefined) return obj[key]

      // Buscar de manera insensible a mayúsculas/minúsculas
      const lowerKey = key.toLowerCase()
      const matchingKey = Object.keys(obj).find((k) => k.toLowerCase() === lowerKey)
      return matchingKey !== undefined ? obj[matchingKey] : defaultValue
    }

    // Obtener áreas de competencia
    const areas = parseAreasCompetencia(row)

    // Para cada área, buscar información del tutor
    areas.forEach((area) => {
      const areaKey = area.nombre_area.toLowerCase().replace(/\s+/g, "_")

      // Buscar información del tutor en diferentes formatos
      const tutorNombre = getValue(row, `tutor_${areaKey}_nombre`) || getValue(row, `nombre_tutor_${areaKey}`) || ""
      const tutorApellidoPa =
        getValue(row, `tutor_${areaKey}_apellido_pa`) || getValue(row, `apellido_paterno_tutor_${areaKey}`) || ""
      const tutorApellidoMa =
        getValue(row, `tutor_${areaKey}_apellido_ma`) || getValue(row, `apellido_materno_tutor_${areaKey}`) || ""
      const tutorCi = getValue(row, `tutor_${areaKey}_ci`) || getValue(row, `ci_tutor_${areaKey}`) || ""
      const tutorCorreo = getValue(row, `tutor_${areaKey}_correo`) || getValue(row, `correo_tutor_${areaKey}`) || ""

      // Si hay al menos un dato del tutor, añadirlo
      if (tutorNombre || tutorApellidoPa || tutorCi) {
        tutores.push({
          nombre_area: area.nombre_area,
          tutor: {
            nombre: tutorNombre,
            apellido_pa: tutorApellidoPa,
            apellido_ma: tutorApellidoMa,
            ci: tutorCi,
            correo: tutorCorreo,
          },
        })
      }
    })

    // Si no se encontraron tutores, añadimos valores por defecto
    if (tutores.length === 0) {
      tutores.push({
        nombre_area: "Matemáticas",
        tutor: {
          nombre: "Vladimir",
          apellido_pa: "Rams",
          apellido_ma: "Tein",
          ci: "741258",
          correo: "vladi@gmail.com",
        },
      })
      tutores.push({
        nombre_area: "Robótica",
        tutor: {
          nombre: "Edeni",
          apellido_pa: "Huanca",
          apellido_ma: "Arias",
          ci: "654",
          correo: "edeniAr@gmail.com",
        },
      })
    }

    return tutores
  }

  const handleSiguiente = async () => {
    if (selectedFile) {
      const success = await processExcelFile(selectedFile)
      if (success) {
        setStep(3) // Avanzar al siguiente paso
      }
    } else {
      setError("Por favor, selecciona un archivo Excel válido")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2 text-gray-500">Sube tu lista en formato Excel</h2>
      <p className="text-sm text-gray-600 mb-4">
        El archivo debe contener la información de los estudiantes que deseas registrar.
      </p>

      <label className="border-2 border-dashed border-gray-400 p-6 w-full max-w-md flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-200">
        <input type="file" className="hidden" onChange={handleFileChange} accept=".xlsx,.xls" />
        <div className="flex flex-col items-center">
          <span className="text-green-600 text-4xl">
            <FaFileExcel size={60} />
          </span>
          <p className="text-sm text-gray-500 mt-2">Seleccionar archivo Excel</p>
          <p className="text-xs text-gray-400 mt-1">Arrastra y suelta o haz clic para seleccionar</p>
        </div>
      </label>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {selectedFile && <p className="text-sm text-green-600 mt-2">{selectedFile.name}</p>}

      {/* Vista previa de datos */}
      {previewData && previewData.length > 0 && (
        <div className="mt-4 w-full max-w-md">
          <h3 className="text-sm font-semibold">Vista previa de datos:</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(previewData[0])
                    .slice(0, 5)
                    .map((header, index) => (
                      <th key={index} className="border border-gray-300 px-2 py-1">
                        {header}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(previewData[0])
                      .slice(0, 5)
                      .map((header, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 px-2 py-1">
                          {row[header] || ""}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-1">Mostrando primeras 5 columnas y 3 filas</p>
        </div>
      )}

      <button
        onClick={handleSiguiente}
        disabled={!selectedFile || loading}
        className={`mt-4 px-6 py-2 rounded text-white ${
          !selectedFile || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Procesando..." : "Siguiente"}
      </button>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md">
        <h3 className="text-sm font-semibold text-blue-800">Formato esperado del Excel:</h3>
        <p className="text-xs text-blue-600 mt-1">
          El archivo debe contener columnas con información de los estudiantes. Algunas columnas recomendadas son:
        </p>
        <ul className="text-xs text-blue-600 mt-1 list-disc pl-5">
          <li>
            Datos del estudiante: nombre_estudiante, apellido_paterno_estudiante, apellido_materno_estudiante,
            ci_estudiante, fecha_nacimiento, correo_estudiante
          </li>
          <li>Datos del colegio: nombre_colegio, departamento, provincia, curso</li>
          <li>Áreas de competencia: areas (separadas por comas) o area_1, area_2, etc.</li>
          <li>
            Datos del tutor legal: nombre_tutor, apellido_paterno_tutor, apellido_materno_tutor, ci_tutor, correo_tutor,
            celular_tutor
          </li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          El sistema intentará reconocer tus columnas incluso si tienen nombres diferentes.
        </p>
      </div>
    </div>
  )
}

export default SubirArchivo

