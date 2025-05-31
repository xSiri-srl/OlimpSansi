export function procesarAreasCompetencia(seleccionadas, categoriasSeleccionadas, cursoEstudiante) {
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
  if (!seleccionadas || seleccionadas.length === 0) return false;

  // Verificar que cada área seleccionada tenga una categoría correspondiente válida
  for (const area of seleccionadas) {
    const categoria = categoriasSeleccionadas[area];
    
    // Si no hay categoría seleccionada o es inválida
    if (!categoria || categoria === "" || 
        categoria === "Sin categorías disponibles" ||
        categoria.includes("Categoría no disponible para este curso")) {
      console.log(`Área ${area} tiene categoría inválida: "${categoria}"`);
      return false;
    }
  }

  // Si todas las áreas tienen categorías válidas
  return true;
}