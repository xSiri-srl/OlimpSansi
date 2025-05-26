export function useAreasSeleccion(
  seleccionadas, 
  categoriasSeleccionadas, 
  obtenerCategorias,
  handleInputChange,
  maxAreas = 0 // Valor por defecto ahora es 0
) {
  // Añadir log para verificar que maxAreas se recibe correctamente
  console.log("useAreasSeleccion recibió maxAreas:", maxAreas);
  
  const manejarSeleccion = (nombre) => {
    let nuevasSeleccionadas;
    const nuevasCategoriasSeleccionadas = { ...categoriasSeleccionadas };

    if (seleccionadas.includes(nombre)) {
      nuevasSeleccionadas = seleccionadas.filter((area) => area !== nombre);
      delete nuevasCategoriasSeleccionadas[nombre];
    } else {
      // Si maxAreas es 0, no permitir selecciones
      if (maxAreas <= 0) {
        console.log("No se pueden seleccionar áreas, límite establecido a:", maxAreas);
        return;
      }
      
      // Log para depurar la comparación
      console.log("Comparando", seleccionadas.length, "<", maxAreas, "=", seleccionadas.length < maxAreas);
      
      if (seleccionadas.length < maxAreas) {
        nuevasSeleccionadas = [...seleccionadas, nombre];

        if (nombre === "Informática" || nombre === "Robótica") {
          const categorias = obtenerCategorias(nombre);
          if (categorias && categorias.length > 0) {
            nuevasCategoriasSeleccionadas[nombre] = "";
          }
        }
      } else {
        console.log("No se puede seleccionar más áreas, límite alcanzado:", maxAreas);
        return; // Ya hay suficientes áreas seleccionadas
      }
    }
    
    handleInputChange("estudiante", "areasSeleccionadas", nuevasSeleccionadas);
    handleInputChange(
      "estudiante",
      "categoriasSeleccionadas",
      nuevasCategoriasSeleccionadas
    );
  };
  // Definir la función handleCategoriaChange que falta
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