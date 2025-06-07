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
    const categoriasEncontradas = Array.isArray(areasCategorias[nombreArea])
      ? areasCategorias[nombreArea]
      : [];
    const categoriasParaMostrar = categoriasEncontradas.length > 0
      ? categoriasEncontradas.map(cat => cat.nombre || cat)
      : ["Sin categorías disponibles"];

    const categoriaSeleccionada = categoriasSeleccionadas[nombreArea] || "";
    const estaDisponible = !cargandoAreas && maxAreas > 0 && areaEstaDisponible(nombreArea);

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