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
  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);
    
    // Obtener categorías del backend para esta área específica
    let categorias;
    const nombreArea = area.nombre;
    
    // Buscar categorías en areasCategorias (puede estar con o sin acentos)
    if (areasCategorias[nombreArea]) {
      categorias = areasCategorias[nombreArea].map(cat => cat.nombre);
    } else if (areasCategorias[nombreArea.toUpperCase()]) {
      categorias = areasCategorias[nombreArea.toUpperCase()].map(cat => cat.nombre);
    } else {
      // Fallback al método anterior
      categorias = obtenerCategorias(nombreArea);
    }
    
    const categoriaSeleccionada = categoriasSeleccionadas[area.nombre] || "";
    const estaDisponible = !cargandoAreas && maxAreas > 0 && areaEstaDisponible(area.nombre);

    return (
      <AreaCard
        key={index}
        area={area}
        estaSeleccionada={estaSeleccionada}
        estaDisponible={estaDisponible}
        categorias={categorias}
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