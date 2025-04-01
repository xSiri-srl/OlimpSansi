import React from 'react';
import { FaDownload, FaPrint, FaMapMarkerAlt, FaCopy } from 'react-icons/fa';

const OrdenPago = () => {
  const codigoOrden = "TSOL-2024-0055"; // Hardcodeado temporal
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigoOrden);
    alert('Código copiado al portapapeles');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Alerta importante */}
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p className="font-bold">¡INSCRIPCIÓN NO TERMINÓ!</p>
        <p>Complete el proceso subiendo su comprobante después de pagar</p>
      </div>

      {/* Sección de descarga */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Orden de Pago Generada</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center mx-auto mb-4">
          <FaDownload className="mr-2" />
          Descargar Orden de Pago
        </button>
        <p className="text-sm text-gray-600">Si no se descargó automáticamente, use el botón anterior</p>
      </div>

      {/* Instrucciones */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-start mb-4">
          <FaPrint className="text-2xl mr-3 text-yellow-600" />
          <div>
            <h3 className="font-bold mb-1">IMPRIMA LA ORDEN DE PAGO</h3>
            <p className="text-sm">Para realizar el pago en Caja Facultativa</p>
            <p className="text-xs text-gray-600 mt-1">El pago debe ser realizado por el responsable de inscripción</p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <FaMapMarkerAlt className="text-2xl mr-3 text-blue-600" />
          <div>
            <h3 className="font-bold mb-1">UBICACIÓN PARA PAGO</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Ver tutorial de cómo llegar
              <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Código de orden */}
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
        <h4 className="text-sm font-semibold mb-2">GUARDE ESTE CÓDIGO DE ORDEN</h4>
        <div className="flex items-center justify-center space-x-2">
          <span className="bg-gray-100 px-4 py-2 rounded-md font-mono">{codigoOrden}</span>
          <button 
            onClick={handleCopyCode}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Copiar código"
          >
            <FaCopy className="text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Necesitará este código para subir su comprobante de pago</p>
      </div>

      {/* Nota final */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Después de realizar el pago, vuelva a esta plataforma para subir su comprobante
      </p>
    </div>
  );
};

export default OrdenPago;