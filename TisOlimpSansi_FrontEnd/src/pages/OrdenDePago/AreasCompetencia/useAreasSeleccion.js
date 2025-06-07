export function useAreasSeleccion(
  seleccionadas, 
  categoriasSeleccionadas, 
  obtenerCategorias,
  handleInputChange,
  maxAreas = 0
) {
  
  const manejarSeleccion = (nombre) => {
    let nuevasSeleccionadas;
    const nuevasCategoriasSeleccionadas = { ...categoriasSeleccionadas };
    
    if (seleccionadas.includes(nombre)) {
      nuevasSeleccionadas = seleccionadas.filter((area) => area !== nombre);
      delete nuevasCategoriasSeleccionadas[nombre];
    } else {
      if (maxAreas <= 0) {
        console.log("No se pueden seleccionar áreas, límite establecido a:", maxAreas);
        return;
      }
      
      console.log("Comparando", seleccionadas.length, "<", maxAreas, "=", seleccionadas.length < maxAreas);
      
      if (seleccionadas.length < maxAreas) {
        nuevasSeleccionadas = [...seleccionadas, nombre];
        const categorias = obtenerCategorias(nombre);
        
        if (categorias && categorias.length === 1 && 
            categorias[0] !== "Sin categorías disponibles" && 
            categorias[0] !== "Categoría no disponible para este curso") {
          nuevasCategoriasSeleccionadas[nombre] = categorias[0];
        } else {
          nuevasCategoriasSeleccionadas[nombre] = "";
        }
      } else {
        console.log("No se puede seleccionar más áreas, límite alcanzado:", maxAreas);
        return; 
      }
    }
    
    handleInputChange("estudiante", "areasSeleccionadas", nuevasSeleccionadas);
    handleInputChange(
      "estudiante",
      "categoriasSeleccionadas",
      nuevasCategoriasSeleccionadas
    );
  };

  const handleCategoriaChange = (area, valor) => {
    const nuevasCategoriasSeleccionadas = {
      ...categoriasSeleccionadas,
      [area]: valor,
    };
    
    handleInputChange(
      "estudiante", 
      "categoriasSeleccionadas", 
      nuevasCategoriasSeleccionadas
    );
  };

  return { manejarSeleccion, handleCategoriaChange };
}