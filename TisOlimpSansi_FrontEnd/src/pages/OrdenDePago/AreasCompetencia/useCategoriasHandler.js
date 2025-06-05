
export function useCategoriasHandler(cursoEstudiante, areasCategorias = {}) {

  const obtenerCategoriaAutomatica = (area) => {
    if (!area) return null;

    const categoriasDelArea = areasCategorias[area] || [];

    if (categoriasDelArea.length === 1) {
      return categoriasDelArea[0];
    }

    if (categoriasDelArea.length > 1) {
      return ["Seleccione una categoria"];
    }

    if (categoriasDelArea.length == 0) {
      return [`No hay categorías disponibles para el área ${area} y curso ${cursoEstudiante}`];
    }

    console.warn(`⚠️ No hay categorías disponibles para el área ${area} y curso ${cursoEstudiante}`);
    return null;
  };

  const obtenerCategorias = (area) => {
    if (!area) {
      return ["Sin categorías disponibles"];
    }
    
    const categoriasDelArea = areasCategorias[area] || [];
    if (categoriasDelArea.length !== 0) {
      return categoriasDelArea;
    }
    
    return ["Sin categorías disponibles"];
  };

  return { obtenerCategoriaAutomatica, obtenerCategorias };
}