import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ContadorAreas = ({ 
  contador, 
  maximoPermitido, 
  olimpiadaBloqueada, 
  onIncrementar, 
  onDecrementar 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-100 rounded-xl shadow-lg border border-blue-100 ${olimpiadaBloqueada ? 'opacity-50' : ''}`}>
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Número máximo de áreas por participante
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Configure cuántas áreas de competencia puede seleccionar cada participante
        </p>
      </div>

      <div className="flex items-center justify-center space-x-8">
        <button
          onClick={onDecrementar}
          disabled={contador === 1 || olimpiadaBloqueada}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
            contador === 1 || olimpiadaBloqueada
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
          }`}
        >
          <FaChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold text-blue-600 mb-2 min-w-[80px] text-center">
            {contador}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {contador === 1 ? "área" : "áreas"}
          </div>
        </div>
        
        <button
          onClick={onIncrementar}
          disabled={contador === maximoPermitido || olimpiadaBloqueada}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 ${
            contador === maximoPermitido || olimpiadaBloqueada
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white active:translate-y-1"
          }`}
        >
          <FaChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex space-x-2 mt-6">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <div
            key={num}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              num === contador
                ? "bg-blue-500 scale-125"
                : num < contador
                ? "bg-blue-300"
                : num <= maximoPermitido
                ? "bg-gray-300"
                : "bg-red-200"
            }`}
          />
        ))}
      </div>

      <div className="text-xs text-gray-400 mt-4">
        Rango: 1 - {maximoPermitido} áreas
      </div>
    </div>
  );
};

export default ContadorAreas;