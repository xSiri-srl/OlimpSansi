import React from 'react';

const ModalValidacion = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  validationType,
  areas = [],
  confirmText = "Continuar de todas formas", 
  cancelText = "Revisar"
}) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch(validationType) {
      case 'areas-sin-categorias':
        return (
          <div>
            <p className="text-sm text-gray-700 mb-4">{message}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">Áreas sin categorías:</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {areas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'categoria-duplicada':
        return (
          <div>
            <p className="text-sm text-gray-700 mb-4">{message}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                Por favor, revise las categorías antes de continuar.
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {message}
          </p>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 text-yellow-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">
            {title}
          </h3>
        </div>
        
        <div className="mb-6">
          {renderContent()}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalValidacion;