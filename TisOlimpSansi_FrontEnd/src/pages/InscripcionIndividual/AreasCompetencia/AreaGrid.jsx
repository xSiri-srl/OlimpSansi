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
  const filtrarAreasDisponibles = (areas) => {
    return areas.filter(area => {
      const estaDisponible = !cargandoAreas && maxAreas > 0 && areaEstaDisponible(area.nombre);
      return estaDisponible;
    });
  };

  const primeraFilaDisponible = filtrarAreasDisponibles(primeraFila);
  const segundaFilaDisponible = filtrarAreasDisponibles(segundaFila);

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

    return (
      <AreaCard
        key={index}
        area={area}
        estaSeleccionada={estaSeleccionada}
        estaDisponible={true} 
        categorias={categoriasParaMostrar}
        categoriaSeleccionada={categoriaSeleccionada}
        manejarSeleccion={manejarSeleccion}
        handleCategoriaChange={handleCategoriaChange}
      />
    );
  };

  if (cargandoAreas || (maxAreas > 0 && primeraFilaDisponible.length === 0 && segundaFilaDisponible.length === 0)) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">Cargando áreas disponibles...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Primera fila - Solo áreas disponibles */}
      {primeraFilaDisponible.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {primeraFilaDisponible.map((area, index) => renderizarArea(area, index))}
        </div>
      )}

      {/* Segunda fila - Solo áreas disponibles */}
      {segundaFilaDisponible.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {segundaFilaDisponible.map((area, index) =>
            renderizarArea(area, index + primeraFilaDisponible.length)
          )}
        </div>
      )}
    </>
  );
};

export default AreaGrid;