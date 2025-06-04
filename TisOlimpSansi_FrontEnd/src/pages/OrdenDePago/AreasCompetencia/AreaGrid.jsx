import AreaCard from './AreaCard';

const AreaGrid = ({ 
  primeraFila, 
  segundaFila, 
  seleccionadas, 
  areaEstaDisponible,
  obtenerCategorias,
  categoriasSeleccionadas,
  manejarSeleccion,
  handleCategoriaChange,
  cargandoAreas,
  maxAreas = 0,
  areasCategorias = {}
}) => {
  console.log("🔍 AreaGrid - areasCategorias recibido:", areasCategorias);
  console.log("🔍 AreaGrid - Claves disponibles:", Object.keys(areasCategorias));

  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);
    const nombreArea = area.nombre;
    
    console.log(`\n🔍 Renderizando área "${nombreArea}"`);
    
    // Buscar categorías en areasCategorias de múltiples formas
    let categoriasEncontradas = [];
    
    // Lista de posibles claves para buscar
    const posiblesClaves = [
      nombreArea,
      nombreArea.toUpperCase(),
      nombreArea.toLowerCase(),
      // Mapeos específicos
      nombreArea === "Matemáticas" ? "MATEMATICAS" : null,
      nombreArea === "Matemáticas" ? "MATEMATICA" : null,
      nombreArea === "Física" ? "FISICA" : null,
      nombreArea === "Química" ? "QUIMICA" : null,
      nombreArea === "Biología" ? "BIOLOGIA" : null,
      nombreArea === "Informática" ? "INFORMATICA" : null,
      nombreArea === "Robótica" ? "ROBOTICA" : null,
      nombreArea === "Astronomía y Astrofísica" ? "ASTRONOMIA Y ASTROFISICA" : null,
      nombreArea === "Astronomía y Astrofísica" ? "ASTRONOMIAYASTROFISICA" : null,
    ].filter(Boolean);
    
    console.log(`📋 Buscando categorías con claves:`, posiblesClaves);
    
    for (const clave of posiblesClaves) {
      if (areasCategorias[clave] && Array.isArray(areasCategorias[clave])) {
        categoriasEncontradas = areasCategorias[clave];
        console.log(`✅ Encontradas ${categoriasEncontradas.length} categorías para "${nombreArea}" usando clave "${clave}"`);
        console.log(`📊 Categorías:`, categoriasEncontradas.map(c => c.nombre || c));
        break;
      }
    }
    
    // Si no encontramos categorías directamente, mostrar que hay en areasCategorias
    if (categoriasEncontradas.length === 0) {
      console.log(`❌ No se encontraron categorías para "${nombreArea}"`);
      console.log(`🔍 Contenido completo de areasCategorias:`, areasCategorias);
      
      // Fallback: usar obtenerCategorias
      const categoriasFallback = obtenerCategorias(nombreArea);
      console.log(`🔄 Fallback obtenerCategorias para "${nombreArea}":`, categoriasFallback);
    }
    
    // Preparar lista de nombres de categorías
    const categoriasParaMostrar = categoriasEncontradas.length > 0 
      ? categoriasEncontradas.map(cat => cat.nombre || cat)
      : ["Sin categorías disponibles"];
    
    const categoriaSeleccionada = categoriasSeleccionadas[area.nombre] || "";
    const estaDisponible = !cargandoAreas && maxAreas > 0 && areaEstaDisponible(area.nombre);

    console.log(`📋 Resumen final para "${nombreArea}":`, {
      estaSeleccionada,
      estaDisponible,
      categoriasParaMostrar,
      categoriaSeleccionada,
      maxAreas,
      cargandoAreas
    });

    return (
      <AreaCard
        key={index}
        area={area}
        estaSeleccionada={estaSeleccionada}
        estaDisponible={estaDisponible}
        categorias={categoriasParaMostrar}
        categoriaSeleccionada={categoriaSeleccionada}
        manejarSeleccion={manejarSeleccion}
        handleCategoriaChange={handleCategoriaChange}
      />
    );
  };

  return (
    <>
      {/* Primera fila */}
      <div className={`flex flex-wrap justify-center gap-6 mb-6 ${cargandoAreas ? 'opacity-60 pointer-events-none' : ''}`}>
        {primeraFila.map((area, index) => renderizarArea(area, index))}
      </div>

      {/* Segunda fila */}
      <div className={`flex flex-wrap justify-center gap-6 ${cargandoAreas ? 'opacity-60 pointer-events-none' : ''}`}>
        {segundaFila.map((area, index) =>
          renderizarArea(area, index + primeraFila.length)
        )}
      </div>
    </>
  );
};

export default AreaGrid;