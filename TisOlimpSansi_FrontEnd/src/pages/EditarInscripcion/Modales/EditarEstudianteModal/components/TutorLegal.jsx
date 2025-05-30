import React from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhone } from "react-icons/fa";

const TutorLegal = ({ 
  estudianteData, 
  handleChange,
  tieneError,
  errores,
  validarFormatoTelefono,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DE TUTOR LEGAL</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno
          </label>
          <input
            type="text"
            className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
            value={estudianteData.tutor_legal?.apellido_pa || ''}
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
            value={estudianteData.tutor_legal?.apellido_ma || ''}
            disabled={true}
          />
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaUser /> Nombres
        </label>
        <input
          type="text"
          className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
          value={estudianteData.tutor_legal?.nombre || ''}
          disabled={true}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaIdCard /> Carnet de Identidad
          </label>
          <input
            type="text"
            className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
            value={estudianteData.tutor_legal?.ci || ''}
            disabled={true}
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaPhone /> Teléfono
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('tutor_legal_telefono') ? 'border-red-500' : ''}`}
            value={estudianteData.tutor_legal?.numero_celular || ''}
            onChange={(e) => {
              const formattedValue = validarFormatoTelefono(e.target.value);
              handleChange('tutor_legal', 'numero_celular', formattedValue);
            }}
            pattern="\d{8}"
            title="El teléfono debe contener 8 dígitos"
          />
          {tieneError('tutor_legal_telefono') && <p className="text-red-500 text-xs mt-1">{errores.tutor_legal_telefono}</p>}
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaEnvelope /> Correo Electrónico
        </label>
        <input
          type="email"
          className={`mt-1 p-2 w-full border rounded-md ${tieneError('tutor_legal_correo') ? 'border-red-500' : ''}`}
          value={estudianteData.tutor_legal?.correo || ''}
          onChange={(e) => handleChange('tutor_legal', 'correo', e.target.value)}
        />
        {tieneError('tutor_legal_correo') && <p className="text-red-500 text-xs mt-1">{errores.tutor_legal_correo}</p>}
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Rol:</label>
        <div className="flex flex-row space-x-4 mt-1">
          {["Padre", "Madre", "Tutor Legal"].map((rol) => (
            <label key={rol} className="inline-flex items-center">
              <input
                type="radio"
                name="tipo_tutor"
                value={rol}
                checked={estudianteData.tutor_legal?.tipo === rol}
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

export default TutorLegal;