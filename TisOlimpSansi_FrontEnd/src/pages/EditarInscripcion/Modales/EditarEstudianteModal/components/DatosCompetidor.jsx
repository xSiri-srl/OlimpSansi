import React from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const DatosCompetidor = ({ 
  estudianteData, 
  handleChange, 
  tieneError,
  errores
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DE COMPETIDOR</h4>
      
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno 
          </label>
          <input
            type="text"
            className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
            value={estudianteData.estudiante?.apellido_pa || ''}
            disabled={true}
          />
        </div>
      
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Materno
          </label>
          <input
            type="text"
            className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
            value={estudianteData.estudiante?.apellido_ma || ''}
            disabled={true}
          />
        </div>
      
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUser /> Nombres 
            </label>
            <input
              type="text"
              className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
              value={estudianteData.estudiante?.nombre || ''}
            disabled={true}
            />
          </div>
      
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaIdCard /> Carnet de Identidad 
          </label>
          <input
            type="text"
            className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
            value={estudianteData.estudiante?.ci || ''}
            readOnly={true}
            pattern="\d{7,8}"
            title="El CI debe contener entre 7 y 8 dígitos"
          />
        </div>
      
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaCalendarAlt /> Fecha de Nacimiento
          </label>
          <input
            type="date"
            className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
            value={estudianteData.estudiante?.fecha_nacimiento?.split(' ')[0] || ''}
            disabled={true}
          />
        </div>
      
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaEnvelope /> Correo Electrónico
          </label>
          <input
            type="email"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('correo') ? 'border-red-500' : ''}`}
            value={estudianteData.estudiante?.correo || ''}
            onChange={(e) => handleChange('estudiante', 'correo', e.target.value)}
            maxLength={30}
          />
          {tieneError('correo') && (
            <p className="text-red-500 text-xs mt-1">{errores.correo}</p>
          )}
        </div>
      
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
                  disabled={true}
                  className={"mr-1 opacity-100"}
                />
                <span className="text-sm">{rol}</span>
              </label>
            ))}
          </div>
        </div>
    </div>
  );
};

export default DatosCompetidor;