import React, { useState } from 'react';

const FormularioTutoresAcademicos = ({ areasSeleccionadas = ["Física", "Matemáticas", "Química"] }) => {
  const [tutoresPorArea, setTutoresPorArea] = useState({});
  
  const handleCheckboxChange = (area) => {
    setTutoresPorArea(prev => ({
      ...prev,
      [area]: prev[area] ? null : {
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombres: '',
        carnetIdentidad: '',
        correoElectronico: ''
      }
    }));
  };
  
  const handleFormChange = (area, field, value) => {
    setTutoresPorArea(prev => ({
      ...prev,
      [area]: {
        ...prev[area],
        [field]: value
      }
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registro de Tutores Académicos</h2>
        <p className="text-center text-gray-600">
          Por favor, seleccione las áreas para las que desea registrar un tutor académico.
        </p>
      </div>
      
      {/* Mapeo de cada área seleccionada */}
      {areasSeleccionadas.map((area, index) => (
        <div key={index} className="mb-8 p-4 border rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              checked={!!tutoresPorArea[area]}
              onChange={() => handleCheckboxChange(area)}
              className="mr-3 h-5 w-5"
            />
            <label htmlFor={`checkbox-${index}`} className="text-lg font-medium">
              ¿Desea registrar un tutor académico para {area}?
            </label>
          </div>
          
          {tutoresPorArea[area] && (
            <div className="pl-8 mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Profesor de {area}</h3>
              <p className="mb-4 text-gray-600">Por favor, completa los datos del tutor académico.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 font-medium">
                    <span className="inline-block mr-2">
                      <i className="fas fa-user"></i>
                    </span>
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Apellido Paterno"
                    value={tutoresPorArea[area].apellidoPaterno}
                    onChange={(e) => handleFormChange(area, 'apellidoPaterno', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">
                    <span className="inline-block mr-2">
                      <i className="fas fa-user"></i>
                    </span>
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Apellido Materno"
                    value={tutoresPorArea[area].apellidoMaterno}
                    onChange={(e) => handleFormChange(area, 'apellidoMaterno', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  <span className="inline-block mr-2">
                    <i className="fas fa-user"></i>
                  </span>
                  Nombres
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Nombres"
                  value={tutoresPorArea[area].nombres}
                  onChange={(e) => handleFormChange(area, 'nombres', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  <span className="inline-block mr-2">
                    <i className="fas fa-id-card"></i>
                  </span>
                  Carnet de Identidad
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Número de Carnet de Identidad"
                  value={tutoresPorArea[area].carnetIdentidad}
                  onChange={(e) => handleFormChange(area, 'carnetIdentidad', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  <span className="inline-block mr-2">
                    <i className="fas fa-envelope"></i>
                  </span>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Correo Electrónico"
                  value={tutoresPorArea[area].correoElectronico}
                  onChange={(e) => handleFormChange(area, 'correoElectronico', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="flex justify-between mt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded">
          Atrás
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default FormularioTutoresAcademicos;