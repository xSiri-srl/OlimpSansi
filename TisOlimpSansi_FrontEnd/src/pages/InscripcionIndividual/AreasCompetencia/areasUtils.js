export function procesarAreasCompetencia(seleccionadas, categoriasSeleccionadas) {
  return seleccionadas.map((area) => {
    const nombreArea = area.toUpperCase();
    
    const categoriaSeleccionada = categoriasSeleccionadas[area] || "";
    
    return {
      nombre_area: nombreArea,
      categoria: categoriaSeleccionada.toUpperCase(),
    };
  });
}

export function validarFormulario(seleccionadas, categoriasSeleccionadas) {

  
  if (!seleccionadas || seleccionadas.length === 0) {
    return false;
  }

  for (const area of seleccionadas) {
    const categoria = categoriasSeleccionadas[area];
    
    const mensajesInvalidos = [
      "Sin categorías disponibles",
      "Categoría no disponible para este curso",
      "No hay categorías disponibles"
    ];
    
    const esCategoriaInvalida = !categoria || 
                              categoria.trim() === "" ||
                              mensajesInvalidos.some(invalid => 
                                categoria.includes(invalid));
    
    if (esCategoriaInvalida) {
      return false;
    }
    
  }

  return true;
}