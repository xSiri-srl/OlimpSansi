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
    const { globalData, setGlobalData, setEstudiantes } = useFormData()
    const [uploadProgress, setUploadProgress] = useState(0)

    const cabecerasEsperadas = [
      { contenido: 'Datos del colegio', fila: 0, columna: 0 },
      { contenido: 'Departamento', fila: 1, columna: 0 },
      { contenido: 'Provincia', fila: 2, columna: 0 },
      { contenido: 'Datos del competidor', fila: 3, columna: 0 },
      { contenido: 'Apellido Paterno', fila: 4, columna: 0 },
      { contenido: 'Apellido Materno', fila: 4, columna: 1 },
      { contenido: 'Nombres', fila: 4, columna: 2 },
      { contenido: 'Carnet de Identidad', fila: 4, columna: 3 },
      { contenido: 'Fecha de nacimiento', fila: 4, columna: 4 },
      { contenido: 'Correo Electronico', fila: 4, columna: 5 },
      { contenido: 'El correo pertenece a', fila: 4, columna: 6 },
      { contenido: 'Curso', fila: 4, columna: 7 },
      { contenido: 'Rol del tutor', fila: 4, columna: 8 },
      { contenido: 'Apellido Paterno', fila: 4, columna: 9 },
      { contenido: 'Apellido Materno', fila: 4, columna: 10 },
      { contenido: 'Nombres', fila: 4, columna: 11 },
      { contenido: 'Carnet de Identidad', fila: 4, columna: 12 },
      { contenido: 'Correo Electronico', fila: 4, columna: 13 },
      { contenido: 'Telefono/celular', fila: 4, columna: 14 },
      { contenido: 'Area', fila: 4, columna: 15 },
      { contenido: 'Categoria', fila: 4, columna: 16 },
      { contenido: 'Apellido Paterno', fila: 4, columna: 17 },
      { contenido: 'Apellido Materno', fila: 4, columna: 18 },
      { contenido: 'Nombres', fila: 4, columna: 19 },
      { contenido: 'Carnet de Identidad', fila: 4, columna: 20 },
      { contenido: 'Correo Electronico', fila: 4, columna: 21 }
    ];
    function validarCabecerasExcel(rawData) {
      const errores = [];
    
      cabecerasEsperadas.forEach(({ contenido, fila, columna }) => {
        const valorCelda = rawData[fila]?.[columna]?.toString().trim();
        if (valorCelda !== contenido) {
          errores.push(
            `Error en fila ${fila + 1}, columna ${columna + 1}: se esperaba "${contenido}", pero se encontró "${valorCelda || 'vacío'}"`
          );
        }
      });
    
      return errores.length > 0 ? errores : null;
    }
    
    const getFirstNonEmptyInRange = (row, startCol, endCol) => {
      for (let i = startCol; i <= endCol; i++) {
        if (row[i] && row[i].toString().trim() !== "") {
          return row[i]
        }
      }
      return ""
    }

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
        setError("Archivo no permitido. Solo se aceptan archivos Excel")
      }
    }

    const previewExcelFile = async (file) => {
      try {
        const data = await readExcelFile(file)
        setPreviewData(data)
      } catch (err) {
        console.error("Error al previsualizar el archivo:", err)
        setError("No se pudo leer el archivo Excel. Verifica que el formato sea correcto.")
      }
    }

    const processExcelFile = async (file) => {
      setLoading(true)
      try {
        const data = await readExcelFile(file)
        console.log("Datos procesados del Excel:", data)

        if (!data || data.length === 0) {
          setError("No se pudieron extraer datos del archivo Excel.")
          setLoading(false)
          return false
        }

        setEstudiantes(data.inscripciones)

        setGlobalData({
          ...globalData,
          estudiantes: data.inscripciones,
          responsable_inscripcion: data.responsable_inscripcion,
        })

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

            // Convertir a un array de celdas con sus coordenadas
            const rawData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: "",
            })
            console.log("Datos crudos del Excel (rawData):", rawData)
            
            // Procesar el formato específico del Excel
            const processedData = processSpecificExcelFormat(rawData, globalData)

            resolve(processedData)
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

    // Función para procesar el formato específico del Excel mostrado
    const processSpecificExcelFormat = (rawData, globalData) => {
      const colegio = {
        nombre_colegio: getFirstNonEmptyInRange(rawData[0], 1, 1),
        departamento: getFirstNonEmptyInRange(rawData[1], 1, 1),
        provincia: getFirstNonEmptyInRange(rawData[2], 1, 1),
      }

      // Encontrar las filas con datos de estudiantes (a partir de la fila 7)
      const estudiantes = []

      // Índices por grupo
      const apellidoPaternoIdx = 0
      const apellidoMaternoIdx = 1
      const nombresIdx = 2
      const ciIdx = 3
      const fechaNacimientoIdx = 4
      const correoIdx = 5
      const propietarioCorreoIdx = 6
      const cursoIdx = 7

      const rolTutorIdx = 8
      const tutorApellidoPaternoIdx = 9
      const tutorApellidoMaternoIdx = 10
      const tutorNombresIdx = 11
      const tutorCiIdx = 12
      const tutorCorreoIdx = 13
      const tutorTelefonoIdx = 14

      const areaIdx = 15
      const categoriaIdx = 16

      const tutorAcademicoApellidoPaternoIdx = 17
      const tutorAcademicoApellidoMaternoIdx = 18
      const tutorAcademicoNombresIdx = 19
      const tutorAcademicoCiIdx = 20
      const tutorAcademicoCorreoIdx = 21

      for (let i = 5; i < rawData.length; i++) {
        const row = rawData[i]
        if (row && row.length > 0 && row[apellidoPaternoIdx] && row[nombresIdx]) {
          const estudiante = {
            nombre: row[nombresIdx] || "",
            apellido_pa: row[apellidoPaternoIdx] || "",
            apellido_ma: row[apellidoMaternoIdx] || "",
            ci: row[ciIdx] ? String(row[ciIdx]) : "",
            fecha_nacimiento: row[fechaNacimientoIdx] ? formatDate(row[fechaNacimientoIdx]) : "",
            correo: row[correoIdx] || "",
            propietario_correo: row[propietarioCorreoIdx] || "Estudiante",
          }

          const tutorLegal = {
            nombre: row[tutorNombresIdx] || "",
            apellido_pa: row[tutorApellidoPaternoIdx] || "",
            apellido_ma: row[tutorApellidoMaternoIdx] || "",
            ci: row[tutorCiIdx] ? String(row[tutorCiIdx]) : "",
            correo: row[tutorCorreoIdx] || "",
            numero_celular: row[tutorTelefonoIdx] ? String(row[tutorTelefonoIdx]) : "",
            tipo: row[rolTutorIdx] || "Tutor Legal",
          }

          const area = row[areaIdx] || ""
          const categoria = row[categoriaIdx] || ""

          const tutorAcademico = {
            nombre: row[tutorAcademicoNombresIdx] || "",
            apellido_pa: row[tutorAcademicoApellidoPaternoIdx] || "",
            apellido_ma: row[tutorAcademicoApellidoMaternoIdx] || "",
            ci: row[tutorAcademicoCiIdx] ? String(row[tutorAcademicoCiIdx]) : "",
            correo: row[tutorAcademicoCorreoIdx] || "",
          }

          const estudianteCompleto = {
            estudiante,
            colegio: {
              nombre_colegio: colegio.nombre_colegio,
              departamento: colegio.departamento,
              provincia: colegio.provincia,
              curso: row[cursoIdx] || "",
            },
            areas_competencia: [
              {
                nombre_area: area,
                categoria: categoria,
              },
            ],
            tutor_legal: tutorLegal,
            tutores_academicos: [
              {
                nombre_area: area,
                tutor: tutorAcademico,
              },
            ],
          }

          estudiantes.push(estudianteCompleto)
        }
      }

      return {
        responsable_inscripcion: globalData.responsable_inscripcion || {
          nombre: "",
          apellido_pa: "",
          apellido_ma: "",
          ci: "",
        },
        inscripciones: estudiantes,
      }
    }

    // Función para formatear fechas
    const formatDate = (dateValue) => {
      if (!dateValue) return ""

      // Si ya es una fecha en formato YYYY-MM-DD, devolverla tal cual
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue
      }

      // Si es un número (fecha de Excel), convertirlo
      if (typeof dateValue === "number") {
        const date = new Date(Math.round((dateValue - 25569) * 86400 * 1000))
        return date.toISOString().split("T")[0]
      }

      // Si es una cadena con formato DD/MM/YYYY
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
        const parts = dateValue.split("/")
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
      }

      // Intentar parsear como fecha
      try {
        const date = new Date(dateValue)
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0]
        }
      } catch (e) {
        console.error("Error al formatear fecha:", e)
      }

      return dateValue
    }

    const handleSiguiente = async () => {
      if (selectedFile) {
        setLoading(true)
        setUploadProgress(0)

        // barra subiendo
        const duration = 2000 // 3 segundos
        const steps = 100
        const intervalTime = duration / steps
        let progress = 0

        const interval = setInterval(() => {
          progress += 1
          setUploadProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)
            processExcelFile(selectedFile).then((success) => {
              if (success) {
                setStep(3)
              }
              setLoading(false)
            })
          }
        }, intervalTime)
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

        <label className="border-2 border-dashed border-gray-500 p-6 w-full max-w-md flex flex-col items-center rounded-lg cursor-pointer hover:bg-blue-200">
          <input type="file" className="hidden" onChange={handleFileChange} accept=".xlsx,.xls" />
          <div className="flex flex-col items-center">
            <span className="text-green-600 text-4xl">
              <FaFileExcel size={60} />
            </span>
            {selectedFile ? (
              <p className="text-sm text-blue-500 mt-2">{selectedFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-blue-500 mt-2">Seleccionar archivo Excel</p>
                <p className="text-xs text-gray-400 mt-1">*.xlsx o *.xls</p>
              </>
            )}
          </div>
        </label>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          onClick={handleSiguiente}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Siguiente"}
        </button>
        {loading && (
          <div className="w-full max-w-md mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-75"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 mt-2 text-center">Subiendo archivo... {uploadProgress}%</p>
          </div>
        )}
      </div>
    )
  }

  export default SubirArchivo

