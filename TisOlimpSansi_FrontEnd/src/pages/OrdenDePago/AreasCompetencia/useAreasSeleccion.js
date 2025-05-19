export function useAreasSeleccion(
  seleccionadas, 
  categoriasSeleccionadas, 
  obtenerCategorias,
  handleInputChange
) {
  const manejarSeleccion = (nombre) => {
    let nuevasSeleccionadas;
    const nuevasCategoriasSeleccionadas = { ...categoriasSeleccionadas };

    if (seleccionadas.includes(nombre)) {
      nuevasSeleccionadas = seleccionadas.filter((area) => area !== nombre);
      delete nuevasCategoriasSeleccionadas[nombre];
    } else {
      if (seleccionadas.length < 2) {
        nuevasSeleccionadas = [...seleccionadas, nombre];

        if (nombre === "Informática" || nombre === "Robótica") {
          const categorias = obtenerCategorias(nombre);
          if (categorias && categorias.length > 0) {
            nuevasCategoriasSeleccionadas[nombre] = "";
          }
        }
      } else {
        return; // Ya hay 2 áreas seleccionadas
      }
    }

    handleInputChange("estudiante", "areasSeleccionadas", nuevasSeleccionadas);
    handleInputChange(
      "estudiante",
      "categoriasSeleccionadas",
      nuevasCategoriasSeleccionadas
    );
  };

  const handleCategoriaChange = (area, categoria) => {
    const nuevasCategoriasSeleccionadas = {
      ...categoriasSeleccionadas,
      [area]: categoria,
    };
    handleInputChange(
      "estudiante",
      "categoriasSeleccionadas",
      nuevasCategoriasSeleccionadas
    );
  };

  return { manejarSeleccion, handleCategoriaChange };
}