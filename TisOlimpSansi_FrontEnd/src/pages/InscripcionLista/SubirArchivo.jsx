import React, { useState } from 'react';
import { FaFileExcel } from 'react-icons/fa';

function SubirArchivo({ setStep }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Solo se permiten archivos Excel (.xlsx o .xls)');
    }
  };

  const handleSiguiente = () => {
    if (selectedFile) {
      setStep(3); // Avanzar al siguiente paso
    } else {
      setError('Por favor, selecciona un archivo Excel válido');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2 text-gray-500">Sube tu lista en formato Excel</h2>

      <label className="border-2 border-dashed border-gray-400 p-6 w-full flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-200">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <div className="flex flex-col items-center">
          <span className="text-green-600 text-4xl">
            <FaFileExcel size={60} />
          </span>
          <p className="text-sm text-gray-500 mt-2">Seleccionar archivo Excel</p>
        </div>
      </label>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {selectedFile && <p className="text-sm text-green-600 mt-2">{selectedFile.name}</p>}

      <button
        onClick={handleSiguiente}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Siguiente
      </button>
    </div>
  );
}

export default SubirArchivo;
