import React from 'react';
import { FaUser, FaIdCard, FaEnvelope } from "react-icons/fa";

const TutorAcademico = ({ 
  estudianteData,
  handleChange,
  areaIndex,
  nombreArea,
  tieneError,
  errores,
  validarFormatoCI
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">
        TUTOR ACADÉMICO PARA {nombreArea}
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.tutores_academicos?.[areaIndex]?.tutor?.apellido_pa || ''}
            onChange={(e) => handleChange(`tutor_academico_${areaIndex}`, 'apellido_pa', e.target.value.toUpperCase())}
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Materno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.tutores_academicos?.[areaIndex]?.tutor?.apellido_ma || ''}
            onChange={(e) => handleChange(`tutor_academico_${areaIndex}`, 'apellido_ma', e.target.value.toUpperCase())}
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
          value={estudianteData.tutores_academicos?.[areaIndex]?.tutor?.nombre || ''}
          onChange={(e) => handleChange(`tutor_academico_${areaIndex}`, 'nombre', e.target.value.toUpperCase())}
        />
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaIdCard /> Carnet de Identidad
        </label>
        <input
          type="text"
          className={`mt-1 p-2 w-full border rounded-md ${tieneError(`tutor_academico_${areaIndex}_ci`) ? 'border-red-500' : ''}`}
          value={estudianteData.tutores_academicos?.[areaIndex]?.tutor?.ci || ''}
          onChange={(e) => {
            const formattedValue = validarFormatoCI(e.target.value);
            handleChange(`tutor_academico_${areaIndex}`, 'ci', formattedValue);
          }}
          pattern="\d{7,8}"
          title="El CI debe contener entre 7 y 8 dígitos"
        />
        {tieneError(`tutor_academico_${areaIndex}_ci`) && 
          <p className="text-red-500 text-xs mt-1">{errores[`tutor_academico_${areaIndex}_ci`]}</p>
        }
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaEnvelope /> Correo Electrónico
        </label>
        <input
          type="email"
          className="mt-1 p-2 w-full border rounded-md"
          value={estudianteData.tutores_academicos?.[areaIndex]?.tutor?.correo || ''}
          onChange={(e) => handleChange(`tutor_academico_${areaIndex}`, 'correo', e.target.value)}
        />
      </div>
    </div>
  );
};

export default TutorAcademico;