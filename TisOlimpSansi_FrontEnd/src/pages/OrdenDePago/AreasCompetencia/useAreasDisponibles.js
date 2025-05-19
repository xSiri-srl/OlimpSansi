import { useState, useEffect } from "react";
import axios from "axios";

export function useAreasDisponibles(olimpiadaId) {
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [cargaCompleta, setCargaCompleta] = useState(false);

  useEffect(() => {
    if (olimpiadaId) {
      cargarAreasAsociadas();
    }
  }, [olimpiadaId]);

  const cargarAreasAsociadas = async () => {
    setCargandoAreas(true);
    setErrorCarga("");
    setCargaCompleta(false);
    
    try {
      const response = await axios.get(`http://localhost:8000/areas-olimpiada/${olimpiadaId}`);
      
      if (response.status === 200 && response.data.data) {
        const areasHabilitadas = response.data.data.map(area => {
          let nombreNormalizado = area.area
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");
            
          return nombreNormalizado;
        });
        
        setAreasDisponibles(areasHabilitadas);
      }
      setCargaCompleta(true);
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setErrorCarga("No se pudieron cargar las áreas de competencia");
      setCargaCompleta(true);
    } finally {
      setCargandoAreas(false);
    }
  };

  const areaEstaDisponible = (nombreArea) => {
    // Si aún no se ha completado la carga, ningún área está disponible
    if (!cargaCompleta) return false;
    
    // Si hay un error de carga o no hay olimpiada seleccionada, ninguna área disponible
    if (errorCarga || !olimpiadaId) return false;
    
    // Si la lista está vacía después de cargar, significa que no hay áreas asociadas
    if (areasDisponibles.length === 0 && cargaCompleta) return false;
    
    if (nombreArea === "Astronomía y Astrofísica") {
      return areasDisponibles.some(area => {
        return area === "ASTRONOMIAYASTROFISICA" || 
               area === "ASTRONOMIAASTROFISICA" || 
               area === "ASTRONOMIAAASTROFISICA";
      });
    }
    
    const nombreNormalizado = nombreArea
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
      
    return areasDisponibles.some(area => area === nombreNormalizado);
  };

  return { areasDisponibles, cargandoAreas, errorCarga, areaEstaDisponible, cargaCompleta };
}