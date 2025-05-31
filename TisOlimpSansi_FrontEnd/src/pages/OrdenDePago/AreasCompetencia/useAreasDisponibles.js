import { useState, useEffect } from "react";
import { API_URL } from "../../../utils/api";
import axios from "axios";

export function useAreasDisponibles(olimpiadaId) {
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [areasObjetos, setAreasObjetos] = useState([]);
  const [cargandoAreas, setCargandoAreas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [cargaCompleta, setCargaCompleta] = useState(false);
  const [areasCategorias, setAreasCategorias] = useState({});

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
      setAreasCategorias({});
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
      const response = await axios.get(`${API_URL}/api/areas-olimpiada/${olimpiadaId}`);
      
      if (response.status === 200) {
        if (response.data.data && Array.isArray(response.data.data)) {
          const areas = response.data.data;
          setAreasObjetos(areas);

          // Construir mapa de áreas/categorías para fácil acceso
          const categoriasMap = {};
          areas.forEach(area => {
            categoriasMap[area.area] = area.categorias || [];
          });
          
          // Guardar primero el mapa y luego imprimir con el mapa obtenido
          setAreasCategorias(categoriasMap);
          
          // Usar el mapa recién creado directamente en lugar de depender del state
          console.log("ÁREAS CATEGORÍAS DISPONIBLES:", categoriasMap);
          for (const area in categoriasMap) {
            console.log(`Área: ${area}`);
            if (categoriasMap[area] && Array.isArray(categoriasMap[area])) {
              console.log(`Categorías: `, categoriasMap[area].map(c => c.nombre).join(", "));
            }
          }
          
          const areasNormalizadas = areas.map(area => ({
            id: area.id,
            original: area.area,
            normalizado: normalizarNombre(area.area),
            categorias: area.categorias || []
          })).filter(area => area.normalizado !== "");
          
          setAreasDisponibles(areasNormalizadas);
        } else {
          setAreasDisponibles([]);
          setAreasCategorias({});
        }
      }
      
      setCargaCompleta(true);
      
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setErrorCarga("No se pudieron cargar las áreas de competencia");
      setAreasDisponibles([]);
      setAreasCategorias({});
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
    areasCategorias, 
    cargandoAreas, 
    errorCarga, 
    areaEstaDisponible, 
    cargaCompleta 
  };
}