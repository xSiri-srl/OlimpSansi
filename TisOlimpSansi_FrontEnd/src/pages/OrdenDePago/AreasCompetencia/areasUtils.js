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
  console.log("🔍 Validando formulario...");
  console.log("Áreas seleccionadas:", seleccionadas);
  console.log("Categorías seleccionadas:", categoriasSeleccionadas);
  
  // Si no hay áreas seleccionadas, el formulario no es válido
  if (!seleccionadas || seleccionadas.length === 0) {
    console.log("❌ No hay áreas seleccionadas");
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
      console.log(`❌ Área ${area} tiene categoría inválida: "${categoria}"`);
      return false;
    }
    
    console.log(`✅ Área ${area} tiene categoría válida: "${categoria}"`);
  }

  console.log("✅ Formulario válido");
  return true;
}