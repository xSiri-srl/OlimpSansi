import React from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const DatosCompetidor = ({ 
  estudianteData, 
  handleChange, 
  mostrarCampo, 
  tieneError, 
  campoEditable,
  errores,
  validarFormatoCI 
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DE COMPETIDOR</h4>
      
      {mostrarCampo('apellido_pa') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno 
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('apellido_pa') ? 'border-red-500' : ''} ${!campoEditable('apellido_pa') ? 'bg-gray-100' : ''}`}
            value={estudianteData.estudiante?.apellido_pa || ''}
            onChange={(e) => handleChange('estudiante', 'apellido_pa', e.target.value.toUpperCase())}
            readOnly={!campoEditable('apellido_pa') && !tieneError('apellido_pa')}
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
            className={`mt-1 p-2 w-full border rounded-md ${!campoEditable('apellido_ma') ? 'bg-gray-100' : ''}`}
            value={estudianteData.estudiante?.apellido_ma || ''}
            onChange={(e) => handleChange('estudiante', 'apellido_ma', e.target.value.toUpperCase())}
            readOnly={!campoEditable('apellido_ma') && !tieneError('apellido_ma')}
          />
          {tieneError('apellido_ma') && <p className="text-red-500 text-xs mt-1 font-medium">{errores.apellido_ma}</p>}
        </div>
      )}
      
      {mostrarCampo('nombre') && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUser /> Nombres 
            </label>
            <input
              type="text"
              className={`mt-1 p-2 w-full border rounded-md ${tieneError('nombre') ? 'border-red-500 bg-red-50' : ''} ${!campoEditable('nombre') && !tieneError('nombre') ? 'bg-gray-100' : ''}`}
              value={estudianteData.estudiante?.nombre || ''}
              onChange={(e) => handleChange('estudiante', 'nombre', e.target.value.toUpperCase())}
              readOnly={!campoEditable('nombre') && !tieneError('nombre')}
            />
            {tieneError('nombre') && <p className="text-red-500 text-xs mt-1 font-medium">{errores.nombre}</p>}
          </div>
      )}
      
      {mostrarCampo('ci') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaIdCard /> Carnet de Identidad 
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('ci') ? 'border-red-500' : ''} ${!campoEditable('ci') ? 'bg-gray-100' : ''}`}
            value={estudianteData.estudiante?.ci || ''}
            onChange={(e) => {
              const formattedValue = validarFormatoCI(e.target.value);
              handleChange('estudiante', 'ci', formattedValue);
            }}
            readOnly={!campoEditable('ci')}
            pattern="\d{7,8}"
            title="El CI debe contener entre 7 y 8 dígitos"
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
            className={`mt-1 p-2 w-full border rounded-md ${!campoEditable('fecha_nacimiento') ? 'bg-gray-100' : ''}`}
            value={estudianteData.estudiante?.fecha_nacimiento || ''}
            onChange={(e) => handleChange('estudiante', 'fecha_nacimiento', e.target.value)}
            readOnly={!campoEditable('fecha_nacimiento')}
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
            className={`mt-1 p-2 w-full border rounded-md ${!campoEditable('correo') ? 'bg-gray-100' : ''}`}
            value={estudianteData.estudiante?.correo || ''}
            onChange={(e) => handleChange('estudiante', 'correo', e.target.value)}
            readOnly={!campoEditable('correo')}
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
                  disabled={!campoEditable('propietario_correo')}
                  className={`mr-1 ${!campoEditable('propietario_correo') ? 'opacity-60' : ''}`}
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