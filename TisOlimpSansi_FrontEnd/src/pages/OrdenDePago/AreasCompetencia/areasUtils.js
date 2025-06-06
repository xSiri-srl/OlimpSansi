export function procesarAreasCompetencia(seleccionadas, categoriasSeleccionadas) {
  return seleccionadas.map((area) => {
    const nombreArea = area.toUpperCase();
    
    // Usar la categoría seleccionada directamente para todas las áreas ahora
    const categoriaSeleccionada = categoriasSeleccionadas[area] || "";
    
    return {
      nombre_area: nombreArea,
      categoria: categoriaSeleccionada.toUpperCase(),
    };
  });
}

export function validarFormulario(seleccionadas, categoriasSeleccionadas) {

  
  // Si no hay áreas seleccionadas, el formulario no es válido
  if (!seleccionadas || seleccionadas.length === 0) {
    return false;
  }

  // Verificar que cada área seleccionada tenga una categoría correspondiente válida
  for (const area of seleccionadas) {
    const categoria = categoriasSeleccionadas[area];
    
    // Lista de mensajes que indican categorías inválidas
    const mensajesInvalidos = [
      "Sin categorías disponibles",
      "Categoría no disponible para este curso",
      "No hay categorías disponibles"
    ];
    
    // Verificar si la categoría es inválida
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