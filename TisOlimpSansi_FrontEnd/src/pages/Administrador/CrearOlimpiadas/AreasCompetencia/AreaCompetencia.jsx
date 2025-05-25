import { useState } from "react";
import { FaCheck, FaLock, FaTrash, FaPlus } from "react-icons/fa";

const AreaCompetencia = ({
  combo,
  comboIndex,
  combinaciones,
  setCombinaciones,
  eliminarCombinacion,
  olimpiadaSeleccionada,
  modoAsociacion = true,
}) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Catálogo predefinido de categorías con sus rangos correspondientes
  const categoriasPredefinidasMap = {
    "1P": { nombre: "1P", desde: "1ro Primaria", hasta: "1ro Primaria" },
    "2P": { nombre: "2P", desde: "2do Primaria", hasta: "2do Primaria" },
    "3P": { nombre: "3P", desde: "3ro Primaria", hasta: "3ro Primaria" },
    "4P": { nombre: "4P", desde: "4to Primaria", hasta: "4to Primaria" },
    "5P": { nombre: "5P", desde: "5to Primaria", hasta: "5to Primaria" },
    "6P": { nombre: "6P", desde: "6to Primaria", hasta: "6to Primaria" },
    "1S": { nombre: "1S", desde: "1ro Secundaria", hasta: "1ro Secundaria" },
    "2S": { nombre: "2S", desde: "2do Secundaria", hasta: "2do Secundaria" },
    "3S": { nombre: "3S", desde: "3ro Secundaria", hasta: "3ro Secundaria" },
    "4S": { nombre: "4S", desde: "4to Secundaria", hasta: "4to Secundaria" },
    "5S": { nombre: "5S", desde: "5to Secundaria", hasta: "5to Secundaria" },
    "6S": { nombre: "6S", desde: "6to Secundaria", hasta: "6to Secundaria" },
    "PRIMER NIVEL": { nombre: "PRIMER NIVEL", desde: "1ro Secundaria", hasta: "1ro Secundaria" },
    "SEGUNDO NIVEL": { nombre: "SEGUNDO NIVEL", desde: "2do Secundaria", hasta: "2do Secundaria" },
    "TERCER NIVEL": { nombre: "TERCER NIVEL", desde: "3ro Secundaria", hasta: "3ro Secundaria" },
    "CUARTO NIVEL": { nombre: "CUARTO NIVEL", desde: "4to Secundaria", hasta: "4to Secundaria" },
    "QUINTO NIVEL": { nombre: "QUINTO NIVEL", desde: "5to Secundaria", hasta: "5to Secundaria" },
    "SEXTO NIVEL": { nombre: "SEXTO NIVEL", desde: "6to Secundaria", hasta: "6to Secundaria" },
    "GUACAMAYO": { nombre: "GUACAMAYO", desde: "5to Primaria", hasta: "6to Primaria" },
    "GUANACO": { nombre: "GUANACO", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
    "LONDRA": { nombre: "LONDRA", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
    "JUCUMARI": { nombre: "JUCUMARI", desde: "4to Secundaria", hasta: "6to Secundaria" },
    "BUFEO": { nombre: "BUFEO", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
    "PUMA": { nombre: "PUMA", desde: "4to Secundaria", hasta: "6to Secundaria" },
    "BUILDERS P": { nombre: "BUILDERS P", desde: "5to Primaria", hasta: "6to Primaria" },
    "BUILDERS S": { nombre: "BUILDERS S", desde: "1ro Secundaria", hasta: "6to Secundaria" },
    "LEGO P": { nombre: "LEGO P", desde: "5to Primaria", hasta: "6to Primaria" },
    "LEGO S": { nombre: "LEGO S", desde: "1ro Secundaria", hasta: "6to Secundaria" }
  };
  
  // Lista de categorías predefinidas para el selector
  const categoriasPredefinidas = Object.keys(categoriasPredefinidasMap);

  // Manejar la habilitación/deshabilitación del área
  const handleAreaToggle = (checked) => {
    if (!olimpiadaSeleccionada) {
      alert("Por favor seleccione una olimpiada primero");
      return;
    }
    
    if (modoAsociacion && combo.yaAsociada && !checked) {
      alert("En esta sección solo puedes asociar áreas. Para desasociar áreas, usa la sección 'Desasignar Áreas'");
      return;
    }
    
    if (!modoAsociacion && !combo.yaAsociada && checked) {
      alert("En esta sección solo puedes desasociar áreas. Para asociar áreas, usa la sección 'Asignar Áreas'");
      return;
    }
    
    console.log(`Cambiando estado del área ${combo.area} a: ${checked}`);
    
    const copia = [...combinaciones];
    copia[comboIndex] = {
      ...copia[comboIndex],
      habilitado: checked
    };
    setCombinaciones(copia);
  };

  // Mapeo de áreas a imágenes
  const getAreaImage = (area) => {
    const imageMap = {
      "Matemáticas": "/images/matematicaas.png",
      "Física": "/images/fisica.png",
      "Química": "/images/quimica.png",
      "Biología": "/images/biologia.png",
      "Informática": "/images/informatica.png",
      "Robótica": "/images/robotica.png",
      "Astronomía-Astrofísica": "/images/astronomia.png",
    };
    
    return imageMap[area] || "/placeholder.svg";
  };

  // Manejar la selección de categoría predefinida
  const handleCategoriaSelect = (index, nombreCategoria) => {
    const categoriaSeleccionada = categoriasPredefinidasMap[nombreCategoria];
    
    if (!categoriaSeleccionada) return;
    
    const copia = [...combinaciones];
    
    // Asegurarse de que exista el array de categorías
    if (!copia[comboIndex].categorias) {
      copia[comboIndex].categorias = [];
    }
    
    // Actualizar la categoría con los valores predefinidos
    copia[comboIndex].categorias[index] = {
      nombre: categoriaSeleccionada.nombre,
      desde: categoriaSeleccionada.desde,
      hasta: categoriaSeleccionada.hasta
    };
    
    setCombinaciones(copia);
  };

  // Agregar una nueva categoría predefinida
  const agregarCategoria = () => {
    const copia = [...combinaciones];
    
    // Inicializar el array de categorías si no existe
    if (!copia[comboIndex].categorias) {
      copia[comboIndex].categorias = [];
    }
    
    // Agregar la primera categoría predefinida por defecto
    const primerCategoria = categoriasPredefinidasMap[categoriasPredefinidas[0]];
    
    copia[comboIndex].categorias.push({
      nombre: primerCategoria.nombre,
      desde: primerCategoria.desde,
      hasta: primerCategoria.hasta
    });
    
    setCombinaciones(copia);
  };

  // Eliminar una categoría existente
  const eliminarCategoria = (index) => {
    const copia = [...combinaciones];
    copia[comboIndex].categorias.splice(index, 1);
    setCombinaciones(copia);
  };

  // Preparar categorías para renderizar
  const categorias = combo.categorias || [];
  const estaHabilitada = combo.habilitado || false;
  const sePuedeHabilitar = !!olimpiadaSeleccionada;
  const esInteractuable = sePuedeHabilitar && 
    (modoAsociacion ? !combo.yaAsociada : combo.yaAsociada);

  return (
    <div className={`relative bg-white p-4 rounded-lg mb-6 shadow-md transition-all duration-300 ${
      estaHabilitada ? 'border-l-4 border-blue-500' : 
      !sePuedeHabilitar ? 'border-l-4 border-gray-400 opacity-60' : 
      'border-l-4 border-gray-300 opacity-75'
    }`}>
      {!sePuedeHabilitar && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px] rounded-lg">
          <FaLock className="text-gray-500 text-3xl mb-2" />
          <p className="text-gray-600 text-center font-medium px-4">
            Seleccione una olimpiada para {modoAsociacion ? "asociar" : "desasociar"} áreas de competencia
          </p>
        </div>
      )}

      {sePuedeHabilitar && !esInteractuable && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px] rounded-lg">
          <FaLock className="text-gray-500 text-3xl mb-2" />
          <p className="text-gray-600 text-center font-medium px-4">
            {modoAsociacion 
              ? "Esta área ya está asociada. Para desasociarla, usa 'Desasignar Áreas'"
              : "Esta área no está asociada a esta olimpiada. Para asociarla, usa 'Asignar Áreas'"
            }
          </p>
        </div>
      )}
      
      <div className="flex items-start">
        {/* Imagen del área y selector circular */}
        <div className="w-40 mr-4 text-center relative">
          <img 
            src={getAreaImage(combo.area)} 
            alt={combo.area} 
            className="w-32 h-32 mx-auto mb-2 rounded-lg"
          />
          
          <div
            className={`absolute top-0 right-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              esInteractuable ? 'cursor-pointer' : 'cursor-not-allowed'
            } transition-colors ${
              estaHabilitada ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-white'
            }`}
            onClick={() => esInteractuable && handleAreaToggle(!estaHabilitada)}
          >
            {estaHabilitada && <FaCheck className="text-blue-600" />}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Título del área y estado */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">{combo.area}</h2>
            <div className="flex justify-center mt-1">
              {combo.yaAsociada ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Área asociada
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Área no asociada
                </span>
              )}
            </div>
          </div>

          {/* Categorías y rangos de grados */}
          <div className={`${!estaHabilitada ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700 border-b pb-1">
                Categorías y Rangos de Grados
              </h3>
              <button 
                onClick={() => setMostrarDetalles(!mostrarDetalles)}
                className={`text-sm px-3 py-1 rounded-full ${
                  mostrarDetalles ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                } hover:bg-blue-200 transition`}
              >
                {mostrarDetalles ? "Ocultar Categorías" : "Asociar Categorías"}
              </button>
            </div>

            {/* Categorías existentes */}
            {mostrarDetalles && (
              <div className="space-y-3 mb-4 mt-2">
                {categorias.length === 0 ? (
                  <p className="text-gray-500 italic text-center">No hay categorías definidas para esta área</p>
                ) : (
                  categorias.map((categoria, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1 flex flex-wrap gap-2">
                        {/* Selector de Categoría */}
                        <div className="w-full sm:w-auto flex-grow">
                          <label className="block text-xs text-gray-500 mb-1">Seleccionar categoría</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={categoria.nombre || ""}
                            onChange={(e) => handleCategoriaSelect(idx, e.target.value)}
                            disabled={!estaHabilitada}
                          >
                            {categoriasPredefinidas.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Visualización de rango inicial (no editable) */}
                        <div className="w-full sm:w-auto">
                          <label className="block text-xs text-gray-500 mb-1">Desde</label>
                          <div className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-gray-700">
                            {categoria.desde || "N/A"}
                          </div>
                        </div>
                        
                        {/* Visualización de rango final (no editable) */}
                        <div className="w-full sm:w-auto">
                          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                          <div className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-gray-700">
                            {categoria.hasta || "N/A"}
                          </div>
                        </div>
                      </div>
                      
                      {/* Botón eliminar categoría */}
                      {estaHabilitada && (
                        <button
                          onClick={() => eliminarCategoria(idx)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                          title="Eliminar categoría"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
                
                {/* Botón para agregar categoría predefinida */}
                {estaHabilitada && (
                  <button
                    onClick={agregarCategoria}
                    className="w-full mt-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    <FaPlus size={14} />
                    Agregar Categoría
                  </button>
                )}
              </div>
            )}
            
            {/* Resumen cuando no se muestran los detalles */}
            {!mostrarDetalles && (
              <div className="text-gray-600 text-sm">
                {categorias.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((cat, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {cat.nombre} ({cat.desde} - {cat.hasta})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="italic">No hay categorías asociadas. Haga clic en "Asociar Categorías" para agregar.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCompetencia;