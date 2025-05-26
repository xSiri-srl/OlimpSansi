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
    } else {
      // Resetear estados cuando no hay olimpiada seleccionada
      setAreasDisponibles([]);
      setCargaCompleta(false);
      setErrorCarga("");
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
  console.log("Verificando disponibilidad para:", nombreArea);
  if (!cargandoAreas && !cargaCompleta) {
    console.log("Carga no completa, área no disponible");
    return false;
  }

  if (errorCarga || !olimpiadaId) {
    console.log("Error o sin olimpiada, área no disponible");
    return false;
  }
  
  // Si la lista está vacía después de cargar, todas las áreas están disponibles
  // porque significa que no hay restricciones específicas por olimpiada
  if (areasDisponibles.length === 0 && cargaCompleta) {
    console.log("No hay áreas específicas, todas disponibles");
    return true;
  }
  
  // CASO ESPECIAL: Para Astronomía y Astrofísica
  if (nombreArea === "Astronomía y Astrofísica") {
 
    const esDisponible = areasDisponibles.some(area => 
      area.includes("ASTRONOM") || area.includes("ASTROF")
    );
    console.log("Área especial Astronomía disponible:", esDisponible);
    return esDisponible;
  }
  
  // Normalizar el nombre del área para comparar con los valores almacenados
  let nombreNormalizado = nombreArea
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ""); 
  
  console.log("Nombre normalizado:", nombreNormalizado);
  console.log("Áreas disponibles normalizadas:", areasDisponibles);

  const disponible = areasDisponibles.some(
    areaDisponible => areaDisponible.includes(nombreNormalizado) || nombreNormalizado.includes(areaDisponible)
  );
  
  console.log("Área", nombreArea, "disponible:", disponible);
  return disponible;
};

  return { areasDisponibles, cargandoAreas, errorCarga, areaEstaDisponible, cargaCompleta };
}