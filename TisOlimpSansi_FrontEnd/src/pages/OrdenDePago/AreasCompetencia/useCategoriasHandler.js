import { categoriasMap } from './areasConfig';

export function useCategoriasHandler(cursoEstudiante, areasCategorias = {}) {
  console.log("🎯 useCategoriasHandler - areasCategorias recibido:", areasCategorias);
  console.log("🎯 useCategoriasHandler - Claves disponibles:", Object.keys(areasCategorias));
  console.log("🎯 useCategoriasHandler - Curso estudiante:", cursoEstudiante);

  // Extraer información del grado del estudiante
  const obtenerInfoGrado = () => {
    const esPrimaria = cursoEstudiante.includes("Primaria");
    const esSecundaria = cursoEstudiante.includes("Secundaria");
    const match = cursoEstudiante.match(/\d+/);
    const numeroGrado = match ? parseInt(match[0], 10) : 0;
    
    const formatoCompleto = cursoEstudiante.toUpperCase().replace(/\s+/g, " ");
    
    return { 
      esPrimaria, 
      esSecundaria, 
      numeroGrado, 
      formatoCompleto 
    };
  };
  
  const { esPrimaria, esSecundaria, numeroGrado, formatoCompleto } = obtenerInfoGrado();

  // Función para verificar si el grado del estudiante está en el rango de grados de una categoría
  const gradoEstaEnRango = (categoria) => {
    if (!categoria || !categoria.grados || !Array.isArray(categoria.grados)) {
      console.log(`❌ Categoría "${categoria?.nombre}" no tiene grados válidos:`, categoria?.grados);
      return false;
    }
    
    console.log(`🔍 Verificando si grado "${formatoCompleto}" está en rango de categoría "${categoria.nombre}"`);
    console.log(`📋 Grados de la categoría:`, categoria.grados.map(g => g.nombre_grado));
    
    // Verificar si el grado del estudiante está en la lista de grados de la categoría
    const gradoEncontrado = categoria.grados.some(grado => {
      const nombreGrado = grado.nombre_grado.toUpperCase().replace(/\s+/g, " ");
      const coincide = nombreGrado === formatoCompleto;
      
      if (coincide) {
        console.log(`✅ Grado encontrado: "${nombreGrado}" coincide con "${formatoCompleto}"`);
      }
      
      return coincide;
    });
    
    if (gradoEncontrado) {
      console.log(`✅ Categoría "${categoria.nombre}" es compatible con grado "${formatoCompleto}"`);
    } else {
      console.log(`❌ Categoría "${categoria.nombre}" NO es compatible con grado "${formatoCompleto}"`);
    }
    
    return gradoEncontrado;
  };

  const obtenerCategoriaAutomatica = (area) => {
    if (!area) return null;
    
    console.log(`🎯 Obteniendo categoría automática para área: "${area}"`);
    
    // Buscar las categorías del área en los datos del backend
    const categoriasArea = areasCategorias[area] || areasCategorias[area.toUpperCase()] || [];
    
    if (categoriasArea.length > 0) {
      console.log(`📋 Categorías disponibles para ${area}:`, categoriasArea);
      
      // Filtrar categorías compatibles con el grado del estudiante
      const categoriasCompatibles = categoriasArea.filter(categoria => 
        gradoEstaEnRango(categoria)
      );
      
      console.log(`✅ Categorías compatibles encontradas:`, categoriasCompatibles.map(c => c.nombre));
      
      // Si hay exactamente una categoría compatible, la devolvemos automáticamente
      if (categoriasCompatibles.length === 1) {
        console.log(`🎉 Categoría automática seleccionada: "${categoriasCompatibles[0].nombre}"`);
        return categoriasCompatibles[0].nombre;
      }
      
      // Si hay múltiples categorías compatibles, no seleccionamos automáticamente
      if (categoriasCompatibles.length > 1) {
        console.log(`⚠️ Múltiples categorías compatibles, requiere selección manual`);
        return null;
      }
    }
    
    console.log(`❌ No se encontró categoría automática para ${area} y grado ${formatoCompleto}`);
    return null;
  };

  const obtenerCategorias = (area) => {
    if (!area) {
      console.log("⚠️ obtenerCategorias: Se recibió un área vacía");
      return ["Sin categorías disponibles"];
    }
    
    console.log(`\n📋 obtenerCategorias para área: "${area}"`);
    console.log(`🔍 areasCategorias disponible:`, Object.keys(areasCategorias));
    
    // Buscar las categorías del área en los datos del backend
    const categoriasArea = areasCategorias[area] || areasCategorias[area.toUpperCase()] || [];
    
    console.log(`🎯 Categorías encontradas para "${area}":`, categoriasArea);
    
    if (categoriasArea.length > 0) {
      // FILTRAR CATEGORÍAS POR GRADO DEL ESTUDIANTE
      const categoriasCompatibles = categoriasArea
        .filter(categoria => gradoEstaEnRango(categoria))
        .map(categoria => categoria.nombre);
      
      console.log(`✅ ${categoriasCompatibles.length} categorías compatibles para ${area}:`, categoriasCompatibles);
      
      // Si hay categorías compatibles, las devolvemos
      if (categoriasCompatibles.length > 0) {
        return categoriasCompatibles;
      }
      
      // Si no hay categorías compatibles, mostrar mensaje específico
      console.warn(`⚠️ No se encontraron categorías compatibles para ${area} y grado ${formatoCompleto}`);
      return [`No hay categorías disponibles para ${formatoCompleto}`];
    }
    
    console.log(`❌ No se encontraron categorías para área "${area}"`);
    return ["Sin categorías disponibles"];
  };

  return { obtenerCategoriaAutomatica, obtenerCategorias };
}