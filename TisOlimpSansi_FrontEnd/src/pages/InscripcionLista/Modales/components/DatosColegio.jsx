import React from 'react';
import { FaSchool, FaBuilding, FaMapMarkedAlt } from "react-icons/fa";

const DatosColegio = ({ 
  estudianteData, 
  handleChange, 
  handleDepartamentoChange,
  mostrarCampo, 
  tieneError, 
  errores 
}) => {
  const departamentos = {
    "La Paz": ["Murillo", "Pacajes", "Los Andes", "Larecaja", "Ingavi"],
    Cochabamba: ["Cercado", "Quillacollo", "Chapare", "Arani", "Ayopaya"],
    "Santa Cruz": ["Andrés Ibáñez", "Warnes", "Ichilo", "Sara", "Vallegrande"],
    Oruro: ["Cercado", "Sajama", "Sabaya", "Litoral", "Pantaleón Dalence"],
    Potosí: ["Tomás Frías", "Charcas", "Chayanta", "Nor Chichas", "Sur Chichas"],
    Chuquisaca: ["Oropeza", "Zudáñez", "Tomina", "Belisario Boeto", "Nor Cinti"],
    Tarija: ["Cercado", "Gran Chaco", "O'Connor", "Avilés", "Arce"],
    Beni: ["Cercado", "Moxos", "Vaca Díez", "Marbán", "Yacuma"],
    Pando: ["Madre de Dios", "Manuripi", "Nicolás Suárez", "Abuná", "Federico Román"],
  };

  const cursos = [
    "3ro de Primaria",
    "4to de Primaria",
    "5to de Primaria",
    "6to de Primaria",
    "1ro de Secundaria",
    "2do de Secundaria",
    "3ro de Secundaria",
    "4to de Secundaria",
    "5to de Secundaria",
    "6to de Secundaria",
  ];
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DEL COLEGIO</h4>
      
      {mostrarCampo('nombre_colegio') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaSchool /> Nombre del Colegio *
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('nombre_colegio') ? 'border-red-500' : ''}`}
            value={estudianteData.colegio?.nombre_colegio || ''}
            onChange={(e) => handleChange('colegio', 'nombre_colegio', e.target.value.toUpperCase())}
          />
          {tieneError('nombre_colegio') && <p className="text-red-500 text-xs mt-1">{errores.nombre_colegio}</p>}
        </div>
      )}
      
      {mostrarCampo('curso') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaBuilding /> Curso *
          </label>
          <select
            className={`mt-1 p-2 w-full border rounded-md ${tieneError('curso') ? 'border-red-500' : ''}`}
            value={estudianteData.colegio?.curso || ''}
            onChange={(e) => handleChange('colegio', 'curso', e.target.value)}
          >
            <option value="">Seleccione un Curso</option>
            {cursos.map((curso) => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
          {tieneError('curso') && <p className="text-red-500 text-xs mt-1">{errores.curso}</p>}
        </div>
      )}
      
      {mostrarCampo('departamento') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaMapMarkedAlt /> Departamento
          </label>
          <select
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.colegio?.departamento || ''}
            onChange={(e) => handleDepartamentoChange(e.target.value)}
          >
            <option value="">Seleccione un Departamento</option>
            {Object.keys(departamentos).map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      )}
      
      {mostrarCampo('provincia') && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaMapMarkedAlt /> Provincia
          </label>
          <select
            className="mt-1 p-2 w-full border rounded-md"
            value={estudianteData.colegio?.provincia || ''}
            onChange={(e) => handleChange('colegio', 'provincia', e.target.value)}
            disabled={!estudianteData.colegio?.departamento}
          >
            <option value="">Seleccione una Provincia</option>
            {(departamentos[estudianteData.colegio?.departamento] || []).map((provincia) => (
              <option key={provincia} value={provincia}>{provincia}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DatosColegio;