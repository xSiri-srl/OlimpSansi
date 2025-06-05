
export function useCategoriasHandler(cursoEstudiante, areasCategorias = {}) {

const obtenerCategoriaAutomatica = (area) => {
    if (!area) return null;

    const categoriasDelArea = areasCategorias[area] || [];

    if (categoriasDelArea.length === 1) {
      return categoriasDelArea[0];
    }

    if (categoriasDelArea.length > 1) {
      return categoriasDelArea[0]; // devolver la primera como predeterminada
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