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
      console.log('🔍 OlimpiadaSelector - Cargando olimpiadas...');
      
      const response = await axios.get(`${API_URL}/api/get-olimpiadaz`);
      const olimpiadasData = response.data.data || [];
      
      
      setOlimpiadas(olimpiadasData);
 
    } catch (error) {
      console.error('OlimpiadaSelector - Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOlimpiadaChange = (e) => {
    const olimpiadaId = e.target.value;
    console.log('🔄 OlimpiadaSelector - Cambio de selección:', olimpiadaId);
    
    setOlimpiadaSeleccionada(olimpiadaId);
    
    if (olimpiadaId === '') {
      console.log('🔄 OlimpiadaSelector - Selección vacía, enviando null');
      onOlimpiadaChange(null);
      return;
    }
    
    const olimpiada = olimpiadas.find(o => 
      o.id.toString() === olimpiadaId || o.id === parseInt(olimpiadaId)
    );
    
    console.log('🔄 OlimpiadaSelector - Olimpiada encontrada:', olimpiada);
    
    if (olimpiada) {
      onOlimpiadaChange(olimpiada);
    } else {
      console.error(' OlimpiadaSelector - No se encontró olimpiada con ID:', olimpiadaId);
    }
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
          <option key={olimpiada.id} value={olimpiada.id.toString()}>
            {olimpiada.titulo} ({new Date(olimpiada.fecha_ini).getFullYear()})
          </option>
        ))}
      </select>
      
    </div>
  );
};

export default OlimpiadaSelector;