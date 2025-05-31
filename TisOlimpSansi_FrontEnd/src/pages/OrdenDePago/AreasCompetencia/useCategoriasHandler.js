import { categoriasMap } from './areasConfig';

export function useCategoriasHandler(cursoEstudiante, areasCategorias = {}) {
  // Extraer información del grado del estudiante
  const obtenerInfoGrado = () => {
    const esPrimaria = cursoEstudiante.includes("Primaria");
    const esSecundaria = cursoEstudiante.includes("Secundaria");
    const match = cursoEstudiante.match(/\d+/);
    const numeroGrado = match ? parseInt(match[0], 10) : 0;
    
    // Crear una abreviación del tipo "1P" o "3S" para fácil comparación
    let abreviacion = "";
    if (numeroGrado > 0) {
      abreviacion = `${numeroGrado}${esPrimaria ? "P" : esSecundaria ? "S" : ""}`;
    }
    
    return { esPrimaria, esSecundaria, numeroGrado, abreviacion };
  };
  
  const { esPrimaria, esSecundaria, numeroGrado, abreviacion } = obtenerInfoGrado();
  
  // Función para verificar si una categoría es compatible con el grado del estudiante
  const esCategoriaCompatible = (nombreCategoria) => {
    if (!nombreCategoria) return false;
    
    // Convertir a mayúsculas para comparación consistente
    const categoria = nombreCategoria.toUpperCase();
    
    console.log(`Verificando compatibilidad de categoría: "${categoria}" con grado: ${abreviacion} (${cursoEstudiante})`);
    
    // CASO ESPECIAL: BUILDERS S o LEGO S - para todos los grados de secundaria
    if (esSecundaria && (categoria.includes("BUILDERS S") || categoria.includes("LEGO S"))) {
      console.log(`✅ Categoría "${categoria}" es compatible con secundaria`);
      return true;
    }
    
    // CASO ESPECIAL: BUILDERS P o LEGO P - para 5to y 6to primaria
    if (esPrimaria && (numeroGrado === 5 || numeroGrado === 6) && 
        (categoria.includes("BUILDERS P") || categoria.includes("LEGO P"))) {
      console.log(`✅ Categoría "${categoria}" es compatible con 5to-6to primaria`);
      return true;
    }
    
    // Caso 1: Coincidencia directa con la abreviación del grado
    if (categoria.includes(abreviacion)) {
      console.log(`✅ Categoría "${categoria}" incluye grado ${abreviacion}`);
      return true;
    }
    
    // Caso 2: Categoría general para primaria/secundaria
    if ((esPrimaria && (categoria.includes(" P") || categoria.endsWith("P"))) || 
        (esSecundaria && (categoria.includes(" S") || categoria.endsWith("S")))) {
      console.log(`✅ Categoría "${categoria}" es compatible con ${esPrimaria ? "primaria" : "secundaria"}`);
      return true;
    }
    
    // Caso 3: Categoría con rango numérico (1RO A 3RO)
    const rangoRegex = /(\d+)(?:RO|DO|TO)?\s*A\s*(\d+)(?:RO|DO|TO)?/i;
    const rangoMatch = categoria.match(rangoRegex);
    
    if (rangoMatch) {
      const min = parseInt(rangoMatch[1], 10);
      const max = parseInt(rangoMatch[2], 10);
      
      // Verificar si el grado actual está dentro del rango
      if (numeroGrado >= min && numeroGrado <= max) {
        console.log(`✅ Categoría "${categoria}" incluye rango ${min}-${max} compatible con grado ${numeroGrado}`);
        return true;
      }
    }
    
    // Casos específicos adicionales para categorías comunes
    if (categoria === "GUACAMAYO" && esPrimaria && (numeroGrado === 5 || numeroGrado === 6)) {
      console.log(`✅ Categoría "${categoria}" es compatible con 5to-6to primaria`);
      return true;
    }
    
    if ((categoria === "GUANACO" || categoria === "LONDRA" || categoria === "BUFEO") && 
        esSecundaria && numeroGrado >= 1 && numeroGrado <= 3) {
      console.log(`✅ Categoría "${categoria}" es compatible con 1ro-3ro secundaria`);
      return true;
    }
    
    if ((categoria === "JUCUMARI" || categoria === "PUMA") && 
        esSecundaria && numeroGrado >= 4 && numeroGrado <= 6) {
      console.log(`✅ Categoría "${categoria}" es compatible con 4to-6to secundaria`);
      return true;
    }
    
    console.log(`❌ Categoría "${categoria}" no es compatible con grado ${abreviacion}`);
    return false;
  };

  const obtenerCategoriaAutomatica = (area) => {
    // Verificar primero si hay categorías disponibles del backend
    if (!area) return null;
    
    // Normalizar nombres para búsqueda
    const nombreAreaNormalizado = area.toUpperCase();
    
    if (areasCategorias[area] || areasCategorias[nombreAreaNormalizado]) {
      const categorias = areasCategorias[area] || areasCategorias[nombreAreaNormalizado] || [];
      
      // Si solo hay una categoría, la devolvemos automáticamente
      if (categorias.length === 1) {
        return categorias[0].nombre;
      }
      
      // Filtrar categorías compatibles con el grado
      const categoriasCompatibles = categorias.filter(cat => 
        esCategoriaCompatible(cat.nombre)
      );
      
      // Si hay exactamente una categoría compatible, la devolvemos automáticamente
      if (categoriasCompatibles.length === 1) {
        return categoriasCompatibles[0].nombre;
      }
    }
    
    // Fallback al sistema anterior si no hay categorías del backend
    let areaNormalizada = area.toUpperCase();
    if (areaNormalizada === "ASTRONOMÍA Y ASTROFÍSICA") {
      areaNormalizada = "ASTRONOMÍA - ASTROFÍSICA";
    }

    if (
      categoriasMap[areaNormalizada] &&
      categoriasMap[areaNormalizada][cursoEstudiante]
    ) {
      return categoriasMap[areaNormalizada][cursoEstudiante];
    }

    return null;
  };

  const obtenerCategorias = (area) => {
    if (!area) {
      console.log("obtenerCategorias: Se recibió un área vacía");
      return ["Categoría no disponible"];
    }
    
    console.log(`Obteniendo categorías para área: "${area}"`);
    
    // Verificar primero si tenemos categorías del backend
    if (areasCategorias[area] || areasCategorias[area.toUpperCase()]) {
      const categorias = areasCategorias[area] || areasCategorias[area.toUpperCase()] || [];
      
      console.log(`${categorias.length} categorías disponibles para ${area}:`, 
        categorias.map(c => c.nombre).join(', '));
      
      // Filtrar categorías compatibles con el grado del estudiante
      const categoriasCompatibles = categorias
        .filter(cat => esCategoriaCompatible(cat.nombre))
        .map(cat => cat.nombre);
      
      // Si hay categorías compatibles, las devolvemos
      if (categoriasCompatibles.length > 0) {
        console.log(`${categoriasCompatibles.length} categorías compatibles:`, categoriasCompatibles);
        return categoriasCompatibles;
      }
      
      // Si no hay categorías compatibles pero hay categorías disponibles,
      // mostramos todas (podría ser un problema de detección)
      if (categorias.length > 0) {
        console.warn(`No se encontraron categorías compatibles para ${area} y grado ${cursoEstudiante}. Mostrando todas las disponibles.`);
        return categorias.map(cat => cat.nombre);
      }
    } else {
      console.log(`No se encontraron categorías para área "${area}" en areasCategorias`);
    }
    
    // Implementación anterior como fallback
    if (area === "Informática" || area === "Robótica") {
      const areaNormalizada = area === "Informática" ? "Informática" : "ROBÓTICA";

      if (
        categoriasMap[areaNormalizada] &&
        categoriasMap[areaNormalizada][cursoEstudiante]
      ) {
        const categorias = categoriasMap[areaNormalizada][cursoEstudiante];

        if (Array.isArray(categorias)) {
          return categorias.map((cat) => `"${cat}" ${cursoEstudiante}`);
        } else {
          return [`"${categorias}" ${cursoEstudiante}`];
        }
      }

      // Lógica fallback específica para Informática y Robótica
      if (area === "Informática") {
        if (esPrimaria && (numeroGrado === 5 || numeroGrado === 6)) {
          return ['"Guacamayo" 5to a 6to Primaria'];
        } else if (esSecundaria && numeroGrado >= 1 && numeroGrado <= 3) {
          return [
            '"Guanaco" 1ro a 3ro Secundaria',
            '"Londra" 1ro a 3ro Secundaria',
            '"Bufeo" 1ro a 3ro Secundaria',
          ];
        } else if (esSecundaria && numeroGrado >= 4 && numeroGrado <= 6) {
          return [
            '"Jucumari" 4to a 6to Secundaria',
            '"Puma" 4to a 6to Secundaria',
          ];
        }
      }

      if (area === "Robótica") {
        if (esPrimaria && (numeroGrado === 5 || numeroGrado === 6)) {
          return [
            '"Builders P" 5to a 6to Primaria',
            '"Lego P" 5to a 6to Primaria',
          ];
        } else if (esSecundaria) {
          return [
            '"Builders S" 1ro a 6to Secundaria',
            '"Lego S" 1ro a 6to Secundaria',
          ];
        }
      }
    }

    return ["Categoría no disponible para este curso"];
  };

  return { obtenerCategoriaAutomatica, obtenerCategorias };
}