import AreaCosto from "../../CrearOlimpiadas/AreasCompetencia/AreaCosto";

export const ContenidoPrincipal = ({
  olimpiadaSeleccionada,
  cargando,
  verificando,
  areasAsociadas,
  actualizarCosto,
  olimpiadaBloqueada,
}) => {
  if (!olimpiadaSeleccionada) {
    return (
      <div className="p-8 text-center text-gray-600">
        Seleccione una olimpiada para administrar los costos de sus áreas de competencia
      </div>
    );
  }

  if (cargando || verificando) {
    return (
      <div className="p-8 text-center text-gray-600">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        {cargando ? "Cargando áreas de competencia..." : "Verificando inscripciones..."}
      </div>
    );
  }

  if (areasAsociadas.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        No hay áreas de competencia asociadas a esta olimpiada. 
        Primero debe asignar áreas de competencia en la sección "Asignar Áreas".
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {areasAsociadas.map((area) => (
        <AreaCosto
          key={area.id}
          area={area}
          actualizarCosto={(nuevoCosto) => actualizarCosto(area.id, nuevoCosto)}
          bloqueado={olimpiadaBloqueada}
        />
      ))}
    </div>
  );
};