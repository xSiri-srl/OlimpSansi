import { categoriasMap } from './areasConfig';

export function useCategoriasHandler(cursoEstudiante) {
  const obtenerCategoriaAutomatica = (area) => {
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