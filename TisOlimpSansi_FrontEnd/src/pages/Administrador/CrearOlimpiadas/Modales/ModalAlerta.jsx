import React from 'react';

const ModalAlerta = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "error", // error, success, warning, info
  buttonText = "Entendido"
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-green-100',
          border: 'border-green-400',
          text: 'text-green-700',
          icon: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-400',
          text: 'text-yellow-700',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-400',
          text: 'text-blue-700',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      default: // error
        return {
          bg: 'bg-red-100',
          border: 'border-red-400',
          text: 'text-red-700',
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default: // error
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${colors.icon}`}>
              {getIcon()}
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${colors.text}`}>
                {title}
              </h3>
              <div className={`mt-2 text-sm ${colors.text}`}>
                <p className="whitespace-pre-line">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 ${colors.button}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlerta;