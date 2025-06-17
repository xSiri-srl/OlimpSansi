const EstadoCarga = ({ 
    cargandoOlimpiadas, 
    verificando, 
    cargandoAreas 
  }) => {
    const obtenerMensajeCarga = () => {
      if (cargandoOlimpiadas) return "Cargando olimpiadas...";
      if (verificando) return "Verificando inscripciones...";
      if (cargandoAreas) return "Cargando áreas asociadas...";
      return "";
    };
  
    if (!cargandoOlimpiadas && !verificando && !cargandoAreas) {
      return null;
    }
  
    return (
      <div className="text-center py-8">
        <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        <p className="mt-2 text-gray-600">
          {obtenerMensajeCarga()}
        </p>
      </div>
    );
  };
  
  export default EstadoCarga;