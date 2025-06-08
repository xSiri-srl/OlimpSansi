import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaCog, 
  FaDollarSign, 
  FaClipboardList,
  FaArrowRight,
  FaBullseye,
  FaCheck
} from 'react-icons/fa';
import { useVerificarProgreso } from '../hooks/useVerificarProgreso';

const ModalTareasPendientes = ({ 
  isOpen, 
  onClose, 
  onContinue,
  nombreOlimpiada = "su olimpiada",
  olimpiadaId = null,
  esPrimeraVez = false 
}) => {
  const [progreso, setProgreso] = useState({
    areasAsociadas: false,
    costosDefinidos: false,
    limiteDefinido: false
  });

  const { verificarProgreso, verificando } = useVerificarProgreso();

  useEffect(() => {
    if (isOpen && olimpiadaId) {
      const cargarProgreso = async () => {
        const nuevoProgreso = await verificarProgreso(olimpiadaId);
        setProgreso(nuevoProgreso);
      };
      cargarProgreso();
    }
  }, [isOpen, olimpiadaId, verificarProgreso]);

  if (!isOpen) return null;

  const tareas = [
    {
      id: 1,
      titulo: "Asignar Áreas de Competencia",
      descripcion: "Configure las materias y categorías disponibles",
      icono: <FaCog className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      importante: true,
      ruta: "/admin/asignar-area-nivel",
      completado: progreso.areasAsociadas
    },
    {
      id: 2,
      titulo: "Definir Costos por Área",
      descripcion: "Establezca los precios de inscripción para cada área",
      icono: <FaDollarSign className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      importante: true,
      ruta: "/admin/asignar-costo",
      completado: progreso.costosDefinidos
    },
    {
      id: 3,
      titulo: "Limitar Inscripciones",
      descripcion: "Configure el número máximo de áreas por participante",
      icono: <FaClipboardList className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      importante: true,
      ruta: "/admin/asignar-limite",
      completado: progreso.limiteDefinido
    }
  ];

  const tareasCompletadas = tareas.filter(t => t.completado).length;
  const porcentajeProgreso = Math.round((tareasCompletadas / tareas.length) * 100);
  const todasCompletas = tareasCompletadas === tareas.length;

  const handleTareaClick = (ruta) => {
   
    onClose();
    
    setTimeout(() => {
      window.location.href = ruta;
    }, 100);
  };

  const handleBotonPrincipal = () => {
    if (esPrimeraVez || todasCompletas) {
      onClose();
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } else {
      const primeraTareaIncompleta = tareas.find(t => !t.completado);
      const rutaDestino = primeraTareaIncompleta ? primeraTareaIncompleta.ruta : tareas[0].ruta;
      handleTareaClick(rutaDestino);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <FaCheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-1">
            ¡Olimpiada Creada Exitosamente!
          </h2>
          <p className="text-center text-blue-100 text-sm truncate mb-2">
            "{nombreOlimpiada}"
          </p>

          <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
          <p className="text-center text-blue-100 text-xs">
            {tareasCompletadas} de {tareas.length} tareas completadas ({porcentajeProgreso}%)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {todasCompletas ? (

            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ¡Configuración Completa!
              </h3>
              <p className="text-green-600 text-sm">
                Su olimpiada está completamente configurada y lista para recibir inscripciones.
              </p>
            </div>
          ) : (
            <div className="text-center mb-4">
              <FaBullseye className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tareasCompletadas > 0 ? '¡Excelente Progreso!' : '¡Importante!'}
              </h3>
              <p className="text-gray-600 text-sm">
                {tareasCompletadas > 0 
                  ? `Ha completado ${tareasCompletadas} de ${tareas.length} configuraciones. Continue con las restantes:`
                  : 'Para que la olimpiada esté lista para recibir inscripciones, debe completar estas configuraciones esenciales:'
                }
              </p>
            </div>
          )}

          <div className="space-y-3 mb-4">
            {tareas.map((tarea, index) => (
              <div 
                key={tarea.id}
                onClick={() => handleTareaClick(tarea.ruta)}
                className={`relative overflow-hidden rounded-lg border transition-all duration-300 group cursor-pointer ${
                  tarea.completado 
                    ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tarea.color} ${
                  tarea.completado ? 'opacity-10' : 'opacity-5 group-hover:opacity-15'
                } transition-opacity`}></div>
                <div className="relative p-3 flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`bg-gradient-to-r ${tarea.color} p-2 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform`}>
                      {tarea.icono}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${
                        tarea.completado 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {tarea.completado ? 'Completo' : 'Requerido'}
                      </span>
                    </div>
                    <h4 className={`font-semibold text-sm mb-1 truncate transition-colors ${
                      tarea.completado 
                        ? 'text-green-800'
                        : 'text-gray-800 group-hover:text-blue-700'
                    }`}>
                      {tarea.titulo}
                    </h4>
                    <p className={`text-xs line-clamp-2 transition-colors ${
                      tarea.completado 
                        ? 'text-green-600'
                        : 'text-gray-600 group-hover:text-gray-700'
                    }`}>
                      {tarea.descripcion}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {tarea.completado ? (
                      <FaCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <FaArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`border rounded-lg p-3 ${
            todasCompletas 
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {todasCompletas ? (
                  <FaCheck className="w-4 h-4 text-green-600 mt-0.5" />
                ) : (
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div className="ml-2">
                <p className={`text-xs font-medium ${
                  todasCompletas ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {todasCompletas ? (
                    <><strong>¡Perfecto!</strong> Su olimpiada está completamente configurada y lista para recibir inscripciones.</>
                  ) : (
                    <><strong>Recordatorio:</strong> Debe configurar todos estos requisitos para que la olimpiada pueda recibir inscritos.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center flex-shrink-0 border-t">
          {!esPrimeraVez && !todasCompletas && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
            >
              Configurar más tarde
            </button>
          )}

          {(esPrimeraVez || todasCompletas) && <div></div>}
          
          <button
            onClick={handleBotonPrincipal}
            disabled={verificando}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center text-sm disabled:opacity-50"
          >
            {verificando ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>
                  {todasCompletas 
                    ? 'Terminar' 
                    : esPrimeraVez 
                      ? 'Entendido' 
                      : 'Continuar configuración'
                  }
                </span>
                <FaArrowRight className="ml-2 w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTareasPendientes;