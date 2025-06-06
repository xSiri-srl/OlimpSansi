import React from 'react';
import { 
  FaCheckCircle, 
  FaCog, 
  FaDollarSign, 
  FaClipboardList,
  FaArrowRight,
  FaBullseye
} from 'react-icons/fa';

const ModalTareasPendientes = ({ 
  isOpen, 
  onClose, 
  onContinue,
  nombreOlimpiada = "su olimpiada"
}) => {
  if (!isOpen) return null;

  const tareas = [
    {
      id: 1,
      titulo: "Asignar Áreas de Competencia",
      descripcion: "Configure las materias y categorías disponibles",
      icono: <FaCog className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      importante: true,
      ruta: "/admin/asociar-nivel"
    },
    {
      id: 2,
      titulo: "Definir Costos por Área",
      descripcion: "Establezca los precios de inscripción para cada área",
      icono: <FaDollarSign className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      importante: true,
      ruta: "/admin/asociar-costo"
    },
    {
      id: 3,
      titulo: "Limitar Inscripciones",
      descripcion: "Configure el número máximo de áreas por participante",
      icono: <FaClipboardList className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      importante: true,
      ruta: "/admin/asociar-limite"
    }
  ];

  // Función para manejar clic en tarjeta específica
  const handleTareaClick = (ruta) => {
    // Cerrar el modal primero
    onClose();
    
    // Redirigir a la ruta específica
    setTimeout(() => {
      window.location.href = ruta;
    }, 100);
  };

  // Función para manejar el botón "Configurar ahora" (va al primer paso)
  const handleConfigurarAhora = () => {
    handleTareaClick(tareas[0].ruta); // Redirige al primer paso
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header con gradiente - fijo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <FaCheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-1">
            ¡Olimpiada Creada Exitosamente!
          </h2>
        </div>

        {/* Contenido principal - con scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center mb-4">
            <FaBullseye className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¡Importante!
            </h3>
            <p className="text-gray-600 text-sm">
              Para que la olimpiada esté lista para recibir inscripciones, 
              debe completar estas configuraciones esenciales:
            </p>
          </div>

          {/* Lista de tareas - compacta y clickeable */}
          <div className="space-y-3 mb-4">
            {tareas.map((tarea, index) => (
              <div 
                key={tarea.id}
                onClick={() => handleTareaClick(tarea.ruta)}
                className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 group cursor-pointer hover:border-blue-300 hover:bg-blue-50"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tarea.color} opacity-5 group-hover:opacity-15 transition-opacity`}></div>
                <div className="relative p-3 flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`bg-gradient-to-r ${tarea.color} p-2 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform`}>
                      {tarea.icono}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center mb-1">

                      {tarea.importante && (
                        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          Requerido
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate group-hover:text-blue-700 transition-colors">
                      {tarea.titulo}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {tarea.descripcion}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <FaArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nota importante - compacta */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-yellow-800">
                  <strong>Recordatorio:</strong> Debe configurar todos estos requisitos para que la olimpiada pueda recibir inscritos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones - fijo */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center flex-shrink-0 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
          >
            Configurar más tarde
          </button>
          <button
            onClick={handleConfigurarAhora}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center text-sm"
          >
            <span>Configurar ahora</span>
            <FaArrowRight className="ml-2 w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTareasPendientes;