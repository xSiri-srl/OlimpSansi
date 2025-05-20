import { useState } from "react";
import { FaCheck, FaLock, FaTimes, FaTrash, FaPlus } from "react-icons/fa";

const AreaCompetencia = ({
  combo,
  comboIndex,
  combinaciones,
  obtenerOpcionesPorArea,
  setCombinaciones,
  eliminarCombinacion,
  olimpiadaSeleccionada,
  modoAsociacion = true,
}) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  
  // Lista unificada de grados para todas las áreas
  const todosLosGrados = [
    "1ro Primaria", "2do Primaria", "3ro Primaria", "4to Primaria", "5to Primaria", "6to Primaria",
    "1ro Secundaria", "2do Secundaria", "3ro Secundaria", "4to Secundaria", "5to Secundaria", "6to Secundaria"
  ];

  // Manejar la habilitación/deshabilitación del área
  const handleAreaToggle = (checked) => {
    // No permitir cambios si no hay olimpiada seleccionada
    if (!olimpiadaSeleccionada) {
      alert("Por favor seleccione una olimpiada primero");
      return;
    }
    
    // Restricciones según modo (asociación/desasociación)
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

  // Manejar cambios en las categorías (nombre o rango)
  const handleCategoriaChange = (index, campo, valor) => {
    const copia = [...combinaciones];
    
    // Asegurarse de que exista el array de categorías
    if (!copia[comboIndex].categorias) {
      copia[comboIndex].categorias = [];
    }
    
    // Actualizar el campo específico de la categoría
    copia[comboIndex].categorias[index] = {
      ...copia[comboIndex].categorias[index],
      [campo]: valor
    };
    
    setCombinaciones(copia);
  };

  // Agregar una nueva categoría
  const agregarCategoria = () => {
    if (!nuevaCategoria.trim()) {
      alert("Por favor ingrese un nombre para la categoría");
      return;
    }
    
    const copia = [...combinaciones];
    
    // Inicializar el array de categorías si no existe
    if (!copia[comboIndex].categorias) {
      copia[comboIndex].categorias = [];
    }
    
    // Agregar la nueva categoría con valores predeterminados
    copia[comboIndex].categorias.push({
      nombre: nuevaCategoria,
      desde: todosLosGrados[0],
      hasta: todosLosGrados[0]
    });
    
    setCombinaciones(copia);
    setNuevaCategoria(""); // Limpiar el campo
  };

  // Eliminar una categoría existente
  const eliminarCategoria = (index) => {
    const copia = [...combinaciones];
    
    // Eliminar la categoría del array
    copia[comboIndex].categorias.splice(index, 1);
    
    setCombinaciones(copia);
  };

  // Inicializar categorías si no existen
  const inicializarCategorias = () => {
    const copia = [...combinaciones];
    
    if (!copia[comboIndex].categorias) {
      // Convertir los niveles o rangos existentes al nuevo formato unificado
      let categoriasIniciales = [];
      
      if (combo.niveles && combo.niveles.length > 0) {
        categoriasIniciales = combo.niveles.map(nivel => ({
          nombre: nivel.nivel,
          desde: nivel.grado,
          hasta: nivel.grado
        }));
      } else if (combo.rangos && combo.rangos.length > 0) {
        categoriasIniciales = combo.rangos.map(rango => ({
          nombre: rango.nivel,
          desde: rango.desde,
          hasta: rango.hasta
        }));
      }
      
      copia[comboIndex].categorias = categoriasIniciales;
      setCombinaciones(copia);
    }
  };

  // Asegurar que existan categorías inicializadas
  if (!combo.categorias && (combo.niveles || combo.rangos)) {
    inicializarCategorias();
  }

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

      {/* Mensaje cuando el área no es interactuable según el modo */}
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
                {mostrarDetalles ? "Ocultar Categorías" : "Ver Categorías"}
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
                        {/* Nombre de la categoría */}
                        <div className="w-full sm:w-auto flex-grow">
                          <label className="block text-xs text-gray-500 mb-1">Nombre categoría</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={categoria.nombre || ""}
                            onChange={(e) => handleCategoriaChange(idx, "nombre", e.target.value)}
                            disabled={!estaHabilitada}
                          />
                        </div>
                        
                        {/* Selector de grado inicial */}
                        <div className="w-full sm:w-auto">
                          <label className="block text-xs text-gray-500 mb-1">Desde</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={categoria.desde || todosLosGrados[0]}
                            onChange={(e) => handleCategoriaChange(idx, "desde", e.target.value)}
                            disabled={!estaHabilitada}
                          >
                            {todosLosGrados.map((grado) => (
                              <option key={`desde-${grado}`} value={grado}>{grado}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Selector de grado final */}
                        <div className="w-full sm:w-auto">
                          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={categoria.hasta || todosLosGrados[0]}
                            onChange={(e) => handleCategoriaChange(idx, "hasta", e.target.value)}
                            disabled={!estaHabilitada}
                          >
                            {todosLosGrados.map((grado) => (
                              <option key={`hasta-${grado}`} value={grado}>{grado}</option>
                            ))}
                          </select>
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
                
                {/* Formulario para agregar nueva categoría */}
                {estaHabilitada && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Agregar nueva categoría</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nombre de la categoría"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                      />
                      <button
                        onClick={agregarCategoria}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <FaPlus size={14} />
                        Agregar
                      </button>
                    </div>
                  </div>
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
                  <p className="italic">No hay categorías definidas. Haga clic en "Ver detalles" para agregar.</p>
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