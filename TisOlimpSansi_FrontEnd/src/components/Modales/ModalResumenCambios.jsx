import React from 'react';

const ModalResumenCambios = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  areasParaDesasociar = [], 
  categoriasParaEliminar = [] 
}) => {
  if (!isOpen) return null;

  const hayAreasParaDesasociar = areasParaDesasociar.length > 0;
  const hayCategorias = categoriasParaEliminar.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 text-yellow-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">
            Confirmar Cambios
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-4">
            Se aplicarán los siguientes cambios:
          </p>
          {hayAreasParaDesasociar && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">
                • {areasParaDesasociar.length} área(s) completa(s) se desasociarán:
              </h4>
              <div className="ml-4 space-y-1">
                {areasParaDesasociar.map((area, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-red-50 px-2 py-1 rounded">
                    - {area.area}
                  </div>
                ))}
              </div>
            </div>
          )}
          {hayCategorias && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">
                • Categorías individuales que se desasociarán:
              </h4>
              <div className="ml-4 space-y-2">
                {categoriasParaEliminar.map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-700">- {item.combo.area}:</div>
                    <div className="ml-4 space-y-1">
                      {item.categorias.map((cat, catIndex) => (
                        <div key={catIndex} className="text-gray-600 bg-yellow-50 px-2 py-1 rounded">
                          {cat.nombre}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Esta acción es irreversible.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirmar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalResumenCambios;