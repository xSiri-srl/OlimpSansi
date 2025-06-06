import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock } from 'react-icons/fa';
import { useVerificarProgreso } from './hooks/useVerificarProgreso';

const IndicadorProgreso = ({ olimpiadaId, nombreOlimpiada }) => {
  const [progreso, setProgreso] = useState({
    areasAsociadas: false,
    costosDefinidos: false,
    limiteDefinido: false
  });

  const { verificarProgreso, verificando } = useVerificarProgreso();

  useEffect(() => {
    if (olimpiadaId) {
      const cargarProgreso = async () => {
        const nuevoProgreso = await verificarProgreso(olimpiadaId);
        setProgreso(nuevoProgreso);
      };
      cargarProgreso();
    }
  }, [olimpiadaId, verificarProgreso]);

  const tareas = [
    { nombre: 'Áreas', completado: progreso.areasAsociadas },
    { nombre: 'Costos', completado: progreso.costosDefinidos },
    { nombre: 'Límite', completado: progreso.limiteDefinido }
  ];

  const tareasCompletadas = tareas.filter(t => t.completado).length;
  const porcentaje = Math.round((tareasCompletadas / tareas.length) * 100);

  if (!olimpiadaId) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-800">Progreso de configuración</h4>
        <span className="text-sm text-gray-600">{tareasCompletadas}/{tareas.length}</span>
      </div>
      
      <div className="mb-3">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {tareas.map((tarea, index) => (
          <div key={index} className="flex items-center text-xs">
            {tarea.completado ? (
              <FaCheck className="w-3 h-3 text-green-600 mr-1" />
            ) : (
              <FaClock className="w-3 h-3 text-gray-400 mr-1" />
            )}
            <span className={tarea.completado ? 'text-green-700' : 'text-gray-500'}>
              {tarea.nombre}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicadorProgreso;