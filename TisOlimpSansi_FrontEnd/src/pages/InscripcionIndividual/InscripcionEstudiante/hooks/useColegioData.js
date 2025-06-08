import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../../utils/api";
import axios from "axios";

export default function useColegioData(formData, handleInputChange) {
  const [colegiosData, setColegiosData] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);
  const [colegiosFiltrados, setColegiosFiltrados] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [busquedaColegio, setBusquedaColegio] = useState(formData.estudiante?.colegio || "");
  const [esNuevoColegio, setEsNuevoColegio] = useState(false);

  const sugerenciasRef = useRef(null);

  useEffect(() => {
    axios
      .post(`${API_URL}/api/colegios/filtro`, {})
      .then((res) => {
        setColegiosData(res.data);
        const departamentosUnicos = [
          ...new Set(res.data.map((c) => c.departamento)),
        ];
        setDepartamentosList(departamentosUnicos);
      })
      .catch((err) => console.error("Error al cargar colegios", err));
  }, []);

  useEffect(() => {
    if (formData.estudiante?.colegio && formData.estudiante.colegio !== busquedaColegio) {
      setBusquedaColegio(formData.estudiante.colegio);
    }
  }, [formData.estudiante?.colegio]);

  useEffect(() => {
    const distritos = colegiosData
      .filter(
        (c) => c.departamento === formData.estudiante?.departamentoSeleccionado
      )
      .map((c) => c.distrito);

    setDistritosList([...new Set(distritos)]);
  }, [formData.estudiante?.departamentoSeleccionado, colegiosData]);

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

    if (
      filtrados.length === 1 &&
      filtrados[0].toLowerCase() === texto.toLowerCase()
    ) {
      handleInputChange("estudiante", "colegio", filtrados[0]);
    } else if (filtrados.length === 0) {
      handleInputChange("estudiante", "colegio", texto);
    }
  };

  const seleccionarSugerencia = (sugerencia) => {
    setBusquedaColegio(sugerencia);
    handleInputChange("estudiante", "colegio", sugerencia);
    setMostrarSugerencias(false);
    setEsNuevoColegio(false);
  };

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