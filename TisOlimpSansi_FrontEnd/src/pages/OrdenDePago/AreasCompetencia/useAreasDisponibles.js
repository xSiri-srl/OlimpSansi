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
      cargarAreasYCategorias();
    } else {
      setAreasDisponibles([]);
      setAreasObjetos([]);
      setAreasCategorias({});
      setCargaCompleta(false);
      setErrorCarga("");
    }
  }, [olimpiadaId]);

  const cargarAreasYCategorias = async () => {
    if (!olimpiadaId) return;
    
    setCargandoAreas(true);
    setErrorCarga("");
    setCargaCompleta(false);
    
    try {
      const response = await axios.get(`${API_URL}/areas-olimpiada/${olimpiadaId}`);
      
      if (response.status === 200 && response.data?.data) {
        const areasData = response.data.data;
        
        console.log("🎯 DATOS COMPLETOS DEL BACKEND:", JSON.stringify(areasData, null, 2));
        
        // Crear mapa de categorías por área
        const categoriasMap = {};
        
        areasData.forEach(areaItem => {
          const nombreArea = areaItem.area;
          
          console.log(`🔍 Procesando área: "${nombreArea}"`);
          console.log(`📊 Categorías del área:`, areaItem.categorias);
          
          if (areaItem.categorias && Array.isArray(areaItem.categorias)) {
            // Guardar las categorías tal como vienen del backend
            categoriasMap[nombreArea] = areaItem.categorias.map(cat => {
              console.log(`   📝 Categoría: ${cat.nombre}, Grados:`, cat.grados);
              return {
                id: cat.id,
                nombre: cat.nombre,
                grados: cat.grados || [],
                desde: cat.desde,
                hasta: cat.hasta
              };
            });
            
            // También guardar con nombre en mayúsculas para compatibilidad
            categoriasMap[nombreArea.toUpperCase()] = categoriasMap[nombreArea];
            
            console.log(`✅ Guardadas ${categoriasMap[nombreArea].length} categorías para "${nombreArea}"`);
          } else {
            console.log(`⚠️ Área "${nombreArea}" no tiene categorías o no es un array`);
            categoriasMap[nombreArea] = [];
            categoriasMap[nombreArea.toUpperCase()] = [];
          }
        });
        
        console.log("🗂️ MAPA FINAL DE CATEGORÍAS:", categoriasMap);
        
        // Guardar el mapa de categorías
        setAreasCategorias(categoriasMap);
        
        // Crear lista de áreas disponibles (solo las habilitadas)
        const areasNombres = areasData
          .filter(area => area.habilitado !== false)
          .map(area => area.area);
          
        const areasNormalizadas = areasNombres.map(area => ({
          id: null,
          original: area,
          normalizado: normalizarNombre(area),
          categorias: categoriasMap[area] || []
        })).filter(area => area.normalizado !== "");
        
        setAreasDisponibles(areasNormalizadas);
        
        // Para compatibilidad con el código existente
        const areasObjetos = areasNombres.map(area => ({
          area: area,
          categorias: categoriasMap[area] || []
        }));
        
        setAreasObjetos(areasObjetos);
        
        console.log("✅ Áreas disponibles cargadas:", areasNombres);
        console.log("🔍 Categorías por área final:", categoriasMap);
        
      } else {
        console.warn("⚠️ Respuesta no exitosa del servidor o sin datos");
        setAreasDisponibles([]);
        setAreasCategorias({});
      }
      
      setCargaCompleta(true);
      
    } catch (error) {
      console.error("❌ Error al cargar áreas y categorías:", error);
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
    if (!nombreArea || cargandoAreas || errorCarga || !olimpiadaId) {
      return false;
    }
    
    if (areasDisponibles.length === 0 && cargaCompleta) {
      return false;
    }
    
    const nombreNormalizado = normalizarNombre(nombreArea);
    
    // Buscar coincidencia exacta primero
    const coincidenciaExacta = areasDisponibles.some(area => 
      area.normalizado === nombreNormalizado
    );
    
    if (coincidenciaExacta) {
      console.log(`✅ Área "${nombreArea}" está disponible (coincidencia exacta)`);
      return true;
    }
    
    // Buscar en el mapeo de áreas
    const nombreMapeado = Object.entries(MAPEO_AREAS_EXACTO).find(([key, valores]) => 
      valores.includes(nombreNormalizado)
    );
    
    if (nombreMapeado) {
      const [nombreClave, alternativas] = nombreMapeado;
      
      const coincideConMapeado = areasDisponibles.some(area => {
        return alternativas.includes(area.normalizado);
      });
      
      if (coincideConMapeado) {
        console.log(`✅ Área "${nombreArea}" está disponible (mapeo: ${nombreClave})`);
        return true;
      }
    }
    
    // Caso especial para Astronomía y Astrofísica
    if (nombreNormalizado === "ASTRONOMIAYASTROFISICA") {
      const tieneAstronomia = areasDisponibles.some(area => 
        area.normalizado === "ASTRONOMIAYASTROFISICA" ||
        area.normalizado === "ASTRONOMIAASTROFISICA"
      );
      
      if (tieneAstronomia) {
        console.log(`✅ Área "Astronomía y Astrofísica" está disponible`);
        return true;
      }
    }
    
    console.log(`❌ Área "${nombreArea}" NO está disponible`);
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