import AreaCard from './AreaCard';

const AreaGrid = ({ 
  primeraFila, 
  segundaFila, 
  seleccionadas, 
  areaEstaDisponible,
  categoriasSeleccionadas,
  manejarSeleccion,
  handleCategoriaChange,
  cargandoAreas,
  maxAreas = 0,
  areasCategorias = {}
}) => {
  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);
    const nombreArea = area.nombre;
        
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
      // Variantes para Astronomía y Astrofísica
      nombreArea === "Astronomía y Astrofísica" ? "ASTRONOMIA Y ASTROFISICA" : null,
      nombreArea === "Astronomía y Astrofísica" ? "ASTRONOMIAYASTROFISICA" : null,
      nombreArea === "Astronomía y Astrofísica" ? "ASTRONOMÍA-ASTROFÍSICA" : null,
      nombreArea === "Astronomía y Astrofísica" ? "ASTRONOMIA-ASTROFISICA" : null,
    ].filter(Boolean);
    
    
    for (const clave of posiblesClaves) {
      if (areasCategorias[clave] && Array.isArray(areasCategorias[clave])) {
        categoriasEncontradas = areasCategorias[clave];
        break;
      }
    }
    
    // Preparar lista de nombres de categorías
    const categoriasParaMostrar = categoriasEncontradas.length > 0 
      ? categoriasEncontradas.map(cat => cat.nombre || cat)
      : ["Sin categorías disponibles"];
    
    const categoriaSeleccionada = categoriasSeleccionadas[area.nombre] || "";
    const estaDisponible = !cargandoAreas && maxAreas > 0 && areaEstaDisponible(area.nombre);

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