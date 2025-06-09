import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../utils/api';
import axios from 'axios';

const OlimpiadaSelector = ({ onOlimpiadaChange, darkMode }) => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOlimpiadas();
  }, []);

  const fetchOlimpiadas = async () => {
    try {
      console.log('Intentando cargar olimpiadas desde:', `${API_URL}/api/get-olimpiadaz`);
      
      // Usar el endpoint correcto que ya existe en tu backend
      const response = await axios.get(`${API_URL}/api/get-olimpiadaz`);
      
      console.log('Respuesta del servidor:', response.data);
      
      setOlimpiadas(response.data.data || []);
      
      // Seleccionar la primera olimpiada por defecto
      if (response.data.data && response.data.data.length > 0) {
        const primeraOlimpiada = response.data.data[0];
        setOlimpiadaSeleccionada(primeraOlimpiada.id);
        onOlimpiadaChange(primeraOlimpiada);
      }
    } catch (error) {
      console.error('Error al cargar olimpiadas:', error);
      console.error('URL intentada:', `${API_URL}/api/get-olimpiadaz`);
      console.error('Error completo:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOlimpiadaChange = (e) => {
    const olimpiadaId = e.target.value;
    setOlimpiadaSeleccionada(olimpiadaId);
    
    const olimpiada = olimpiadas.find(o => o.id.toString() === olimpiadaId);
    onOlimpiadaChange(olimpiada);
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse">
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-32 mb-2`}></div>
          <div className={`h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-64`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label 
        htmlFor="olimpiada-select" 
        className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}
      >
        Seleccionar Olimpiada:
      </label>
      <select
        id="olimpiada-select"
        value={olimpiadaSeleccionada}
        onChange={handleOlimpiadaChange}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
          ${darkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
          }
        `}
      >
        <option value="">Seleccione una olimpiada</option>
        {olimpiadas.map((olimpiada) => (
          <option key={olimpiada.id} value={olimpiada.id}>
            {olimpiada.titulo} ({new Date(olimpiada.fecha_ini).getFullYear()})
          </option>
        ))}
      </select>
      
      {/* Debug info - puedes remover esto después */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Olimpiadas cargadas: {olimpiadas.length}
        </div>
      )}
    </div>
  );
};

export default OlimpiadaSelector;