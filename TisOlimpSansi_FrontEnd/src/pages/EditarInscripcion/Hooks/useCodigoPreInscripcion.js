import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const useCodigoPreInscripcion = () => {
  const [codigoPreInscripcion, setCodigoPreInscripcion] = useState("");
  const [error, setError] = useState("");
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursoAreaCategoria, setCursoAreaCategoria] = useState(null);
  const [processedEstudiantes, setProcessedEstudiantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPeriodoModal, setShowPeriodoModal] = useState(false);
  const [olimpiadaSeleccionadaInfo, setOlimpiadaSeleccionadaInfo] = useState({
    fechaIni: "",
    fechaFin: "",
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    type: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  const obtenerFechaBolivia = () => {
    const ahora = new Date();
    const fechaBolivia = new Date(ahora.toLocaleString("en-US", {timeZone: "America/La_Paz"}));
    return fechaBolivia;
  };

  const estaEnPeriodo = (fechaIni, fechaFin) => {
    try {
      console.log('Validando período con fechas:', { fechaIni, fechaFin });
      
      const ahoraBolivia = obtenerFechaBolivia();
      
      const fechaIniStr = fechaIni.replace('T00:00:00-04:00', '').replace('T23:59:59-04:00', '');
      const fechaFinStr = fechaFin.replace('T00:00:00-04:00', '').replace('T23:59:59-04:00', '');
      
      const inicio = new Date(fechaIniStr + 'T00:00:00');
      const fin = new Date(fechaFinStr + 'T23:59:59');
      
      const soloFechaHoy = new Date(ahoraBolivia.getFullYear(), ahoraBolivia.getMonth(), ahoraBolivia.getDate());
      const soloFechaInicio = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
      const soloFechaFin = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());
      
      console.log('Fechas para comparación:', {
        hoy: soloFechaHoy.toDateString(),
        inicio: soloFechaInicio.toDateString(),
        fin: soloFechaFin.toDateString()
      });
      
      const puedeEditar = soloFechaHoy >= soloFechaInicio && soloFechaHoy <= soloFechaFin;
      
      console.log('Resultado validación edición:', {
        mayorOIgualAInicio: soloFechaHoy >= soloFechaInicio,
        menorOIgualAFin: soloFechaHoy <= soloFechaFin,
        puedeEditar
      });
      
      return puedeEditar;
    } catch (error) {
      console.error('Error al validar período de edición:', error);
      const ahora = new Date();
      const inicio = new Date(fechaIni.split('T')[0]);
      const fin = new Date(fechaFin.split('T')[0]);
      
      const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      const inicioSoloFecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
      const finSoloFecha = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());
      
      return hoy >= inicioSoloFecha && hoy <= finSoloFecha;
    }
  };

  const verificarCodigo = async () => {
    if (!codigoPreInscripcion.trim()) return;

    setLoading(true);
    setError("");
    setResumen(null);
    setEstudiantes([]);
    setProcessedEstudiantes([]);

    try {
      const ordenPagoResponse = await axios.get(
        `${API_URL}/api/orden-pago-existe/${codigoPreInscripcion}`
      );
      if (ordenPagoResponse.data?.existe) {
        setError(
          "Ya se generó una orden de pago. Solo se puede editar la inscripción antes de generarla."
        );
        setLoading(false);
        return;
      }
    } catch (ordenError) {
      if (
        axios.isAxiosError(ordenError) &&
        ordenError.response?.status === 404
      ) {
        setError("No se encontraron inscripciones asociadas a este código.");
      } else {
        setError("Error al verificar si existe una orden de pago.");
      }
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/preinscritos-por-codigo`,
        {
          params: { codigo: codigoPreInscripcion },
        }
      );
      setResumen(response.data);
      const estudiantesLista = Array.isArray(response.data)
        ? response.data
        : response.data.estudiantes;
        
      if (estudiantesLista?.length > 0 && estudiantesLista[0].id_olimpiada) {
        const idOlimpiada = estudiantesLista[0].id_olimpiada;

        try {
          const olimpiadaResponse = await axios.get(
            `${API_URL}/olimpiada/${idOlimpiada}`
          );
          const olimpiada = olimpiadaResponse.data;
          
          console.log('Datos de olimpiada obtenidos:', olimpiada);
          
          // Usar las fechas tal como vienen del backend (YYYY-MM-DD)
          const fechaIni = olimpiada.fecha_ini;
          const fechaFin = olimpiada.fecha_fin;

          if (!estaEnPeriodo(fechaIni, fechaFin)) {
            setOlimpiadaSeleccionadaInfo({ 
              fechaIni: fechaIni, 
              fechaFin: fechaFin 
            });
            setShowPeriodoModal(true);
            setLoading(false);
            return;
          }

          try {
            const response = await axios.get(
              `${API_URL}/api/curso-area-categoria-por-olimpiada?id=${idOlimpiada}`
            );
            setCursoAreaCategoria(response.data);
          } catch (err2) {
            setError("No se pudieron cargar las áreas y categorías.");
          }
        } catch (olimpiadaError) {
          console.error('Error al obtener datos de olimpiada:', olimpiadaError);
          setError("No se pudo verificar el período de inscripción.");
          setLoading(false);
          return;
        }

        if (Array.isArray(estudiantesLista)) {
          setEstudiantes(estudiantesLista);
          processStudents(estudiantesLista);
        }
      }

      if (estudiantesLista?.length > 0 && estudiantesLista[0].id_olimpiada) {
        try {
          const response = await axios.get(
            `${API_URL}/api/curso-area-categoria-por-olimpiada?id=${estudiantesLista[0].id_olimpiada}`
          );
          setCursoAreaCategoria(response.data);
        } catch (err2) {
          setError("No se pudieron cargar las áreas y categorías.");
        }
      }
      if (estudiantesLista && Array.isArray(estudiantesLista)) {
        setEstudiantes(estudiantesLista);
        processStudents(estudiantesLista);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError(
          "No se encontraron Pre Inscripciones asociadas a este código."
        );
      } else {
        setError("Error al verificar el código. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const processStudents = (estudiantesData) => {
    const processed = estudiantesData.map((est, index) => {
      const errores = [];
      let hasError = false;
      let mensajeError = "";
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
      const areas =
        est.areas_competencia && Array.isArray(est.areas_competencia)
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
        error: hasError,
        mensajeError: mensajeError,
        todosErrores: errores,
        originalData: est,
      };
    });

    setProcessedEstudiantes(processed);
  };

  const filteredEstudiantes = processedEstudiantes.filter((estudiante) => {
    console.log(estudiante.nombres);
    const matchesSearch =
      estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidoPaterno
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      estudiante.apellidoMaterno
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filter === "errores") {
      return estudiante.error && matchesSearch;
    }

    return matchesSearch;
  });
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);

  const handleStudentClick = (estudiante) => {
    setSelectedStudent(estudiante);
    setModalContent({
      title: "Detalles del Estudiante",
      content: estudiante,
      type: "details",
    });
    setShowModal(true);
  };

  const nuevosErrores = (id, mensaje) => {
    const nuevos = processedEstudiantes.map(e =>
      e.id === id ? { ...e, error: true, mensajeError: mensaje } : e
    );
    setProcessedEstudiantes(nuevos);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleCloseModal2 = () => {
    setShowModal(false);
    setSelectedStudent(null);
    navigate("/");
  };

  const handleSaveEdit = (updatedData) => {
    const updatedEstudiantes = estudiantes.map((est, index) => {
      if (index === selectedStudent.id - 1) {
        return { ...est, ...updatedData };
      }
      return est;
    });
    setEstudiantes(updatedEstudiantes);
    processStudents(updatedEstudiantes);
    setShowModal(false);
    setSelectedStudent(null);
  };

  const guardarTodosLosCambios = async () => {
    if (!codigoPreInscripcion.trim()) {
      setError("No hay código de pre-inscripción válido.");
      return;
    }

    setSavingChanges(true);
    setError("");

    try {
      const datosParaEnviar = {
        estudiantes: estudiantes,
      };
      const response = await axios.post(
        `${API_URL}/api/editar-lista`,
        datosParaEnviar
      );

      if (response.data.success || response.status === 200) {
        setModalContent({
          title: "Éxito",
          content: "Los cambios se han guardado correctamente.",
          type: "success",
        });
        setShowModal(true);
      }
    } catch (err) {
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

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalErrors = processedEstudiantes.filter((e) => e.error).length;

  return {
    codigoPreInscripcion,
    setCodigoPreInscripcion,
    error,
    setError,
    resumen,
    setResumen,
    loading,
    setLoading,
    savingChanges,
    setSavingChanges,
    estudiantes,
    setEstudiantes,
    cursoAreaCategoria,
    setCursoAreaCategoria,
    processedEstudiantes,
    setProcessedEstudiantes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    showPeriodoModal,
    setShowPeriodoModal,
    olimpiadaSeleccionadaInfo,
    setOlimpiadaSeleccionadaInfo,
    showModal,
    setShowModal,
    modalContent,
    setModalContent,
    selectedStudent,
    setSelectedStudent,
    verificarCodigo,
    processStudents,
    filteredEstudiantes,
    totalPages,
    handleStudentClick,
    handleCloseModal,
    handleCloseModal2,
    handleSaveEdit,
    guardarTodosLosCambios,
    paginate,
    totalErrors,
    nuevosErrores
  };
};

export default useCodigoPreInscripcion;