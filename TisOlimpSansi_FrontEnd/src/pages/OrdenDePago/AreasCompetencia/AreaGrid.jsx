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
  maxAreas = 0
}) => {
  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);
    const categorias = obtenerCategorias(area.nombre);
    const categoriaSeleccionada = categoriasSeleccionadas[area.nombre] || "";
    // Durante la carga, todas las áreas aparecen como no disponibles
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
        //cargandoAreas={cargandoAreas}
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