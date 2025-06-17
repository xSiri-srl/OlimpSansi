const AlertasInformativas = ({ 
    olimpiadaBloqueada, 
    olimpiadaSeleccionada, 
    cantidadAreasAsociadas, 
    cargandoAreas, 
    obtenerMensajeBloqueo,
    maximoPermitido
  }) => {
    return (
      <>
        {/* Alerta de olimpiada bloqueada */}
        {olimpiadaBloqueada && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <strong className="font-bold">Olimpiada bloqueada para modificaciones</strong>
            </div>
            <span className="block mt-1">
              {obtenerMensajeBloqueo()}
            </span>
          </div>
        )}
  
        {/* Información sobre áreas asociadas */}
        {olimpiadaSeleccionada && cantidadAreasAsociadas > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                Esta olimpiada tiene <strong>{cantidadAreasAsociadas}</strong> {cantidadAreasAsociadas === 1 ? 'área asociada' : 'áreas asociadas'}.
                El límite máximo recomendado es <strong>{maximoPermitido}</strong>.
              </span>
            </div>
          </div>
        )}
  
        {/* Alerta de sin áreas asociadas */}
        {olimpiadaSeleccionada && cantidadAreasAsociadas === 0 && !cargandoAreas && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>
                Esta olimpiada no tiene áreas asociadas. Configure primero las áreas de competencia antes de establecer el límite por participante.
              </span>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default AlertasInformativas;
  