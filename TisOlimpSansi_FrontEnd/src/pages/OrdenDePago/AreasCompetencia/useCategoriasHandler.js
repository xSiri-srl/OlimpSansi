import { categoriasMap } from './areasConfig';

export function useCategoriasHandler(cursoEstudiante, areasCategorias = {}) {
  // Extraer el grado numérico del curso
  const obtenerNumeroGrado = () => {
    const match = cursoEstudiante.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const esSecundaria = cursoEstudiante.includes("Secundaria");
  const gradoNumero = obtenerNumeroGrado();

  const obtenerCategoriaAutomatica = (area) => {
    // Verificar primero si hay categorías disponibles del backend
    const nombreAreaNormalizado = area.toUpperCase();
    
    if (areasCategorias[area] || areasCategorias[nombreAreaNormalizado]) {
      const categorias = areasCategorias[area] || areasCategorias[nombreAreaNormalizado] || [];
      
      // Si solo hay una categoría, la devolvemos automáticamente
      if (categorias.length === 1) {
        return categorias[0].nombre;
      }
      
      // Si hay múltiples, intentamos encontrar una que coincida con el grado
      const categoriaCompatible = categorias.find(cat => {
        // Aquí iría lógica para determinar si la categoría es compatible con el grado
        // Por ejemplo, si la categoría menciona el grado específico o un rango que lo incluya
        return true; // Por defecto permitimos todas las categorías
      });
      
      return categoriaCompatible ? categoriaCompatible.nombre : null;
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
    // Verificar primero si tenemos categorías del backend
    if (areasCategorias[area] || areasCategorias[area.toUpperCase()]) {
      const categorias = areasCategorias[area] || areasCategorias[area.toUpperCase()] || [];
      
      // Filtrar categorías relevantes para el grado actual
      const categoriasFiltradas = categorias.filter(cat => {
        // Aquí implementaríamos la lógica para filtrar categorías por grado
        // Por ahora retornamos todas
        return true;
      });
      
      return categoriasFiltradas.map(cat => cat.nombre);
    }
    
    // Implementación anterior como fallback
    if (area !== "Informática" && area !== "Robótica") {
      return null;
    }

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

    // Lógica fallback
    const esPrimaria = cursoEstudiante.includes("Primaria");
    const esSecundaria = cursoEstudiante.includes("Secundaria");
    const numero = Number.parseInt(cursoEstudiante.match(/\d+/)?.[0] || "0");

    // Para Informática
    if (area === "Informática") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return ['"Guacamayo" 5to a 6to Primaria'];
      } else if (esSecundaria && numero >= 1 && numero <= 3) {
        return [
          '"Guanaco" 1ro a 3ro Secundaria',
          '"Londra" 1ro a 3ro Secundaria',
          '"Bufeo" 1ro a 3ro Secundaria',
        ];
      } else if (esSecundaria && numero >= 4 && numero <= 6) {
        return [
          '"Jucumari" 4to a 6to Secundaria',
          '"Puma" 4to a 6to Secundaria',
        ];
      }
    }

    // Para Robótica
    if (area === "Robótica") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
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

    return ["Categoría no disponible para este curso"];
  };

  return { obtenerCategoriaAutomatica, obtenerCategorias };
}