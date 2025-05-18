export function procesarAreasCompetencia(seleccionadas, categoriasSeleccionadas, cursoEstudiante) {
  const esSecundaria = cursoEstudiante.includes("Secundaria");
  const numero = Number.parseInt(cursoEstudiante.match(/\d+/)?.[0] || "0");
  
  return seleccionadas.map((area) => {
    const nombreArea = area.toUpperCase();
    let nombreAreaNormalizado = nombreArea;
    
    if (nombreArea === "ASTRONOMÍA Y ASTROFÍSICA") {
      nombreAreaNormalizado = "ASTRONOMÍA - ASTROFÍSICA";
    }

    if (area === "Informática" || area === "Robótica") {
      const categoriaCompleta = categoriasSeleccionadas[area] || "";
      const nombreCategoria = (
        categoriaCompleta.match(/"([^"]+)"/)?.[1] || ""
      ).toUpperCase();

      return {
        nombre_area: area.toUpperCase(),
        categoria: nombreCategoria,
      };
    } else if (area === "Matemáticas") {
      let nombreCategoria = "";
      if (numero === 1) nombreCategoria = "PRIMER NIVEL";
      else if (numero === 2) nombreCategoria = "SEGUNDO NIVEL";
      else if (numero === 3) nombreCategoria = "TERCER NIVEL";
      else if (numero === 4) nombreCategoria = "CUARTO NIVEL";
      else if (numero === 5) nombreCategoria = "QUINTO NIVEL";
      else nombreCategoria = "SEXTO NIVEL";

      return {
        nombre_area: area.toUpperCase(),
        categoria: nombreCategoria,
      };
    } else {
      let nombreCategoria = esSecundaria ? numero + "P" : numero + "S";
      
      return {
        nombre_area: area.toUpperCase(),
        categoria: nombreCategoria,
      };
    }
  });
}

export function validarFormulario(seleccionadas, categoriasSeleccionadas, obtenerCategorias, obtenerCategoriaAutomatica) {
  if (seleccionadas.length === 0) return false;

  for (const area of seleccionadas) {
    if (area === "Informática" || area === "Robótica") {
      const categorias = obtenerCategorias(area);

      if (categorias && categorias.length > 0) {
        if (
          !categoriasSeleccionadas[area] ||
          categoriasSeleccionadas[area].includes(
            "Categoría no disponible para este curso"
          )
        ) {
          return false;
        }
      }
    } else {
      const categoria = obtenerCategoriaAutomatica(area);
      if (categoria === null) {
        return false;
      }
    }
  }

  return true;
}