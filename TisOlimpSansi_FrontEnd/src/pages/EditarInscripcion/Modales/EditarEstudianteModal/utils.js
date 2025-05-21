import { areas, cursos, departamentos } from './constants';

export const obtenerCategorias = (area, curso) => {
  if (area !== "Informática" && area !== "Robótica") {
    return [];
  }
  
  const esPrimaria = curso?.includes("Primaria");
  const esSecundaria = curso?.includes("Secundaria");
  const numero = parseInt(curso?.match(/\d+/)?.[0] || "0");
  
  // Para Informática
  if (area === "Informática") {
    if (esPrimaria && (numero === 5 || numero === 6)) {
      return ["\"Guacamayo\" 5to a 6to Primaria"];
    } else if (esSecundaria && numero >= 1 && numero <= 3) {
      return [
        "\"Guanaco\" 1ro a 3ro Secundaria", 
        "\"Londra\" 1ro a 3ro Secundaria",
        "\"Bufeo\" 1ro a 3ro Secundaria"
      ];
    } else if (esSecundaria && numero >= 4 && numero <= 6) {
      return [
        "\"Jucumari\" 4to a 6to Secundaria",
        "\"Puma\" 4to a 6to Secundaria"
      ];
    }
  }
  
  // Para Robótica
  if (area === "Robótica") {
    if (esPrimaria && (numero === 5 || numero === 6)) {
      return [
        "\"Builders P\" 5to a 6to Primaria",
        "\"Lego P\" 5to a 6to Primaria"
      ];
    } else if (esSecundaria) {
      return [
        "\"Builders S\" 1ro a 6to Secundaria",
        "\"Lego S\" 1ro a 6to Secundaria"
      ];
    }
  }
  
  return ["Categoría no disponible para este curso"];
};

export const normalizeForComparison = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Eliminar acentos
};

export const normalizarDatosEstudiante = (originalData) => {
  // Crear una copia profunda de los datos originales
  const normalizedData = JSON.parse(JSON.stringify(originalData));
  
  // Normalizar áreas de competencia para que coincidan con las opciones del desplegable
  if (normalizedData.areas_competencia) {
    normalizedData.areas_competencia = normalizedData.areas_competencia.map(area => {
      if (area.nombre_area) {
        // Buscar coincidencia en el array de áreas utilizando normalización
        const matchedArea = areas.find(a => 
          normalizeForComparison(a) === normalizeForComparison(area.nombre_area)
        );
        if (matchedArea) {
          area.nombre_area = matchedArea;
        }
      }
      return area;
    });
  }
  
  // Normalizar formato del curso
  if (normalizedData.colegio?.curso) {
    const cursoOriginal = normalizedData.colegio.curso;
    // Buscar una coincidencia aproximada en el array de cursos
    const cursoNormalizado = cursos.find(c => {
      const simplifiedCurso = normalizeForComparison(cursoOriginal).replace(/\s+de\s+/i, " ");
      const simplifiedOption = normalizeForComparison(c).replace(/\s+de\s+/i, " ");
      return simplifiedCurso.includes(simplifiedOption) || simplifiedOption.includes(simplifiedCurso);
    });
    
    if (cursoNormalizado) {
      normalizedData.colegio.curso = cursoNormalizado;
    }
  }
  
  // Normalizar departamento y provincia
  if (normalizedData.colegio?.departamento) {
    const deptoOriginal = normalizedData.colegio.departamento;
    const deptoNormalizado = Object.keys(departamentos).find(d => 
      normalizeForComparison(d) === normalizeForComparison(deptoOriginal)
    );
    
    if (deptoNormalizado) {
      normalizedData.colegio.departamento = deptoNormalizado;
      
      // También normalizar la provincia si se encontró el departamento
      if (normalizedData.colegio?.provincia) {
        const provinciaOriginal = normalizedData.colegio.provincia;
        const provinciaNormalizada = departamentos[deptoNormalizado].find(p => 
          normalizeForComparison(p) === normalizeForComparison(provinciaOriginal)
        );
        
        if (provinciaNormalizada) {
          normalizedData.colegio.provincia = provinciaNormalizada;
        }
      }
    }
  }
  
  // También normalizar nombres de áreas en tutores académicos
  if (normalizedData.tutores_academicos) {
    normalizedData.tutores_academicos = normalizedData.tutores_academicos.map(tutor => {
      if (tutor.nombre_area) {
        const matchedArea = areas.find(a => 
          normalizeForComparison(a) === normalizeForComparison(tutor.nombre_area)
        );
        if (matchedArea) {
          tutor.nombre_area = matchedArea;
        }
      }
      return tutor;
    });
  }
  
  return normalizedData;
};