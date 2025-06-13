const LoadingIndicator = ({ cargandoAreas, errorCarga }) => {
  if (cargandoAreas) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">Cargando áreas disponibles...</span>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="text-center py-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-red-600 font-semibold mb-2">Error al cargar áreas</div>
          <p className="text-red-700 text-sm">{errorCarga}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingIndicator;