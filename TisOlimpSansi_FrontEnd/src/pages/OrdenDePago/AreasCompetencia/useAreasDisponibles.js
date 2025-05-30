import { useState, useEffect } from "react";
import axios from "axios";

export function useAreasDisponibles(olimpiadaId) {
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [areasObjetos, setAreasObjetos] = useState([]);
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [cargaCompleta, setCargaCompleta] = useState(false);
  

  const normalizarNombre = (nombre) => {
    if (!nombre) return '';
    return nombre
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[-\s]/g, "") 
      .trim();
  };

  useEffect(() => {
    if (olimpiadaId) {
      cargarAreasAsociadas();
    } else {
      setAreasDisponibles([]);
      setAreasObjetos([]);
      setCargaCompleta(false);
      setErrorCarga("");
    }
  }, [olimpiadaId]);

  const cargarAreasAsociadas = async () => {
    if (!olimpiadaId) return;
    
    setCargandoAreas(true);
    setErrorCarga("");
    setCargaCompleta(false);
    
    try {
      const response = await axios.get(`http://localhost:8000/areas-olimpiada/${olimpiadaId}`);
      
      if (response.status === 200) {
        if (response.data.data && Array.isArray(response.data.data)) {

          setAreasObjetos(response.data.data);

          const areasNormalizadas = response.data.data.map(area => ({
            id: area.id,
            original: area.area,
            normalizado: normalizarNombre(area.area)
          })).filter(area => area.normalizado !== "");
          
          setAreasDisponibles(areasNormalizadas);
        } else {
          setAreasDisponibles([]);
        }
      }
      
      setCargaCompleta(true);
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setErrorCarga("No se pudieron cargar las áreas de competencia");
      setAreasDisponibles([]);
      setCargaCompleta(true);
    } finally {
      setCargandoAreas(false);
    }
  };

  const MAPEO_AREAS_EXACTO = {
    "MATEMATICAS": ["MATEMATICAS", "MATEMATICA"],
    "FISICA": ["FISICA"],
    "QUIMICA": ["QUIMICA"],
    "BIOLOGIA": ["BIOLOGIA"],
    "INFORMATICA": ["INFORMATICA", "COMPUTACION"],
    "ROBOTICA": ["ROBOTICA"],
    "ASTRONOMIAYASTROFISICA": ["ASTRONOMIAYASTROFISICA", "ASTRONOMIAASTROFISICA", "ASTRONOMIAA"]
  };

  const areaEstaDisponible = (nombreArea) => {
    if (!nombreArea || cargandoAreas || errorCarga || !olimpiadaId || !areasDisponibles) {
      return false;
    }
    if (areasDisponibles.length === 0 && cargaCompleta) {
      return true;
    }
    const nombreNormalizado = normalizarNombre(nombreArea);
    
    // buscar coincidencia exacta primero
    const coincidenciaExacta = areasDisponibles.some(area => 
      area.normalizado === nombreNormalizado
    );
    
    if (coincidenciaExacta) {
      return true;
    }
    const nombreMapeado = Object.entries(MAPEO_AREAS_EXACTO).find(([key, valores]) => 
      valores.includes(nombreNormalizado)
    );
    
    if (nombreMapeado) {
      const [nombreClave, alternativas] = nombreMapeado;
      
      const coincideConMapeado = areasDisponibles.some(area => {

        return alternativas.includes(area.normalizado);
      });
      
      if (coincideConMapeado) {
        return true;
      }
    }
    if (nombreNormalizado === "ASTRONOMIAYASTROFISICA") {
      const tieneAstronomia = areasDisponibles.some(area => 
        area.normalizado === "ASTRONOMIAYASTROFISICA" ||
        area.normalizado === "ASTRONOMIAASTROFISICA"
      );
      
      if (tieneAstronomia) {
        return true;
      }
    }
    
    return false;
  };

  return { 
    areasDisponibles, 
    areasObjetos, 
    cargandoAreas, 
    errorCarga, 
    areaEstaDisponible, 
    cargaCompleta 
  };
}