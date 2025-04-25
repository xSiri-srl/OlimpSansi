import React from 'react';

const AreasCompetencia = ({ 
  estudianteData, 
  areasActuales,
  handleChange, 
  mostrarCampo, 
  tieneError, 
  errores 
}) => {
  const areas = [
    "Matemáticas",
    "Física",
    "Química",
    "Biología",
    "Informática",
    "Robótica",
    "Astronomía y Astrofísica"
  ];

  const categoryMapping = {

    "GUACAMAYO": "\"Guacamayo\" 5to a 6to Primaria",
    "GUANACO": "\"Guanaco\" 1ro a 3ro Secundaria",
    "LONDRA": "\"Londra\" 1ro a 3ro Secundaria",
    "BUFEO": "\"Bufeo\" 1ro a 3ro Secundaria",
    "JUCUMARI": "\"Jucumari\" 4to a 6to Secundaria",
    "PUMA": "\"Puma\" 4to a 6to Secundaria",
    
    "BUILDERS P": "\"Builders P\" 5to a 6to Primaria",
    "LEGO P": "\"Lego P\" 5to a 6to Primaria",
    "BUILDERS S": "\"Builders S\" 1ro a 6to Secundaria",
    "LEGO S": "\"Lego S\" 1ro a 6to Secundaria"
  };

  const inverseCategoryMapping = Object.entries(categoryMapping).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  useEffect(() => {
    if (areasActuales?.length > 0) {
      areasActuales.forEach((area, index) => {
        if ((area.nombre_area === "Informática" || area.nombre_area === "Robótica") && 
            area.categoria && !area.categoria.includes("\"")) {
          
          const upperCaseCategory = area.categoria.toUpperCase();
          const fullCategory = Object.keys(categoryMapping).find(key => 
            upperCaseCategory.includes(key) || key.includes(upperCaseCategory)
          );
          
          if (fullCategory && categoryMapping[fullCategory]) {
            handleChange(`area_${index}`, 'categoria', categoryMapping[fullCategory]);
          }
        }
      });
    }
  }, [areasActuales]);

  const obtenerCategorias = (area, curso) => {
    if (area !== "Informática" && area !== "Robótica") {
      return [];
    }
    
    const esPrimaria = curso?.includes("Primaria");
    const esSecundaria = curso?.includes("Secundaria");
    const numero = parseInt(curso?.match(/\d+/)?.[0] || "0");
    
    if (area === "Informática") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return ["\"Guacamayo\" 5to a 6to Primaria"];
      } else if (esSecundaria && numero >= 1 && numero <= 3) {
        return [
          "\"Guanaco\" 1ro a 3ro Secundaria", 
          "\"Londra\" 1ro a 3ro Secundaria",
          "\"Bufeo\" 1ro a 3ro Secundaria"
        ];
      } else if (esSecundaria && numero >= 4 && numero <= 6) {
        return [
          "\"Jucumari\" 4to a 6to Secundaria",
          "\"Puma\" 4to a 6to Secundaria"
        ];
      }
    }
    
    if (area === "Robótica") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return [
          "\"Builders P\" 5to a 6to Primaria",
          "\"Lego P\" 5to a 6to Primaria"
        ];
      } else if (esSecundaria) {
        return [
          "\"Builders S\" 1ro a 6to Secundaria",
          "\"Lego S\" 1ro a 6to Secundaria"
        ];
      }
    }
    
    return ["Categoría no disponible para este curso"];
  };
  
  const convertirCategoriaAFormatoOriginal = (categoriaUI) => {
    if (inverseCategoryMapping[categoriaUI]) {
      return inverseCategoryMapping[categoriaUI];
    }
    

    const match = categoriaUI.match(/\"([^\"]+)\"/);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }
    
    return categoriaUI;
  };
  
  const handleCategoriaChange = (e, sectionIndex) => {
    const selectedCategory = e.target.value;
    handleChange(`area_${sectionIndex}`, 'categoria', selectedCategory);

    const originalFormat = convertirCategoriaAFormatoOriginal(selectedCategory);
    console.log(`Categoría UI: ${selectedCategory} -> Original: ${originalFormat}`);
    handleChange(`area_${sectionIndex}`, 'categoria_original', originalFormat);
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">ÁREAS DE COMPETENCIA</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Área de competencia 1 *
          </label>
          <div className="flex gap-2">
            <select
              className={`mt-1 p-2 w-full border rounded-md ${tieneError('areas') ? 'border-red-500' : ''}`}
              value={areasActuales[0]?.nombre_area || ''}
              onChange={(e) => handleChange('area_0', 'nombre_area', e.target.value)}
            >
              <option value="">Seleccione un área</option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          {tieneError('areas') && <p className="text-red-500 text-xs mt-1">{errores.areas}</p>}
        </div>
        
        {(areasActuales[0]?.nombre_area === "Informática" || 
          areasActuales[0]?.nombre_area === "Robótica") && (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Categoría para {areasActuales[0].nombre_area} *
            </label>
            <select
              className={`mt-1 p-2 w-full border rounded-md ${tieneError('categoria_0') ? 'border-red-500' : ''}`}
              value={areasActuales[0].categoria || ''}
              onChange={(e) => handleCategoriaChange(e, 0)}
              disabled={!campoEditable('categoria_0') && !tieneError('categoria_0')}
            >
              <option value="">Seleccione una categoría</option>
              {obtenerCategorias(areasActuales[0].nombre_area, estudianteData.colegio?.curso || '').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {tieneError('categoria_0') && <p className="text-red-500 text-xs mt-1">{errores.categoria_0}</p>}
          </div>
        )}
        
        {/* Segunda área (opcional) */}
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700">
            Área de competencia 2 (opcional)
          </label>
          <select
            className="mt-1 p-2 w-full border rounded-md"
            value={areasActuales[1]?.nombre_area || ''}
            onChange={(e) => handleChange('area_1', 'nombre_area', e.target.value)}
          >
            <option value="">Seleccione un área (opcional)</option>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        
        {(areasActuales[1]?.nombre_area === "Informática" || 
          areasActuales[1]?.nombre_area === "Robótica") && (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Categoría para {areasActuales[1].nombre_area} *
            </label>
            <select
              className={`mt-1 p-2 w-full border rounded-md ${tieneError('categoria_1') ? 'border-red-500' : ''}`}
              value={areasActuales[1].categoria || ''}
              onChange={(e) => handleCategoriaChange(e, 1)}
              disabled={!campoEditable('categoria_1') && !tieneError('categoria_1')}
            >
              <option value="">Seleccione una categoría</option>
              {obtenerCategorias(areasActuales[1].nombre_area, estudianteData.colegio?.curso || '').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {tieneError('categoria_1') && <p className="text-red-500 text-xs mt-1">{errores.categoria_1}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreasCompetencia;