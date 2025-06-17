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
        return;
      }
      
      
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