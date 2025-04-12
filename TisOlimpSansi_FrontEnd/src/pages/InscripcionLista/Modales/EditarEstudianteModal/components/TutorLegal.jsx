import React from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhone } from "react-icons/fa";

const TutorLegal = ({ 
  estudianteData, 
  handleChange
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DEL TUTOR LEGAL</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.tutor_legal?.apellido_pa || ''}
            onChange={(e) => handleChange('tutor_legal', 'apellido_pa', e.target.value.toUpperCase())}
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Materno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.tutor_legal?.apellido_ma || ''}
            onChange={(e) => handleChange('tutor_legal', 'apellido_ma', e.target.value.toUpperCase())}
          />
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaUser /> Nombres
        </label>
        <input
          type="text"
          className="mt-1 p-2 w-full border rounded-md"
          value={estudianteData.tutor_legal?.nombre || ''}
          onChange={(e) => handleChange('tutor_legal', 'nombre', e.target.value.toUpperCase())}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaIdCard /> Carnet de Identidad
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.tutor_legal?.ci || ''}
            onChange={(e) => handleChange('tutor_legal', 'ci', e.target.value)}
            maxLength="8"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaPhone /> Teléfono
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.tutor_legal?.numero_celular || ''}
            onChange={(e) => handleChange('tutor_legal', 'numero_celular', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaEnvelope /> Correo Electrónico
        </label>
        <input
          type="email"
          className="mt-1 p-2 w-full border rounded-md"
          value={estudianteData.tutor_legal?.correo || ''}
          onChange={(e) => handleChange('tutor_legal', 'correo', e.target.value)}
        />
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
                onChange={() => handleChange('tutor_legal', 'tipo', rol)}
                className="mr-1"
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