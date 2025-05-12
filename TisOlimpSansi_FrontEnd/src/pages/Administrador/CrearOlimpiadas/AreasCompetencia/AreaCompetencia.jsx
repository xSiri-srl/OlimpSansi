import { useState } from "react";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const AreaCompetencia = ({
  combo,
  comboIndex,
  combinaciones,
  obtenerOpcionesPorArea,
  setCombinaciones,
  eliminarCombinacion,
  olimpiadaSeleccionada,
}) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Manejar la habilitación/deshabilitación del área
const handleAreaToggle = (checked) => {
  // No permitir cambios si no hay olimpiada seleccionada
  if (!olimpiadaSeleccionada) {
    alert("Por favor seleccione una olimpiada primero");
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

  // Manejar cambios en el costo de inscripción
  const handleCostoInscripcionChange = (e) => {
    const copia = [...combinaciones];
    copia[comboIndex].costoInscripcion = e.target.value;
    setCombinaciones(copia);
  };

  // Mapeo de áreas a imágenes (método existente)
  const getAreaImage = (area) => {
    const imageMap = {
      "Astronomía-Astrofísica": "/img/areas/astronomia.jpg",
      "Biología": "/img/areas/biologia.jpg",
      "Física": "/img/areas/fisica.jpg",
      "Informática": "/img/areas/informatica.jpg",
      "Matemáticas": "/img/areas/matematicas.jpg",
      "Química": "/img/areas/quimica.jpg",
      "Robótica": "/img/areas/robotica.jpg",
    };
    return imageMap[area] || "/img/areas/default.jpg";
  };

  // Renderizar los niveles según el área
  const renderNivelesAreas = () => {
    if (!combo.niveles || combo.niveles.length === 0) {
      return <p className="text-gray-500">No hay niveles definidos</p>;
    }

    return (
      <div className="mt-2">
        <h4 className="font-medium text-gray-700 mb-1">Niveles/Categorías:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {combo.niveles.map((nivel, index) => (
            <div 
              key={index} 
              className="bg-white p-2 rounded border border-gray-200 text-sm flex items-center"
            >
              <span className="font-medium mr-1">{nivel.nivel}:</span> {nivel.grado}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`mb-4 p-4 rounded-lg shadow-sm transition-all ${combo.habilitado ? 'bg-white border-l-4 border-green-500' : 'bg-gray-50 border-l-4 border-gray-300'}`}>
      <div className="flex items-start">
        {/* Imagen del área */}
        <div className="w-20 h-20 flex-shrink-0 mr-4">
          <img 
            src={getAreaImage(combo.area)} 
            alt={combo.area} 
            className={`w-full h-full object-cover rounded-lg ${!combo.habilitado && 'opacity-60 grayscale'}`}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-bold ${combo.habilitado ? 'text-gray-800' : 'text-gray-500'}`}>
              {combo.area}
            </h3>
            
            <div className="flex items-center space-x-2">
              {/* Switch para habilitar/deshabilitar */}
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name={`toggle${comboIndex}`}
                  id={`toggle${comboIndex}`}
                  className="hidden"
                  checked={combo.habilitado}
                  onChange={(e) => handleAreaToggle(e.target.checked)}
                  disabled={!olimpiadaSeleccionada}
                />
                <label
                  htmlFor={`toggle${comboIndex}`}
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                    combo.habilitado ? "bg-green-500" : "bg-gray-300"
                  } ${!olimpiadaSeleccionada ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full transform transition-transform ${
                      combo.habilitado ? "translate-x-6 bg-white" : "translate-x-0 bg-white"
                    }`}
                  ></span>
                </label>
              </div>
              
              <span className={`text-sm font-medium ${combo.habilitado ? 'text-green-600' : 'text-gray-500'}`}>
                {combo.habilitado ? (
                  <span className="flex items-center">
                    <FaCheck className="mr-1" size={12} />
                    Habilitada
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaTimes className="mr-1" size={12} />
                    Deshabilitada
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Costo de inscripción */}
          <div className="mt-2 flex items-center">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Costo de inscripción (Bs.):
            </label>
            <input
              type="number"
              min="0"
              value={combo.costoInscripcion || ""}
              onChange={handleCostoInscripcionChange}
              className={`w-24 px-2 py-1 border rounded ${!combo.habilitado && 'bg-gray-100 text-gray-500'}`}
              placeholder="16"
              disabled={!combo.habilitado || !olimpiadaSeleccionada}
            />
          </div>

          {/* Mostrar/Ocultar detalles */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {mostrarDetalles ? "Ocultar detalles" : "Ver detalles"}
            </button>
          </div>

          {/* Detalles de niveles */}
          {mostrarDetalles && renderNivelesAreas()}
        </div>
      </div>
    </div>
  );
};

export default AreaCompetencia;