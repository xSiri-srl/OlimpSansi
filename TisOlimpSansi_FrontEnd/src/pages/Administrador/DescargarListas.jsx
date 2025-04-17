import React, { useState } from 'react';

const datos = {
  astronomia: [
    '3P - 3ro Primaria',
    '4P - 4to Primaria',
    '5P - 5to Primaria',
    '6P - 6to Primaria',
    '1S - 1ro Secundaria',
    '2S - 2do Secundaria',
    '3S - 3ro Secundaria',
    '4S - 4to Secundaria',
    '5S - 5to Secundaria',
    '6S - 6to Secundaria',
  ],
  astrofisica: [
    '3P - 3ro Primaria',
    '4P - 4to Primaria',
    '5P - 5to Primaria',
    '6P - 6to Primaria',
    '1S - 1ro Secundaria',
    '2S - 2do Secundaria',
    '3S - 3ro Secundaria',
    '4S - 4to Secundaria',
    '5S - 5to Secundaria',
    '6S - 6to Secundaria',
  ],
  biologia: [
    '2S - 2do Secundaria',
    '3S - 3ro Secundaria',
    '4S - 4to Secundaria',
    '5S - 5to Secundaria',
    '6S - 6to Secundaria',
  ],
  fisica: [
    '4S - 4to Secundaria',
    '5S - 5to Secundaria',
    '6S - 6to Secundaria',
  ],
  informatica: [
    'Guacamayo - 5to a 6to Primaria',
    'Guanaco - 1ro a 3ro Secundaria',
    'Londra - 1ro a 3ro Secundaria',
    'Jucumari - 4to a 6to Secundaria',
    'Bufeo - 1ro a 3ro Secundaria',
    'Puma - 4to a 6to Secundaria',
  ],
  matematicas: [
    'Primer Nivel - 1ro Secundaria',
    'Segundo Nivel - 2do Secundaria',
    'Tercer Nivel - 3ro Secundaria',
    'Cuarto Nivel - 4to Secundaria',
    'Quinto Nivel - 5to Secundaria',
    'Sexto Nivel - 6to Secundaria',
  ],
  quimica: [
    '2S - 2do Secundaria',
    '3S - 3ro Secundaria',
    '4S - 4to Secundaria',
    '5S - 5to Secundaria',
    '6S - 6to Secundaria',
  ],
  robotica: [
    'Builders P - 5to a 6to Primaria',
    'Builders S - 1ro a 6to Secundaria',
    'Lego P - 5to a 6to Primaria',
    'Lego S - 1ro a 6to Secundaria',
  ],
};

function DescargarListas() {
  const [area, setArea] = useState('');
  const categorias = datos[area] || [];

  return (
    <div>
      <h1 className="text-sky-950 font-bold text-3xl mb-6 p-6 text-center">
        Descargar lista de inscritos
      </h1>

      <div className="w-full max-w-4xl mx-auto bg-sky-50 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Área */}
          <div className="flex-1">
            <label htmlFor="area" className="block mb-2 text-sm font-semibold text-gray-700">
              Área 
            </label>
            <select
              id="area"
              name="area"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {Object.keys(datos).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Curso */}
          <div className="flex-1">
            <label htmlFor="curso" className="block mb-2 text-sm font-semibold text-gray-700">
              Curso
            </label>
            <select
              id="curso"
              name="curso"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            >
              <option value="">-- Selecciona --</option>
              {[...new Set(categorias.map(cat => cat.split(' - ')[1]))].map((curso, index) => (
                <option key={index} value={curso}>{curso}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div className="flex-1">
            <label htmlFor="categoria" className="block mb-2 text-sm font-semibold text-gray-700">
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            >
              <option value="">-- Selecciona --</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat.split(' - ')[0]}>
                  {cat.split(' - ')[0]}
                </option>
              ))}
            </select>
          </div>
          
       {/* colegio */}
       <div className="flex-1">
      <label htmlFor="colegio" className="block mb-2 text-sm font-semibold text-gray-700">
       Colegio
      </label>
      <select
        id="colegio"
        name="colegio"
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
      >
        <option value="">-- Selecciona --</option>
        <option value="col1">San Agustin</option>
        <option value="col2">San Jose</option>
        
      </select>
      </div>
      <div className="flex-1">
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
    Fecha
  </label>
  <input
    type="date"
    name="fechaNacimiento"
    className="p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700"
  />
</div>

        </div>
      </div>

    </div>
  );
}

export default DescargarListas;
