const LoadingIndicator = ({ cargandoAreas, errorCarga }) => {
  if (cargandoAreas) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando áreas disponibles...</p>
      </div>
    );
  }
  
  if (errorCarga) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{errorCarga}</p>
      </div>
    );
  }
  
  return null;
};

export default LoadingIndicator;