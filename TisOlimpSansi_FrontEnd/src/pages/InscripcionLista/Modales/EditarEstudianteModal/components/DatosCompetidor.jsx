import React from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const DatosCompetidor = ({ 
  estudianteData, 
  handleChange, 
  mostrarCampo, 
  tieneError, 
  errores 
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DEL COMPETIDOR</h4>
      
      {mostrarCampo('apellido_pa') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno *
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('apellido_pa') ? 'border-red-500' : ''}`}
            value={estudianteData.estudiante?.apellido_pa || ''}
            onChange={(e) => handleChange('estudiante', 'apellido_pa', e.target.value.toUpperCase())}
          />
          {tieneError('apellido_pa') && <p className="text-red-500 text-xs mt-1">{errores.apellido_pa}</p>}
        </div>
      )}
      
      {mostrarCampo('apellido_ma') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Materno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.estudiante?.apellido_ma || ''}
            onChange={(e) => handleChange('estudiante', 'apellido_ma', e.target.value.toUpperCase())}
          />
        </div>
      )}
      
      {mostrarCampo('nombre') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Nombres *
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('nombre') ? 'border-red-500' : ''}`}
            value={estudianteData.estudiante?.nombre || ''}
            onChange={(e) => handleChange('estudiante', 'nombre', e.target.value.toUpperCase())}
          />
          {tieneError('nombre') && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
        </div>
      )}
      
      {/* Resto de campos para datos del competidor */}
      {mostrarCampo('ci') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaIdCard /> Carnet de Identidad *
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('ci') ? 'border-red-500' : ''}`}
            value={estudianteData.estudiante?.ci || ''}
            onChange={(e) => handleChange('estudiante', 'ci', e.target.value)}
            maxLength="8"
          />
          {tieneError('ci') && <p className="text-red-500 text-xs mt-1">{errores.ci}</p>}
        </div>
      )}
      
      {mostrarCampo('fecha_nacimiento') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaCalendarAlt /> Fecha de Nacimiento
          </label>
          <input
            type="date"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.estudiante?.fecha_nacimiento || ''}
            onChange={(e) => handleChange('estudiante', 'fecha_nacimiento', e.target.value)}
          />
        </div>
      )}
      
      {mostrarCampo('correo') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaEnvelope /> Correo Electrónico
          </label>
          <input
            type="email"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.estudiante?.correo || ''}
            onChange={(e) => handleChange('estudiante', 'correo', e.target.value)}
          />
        </div>
      )}
      
      {mostrarCampo('propietario_correo') && (
        <div>
          <label className="text-sm font-medium text-gray-700">
            El correo electrónico pertenece a:
          </label>
          <div className="flex flex-row space-x-4 mt-1">
            {["Estudiante", "Padre/Madre", "Profesor"].map((rol) => (
              <label key={rol} className="inline-flex items-center">
                <input
                  type="radio"
                  name="propietario_correo"
                  value={rol}
                  checked={estudianteData.estudiante?.propietario_correo === rol}
                  onChange={() => handleChange('estudiante', 'propietario_correo', rol)}
                  className="mr-1"
                />
                <span className="text-sm">{rol}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatosCompetidor;