import { useState, useEffect, useRef } from "react";
import api, { API_URL } from "../../../../utils/api";
import axios from "axios";

export default function useColegioData(formData, handleInputChange) {
  // Estados para manejar datos de colegios
  const [colegiosData, setColegiosData] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);
  const [colegiosFiltrados, setColegiosFiltrados] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  // Inicializar con el valor existente del colegio si está disponible
  const [busquedaColegio, setBusquedaColegio] = useState(formData.estudiante?.colegio || "");
  const [esNuevoColegio, setEsNuevoColegio] = useState(false);

  const sugerenciasRef = useRef(null);

  // Cargar datos de colegios al iniciar
  useEffect(() => {
    await
      axios.post(`${API_URL}/colegios/filtro`, {})
      .then((res) => {
        setColegiosData(res.data);
        const departamentosUnicos = [
          ...new Set(res.data.map((c) => c.departamento)),
        ];
        setDepartamentosList(departamentosUnicos);
      })
      .catch((err) => console.error("Error al cargar colegios", err));
  }, []);

  // Sincronizar busquedaColegio con formData cuando cambia
  useEffect(() => {
    if (formData.estudiante?.colegio && formData.estudiante.colegio !== busquedaColegio) {
      setBusquedaColegio(formData.estudiante.colegio);
    }
  }, [formData.estudiante?.colegio]);

  // Filtrar distritos cuando cambia el departamento
  useEffect(() => {
    const distritos = colegiosData
      .filter(
        (c) => c.departamento === formData.estudiante?.departamentoSeleccionado
      )
      .map((c) => c.distrito);

    setDistritosList([...new Set(distritos)]);
  }, [formData.estudiante?.departamentoSeleccionado, colegiosData]);

  // Filtrar colegios cuando cambia el distrito
  useEffect(() => {
    const colegios = colegiosData
      .filter(
        (c) =>
          c.departamento === formData.estudiante?.departamentoSeleccionado &&
          c.distrito === formData.estudiante?.distrito
      )
      .map((c) => c.nombre_colegio);

    setColegiosFiltrados([...new Set(colegios)]);
  }, [
    formData.estudiante?.distrito,
    formData.estudiante?.departamentoSeleccionado,
    colegiosData,
  ]);

  // Actualizar sugerencias cuando cambia el texto de búsqueda
  const actualizarSugerencias = (texto) => {
    setBusquedaColegio(texto);

    if (!texto || texto.length < 2) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const filtrados = colegiosFiltrados.filter((colegio) =>
      colegio.toLowerCase().includes(texto.toLowerCase())
    );

    setSugerencias(filtrados);
    setMostrarSugerencias(true);
    setEsNuevoColegio(filtrados.length === 0);

    // Si hay una coincidencia exacta o no hay coincidencias, actualizar el valor del colegio
    if (
      filtrados.length === 1 &&
      filtrados[0].toLowerCase() === texto.toLowerCase()
    ) {
      handleInputChange("estudiante", "colegio", filtrados[0]);
    } else if (filtrados.length === 0) {
      handleInputChange("estudiante", "colegio", texto);
    }
  };

  // Seleccionar una sugerencia
  const seleccionarSugerencia = (sugerencia) => {
    setBusquedaColegio(sugerencia);
    handleInputChange("estudiante", "colegio", sugerencia);
    setMostrarSugerencias(false);
    setEsNuevoColegio(false);
  };

  // Limpiar búsqueda de colegio
  const limpiarBusquedaColegio = () => {
    setBusquedaColegio("");
    handleInputChange("estudiante", "colegio", "");
    setMostrarSugerencias(false);
  };

  return {
    departamentosList,
    distritosList,
    sugerencias,
    mostrarSugerencias,
    setMostrarSugerencias,
    busquedaColegio,
    esNuevoColegio,
    sugerenciasRef,
    actualizarSugerencias,
    seleccionarSugerencia,
    limpiarBusquedaColegio
  };
}