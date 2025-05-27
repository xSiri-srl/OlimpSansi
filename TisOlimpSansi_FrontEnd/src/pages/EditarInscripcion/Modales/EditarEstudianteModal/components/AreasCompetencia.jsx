import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AreasCompetencia = ({ 
  estudianteData, 
  areasActuales,
  handleChange, 
  tieneError, 
  errores 
}) => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/areasCategoriasOlimpiada?id=${estudianteData.id_olimpiada}`);
        setAreas(response.data);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      }
    };

    cargarAreas();
  }, []);


  const obtenerCategorias = (areaNombre) => {
    if (!Array.isArray(areas)) {
      console.warn("La variable 'areas' no es un array:", areas);
      return ["Categoría no disponible para esta área"];
    }

    const area = areas.find(a => a.nombre_area === areaNombre);
    if (!area || !Array.isArray(area.categorias)) {
      return ["Categoría no disponible para esta área"];
    }

    return area.categorias.map(cat => cat.nombre_categoria);
  };

  
  const handleCategoriaChange = (e, sectionIndex) => {
    const selectedCategory = e.target.value;
    handleChange(`area_${sectionIndex}`, 'categoria', selectedCategory);
  };

  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">ÁREA DE COMPETENCIA</h4>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Área de competencia 
          </label>
          <div className="flex gap-2">
            <select
              className={`mt-1 p-2 w-full border rounded-md ${tieneError('areas') ? 'border-red-500 bg-red-50' : ''}`}
              value={areasActuales[0]?.nombre_area || ''}
              onChange={(e) => handleChange('area_0', 'nombre_area', e.target.value)}
            >
              <option value="">Seleccione un área</option>
              {areas.map((area) => (
                <option key={area.nombre_area} value={area.nombre_area}>
                  {area.nombre_area}
                </option>
              ))}
            </select>
          </div>
          {tieneError('areas') && <p className="text-red-500 text-xs mt-1">{errores.areas}</p>}
        </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Categoría para {areasActuales[0].nombre_area} 
            </label>
            <select
              className={`mt-1 p-2 w-full border rounded-md ${tieneError('categoria_0') ? 'border-red-500 bg-red-50' : ''}`}
              value={areasActuales[0].categoria || ''}
              onChange={(e) => handleCategoriaChange(e, 0)}
            >
              <option value="">Seleccione una categoría</option>
              {obtenerCategorias(areasActuales[0].nombre_area, estudianteData.colegio?.curso || '').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {tieneError('categoria_0') && <p className="text-red-500 text-xs mt-1 font-medium">{errores.categoria_0}</p>}
          </div>
      </div>
    </div>
  );
};

export default AreasCompetencia;