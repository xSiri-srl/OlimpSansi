import { useState, useEffect } from "react";

export function useAreasDisponibles(globalData) {
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [cargaCompleta, setCargaCompleta] = useState(false);
  const [areasCategorias, setAreasCategorias] = useState({});

  useEffect(() => {
    if (globalData.gradoAreaCurso) {
      cargarAreasYCategorias();
    } else {
      setAreasCategorias({});
      setCargaCompleta(false);
      setErrorCarga("");
    }
  }, [globalData.gradoAreaCursoId]);

  const cargarAreasYCategorias = () => {
    const curso = globalData.colegio?.curso;
    const gradoData = globalData.gradoAreaCurso?.[curso];
    const areasCat = gradoData?.areas || {};

    setAreasCategorias(areasCat);
  };

  const areaEstaDisponible = (nombreArea) => {
    const curso = globalData.colegio?.curso;
    const gradoData = globalData.gradoAreaCurso?.[curso];
    const areas = gradoData?.areas || {};
    return Object.keys(areas).includes(nombreArea);
  };
  

  return { 
    areasCategorias, 
    cargandoAreas, 
    errorCarga, 
    areaEstaDisponible, 
    cargaCompleta 
  };
}