const Title = ({ maxAreas, cargandoMaxAreas }) => {
  const límiteÁreas = isNaN(parseInt(maxAreas)) ? 0 : parseInt(maxAreas);
  
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-2 text-gray-500">
        Áreas de Competencia
      </h2>
      <p className="text-sm text-gray-600">
        {cargandoMaxAreas ? (
          "Cargando límite de áreas..."
        ) : límiteÁreas === 0 ? (
          "No se permite seleccionar áreas para esta olimpiada."
        ) : (
          `Selecciona hasta ${límiteÁreas} ${límiteÁreas === 1 ? 'área' : 'áreas'} de competencia.`
        )}
      </p>
    </div>
  );
};

export default Title;