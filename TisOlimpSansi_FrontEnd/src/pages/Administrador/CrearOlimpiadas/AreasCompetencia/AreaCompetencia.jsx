import { useState } from "react";
import { FaCheck, FaLock, FaTimes } from "react-icons/fa";

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

  const handleRangoChange = (comboIndex, rangoKey, nuevoRango, tipo) => {
    setCombinaciones((prev) =>
      prev.map((combo, i) =>
        i === comboIndex
          ? {
              ...combo,
              rangos: {
                ...combo.rangos,
                [rangoKey]: {
                  ...combo.rangos[rangoKey],
                  [tipo]: nuevoRango,
                },
              },
            }
          : combo
      )
    );
  };

  const renderNivelesInformatica = () => {
    if (!combo.rangos || combo.rangos.length === 0) {
      return <p className="text-gray-500">No hay niveles definidos</p>;
    }
    
    return (
      <div className="space-y-4">
        {combo.rangos.map((nivel, idx) => (
          <div key={idx} className="flex items-center mb-2 space-x-4">
            <div className="flex items-center space-x-2">
              <label className="w-[200px] font-medium">{nivel.nivel}</label>

              <select
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={combo.rangos[nivel.nivel]?.desde || nivel.desde}
                onChange={(e) =>
                  handleRangoChange(
                    comboIndex,
                    nivel.nivel,
                    e.target.value,
                    "desde"
                  )
                }
                disabled={!combo.habilitado}
              >
                {obtenerOpcionesPorArea(combo.area).map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>

              <span className="mx-2">a</span>

              <select
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={combo.rangos[nivel.nivel]?.hasta || nivel.hasta}
                onChange={(e) =>
                  handleRangoChange(
                    comboIndex,
                    nivel.nivel,
                    e.target.value,
                    "hasta"
                  )
                }
                disabled={!combo.habilitado}
              >
                {obtenerOpcionesPorArea(combo.area).map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNivelesRobotica = () => {
    if (!combo.rangos || combo.rangos.length === 0) {
      return <p className="text-gray-500">No hay niveles definidos</p>;
    }
    
    return (
      <div className="space-y-4">
        {combo.rangos.map((nivel, idx) => (
          <div key={idx} className="flex items-center mb-2 space-x-4">
            <div className="flex items-center space-x-2">
              <label className="w-[200px] font-medium">{nivel.nivel}</label>

              <select
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={combo.rangos[nivel.nivel]?.desde || nivel.desde}
                onChange={(e) =>
                  handleRangoChange(
                    comboIndex,
                    nivel.nivel,
                    e.target.value,
                    "desde"
                  )
                }
                disabled={!combo.habilitado}
              >
                {obtenerOpcionesPorArea(combo.area).map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>

              <span className="mx-2">a</span>

              <select
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={combo.rangos[nivel.nivel]?.hasta || nivel.hasta}
                onChange={(e) =>
                  handleRangoChange(
                    comboIndex,
                    nivel.nivel,
                    e.target.value,
                    "hasta"
                  )
                }
                disabled={!combo.habilitado}
              >
                {obtenerOpcionesPorArea(combo.area).map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNivelesOtrasAreas = () => {
    if (!combo.niveles || combo.niveles.length === 0) {
      return <p className="text-gray-500">No hay niveles definidos</p>;
    }
    
    return (
      <div className="space-y-2">
        {combo.niveles.map((nivel, nivelIndex) => (
          <div key={nivelIndex} className="flex items-center mb-2 space-x-4">
            <div className="flex items-center space-x-1 border-gray-300 rounded-lg p-2 w-[200px]">
              <input
                type="checkbox"
                id={`nivel-${comboIndex}-${nivelIndex}`}
                checked={combo.checkboxesNivel ? combo.checkboxesNivel[nivelIndex] : true}
                disabled={!combo.habilitado}
                onChange={(e) => {
                  const copia = [...combinaciones];
                  if (!copia[comboIndex].checkboxesNivel) {
                    copia[comboIndex].checkboxesNivel = Array(combo.niveles.length).fill(true);
                  }
                  copia[comboIndex].checkboxesNivel[nivelIndex] = e.target.checked;
                  setCombinaciones(copia);
                }}
                className="mr-2"
              />
              <label htmlFor={`nivel-${comboIndex}-${nivelIndex}`}>
                {nivel.nivel}
              </label>
            </div>

            <div className="flex items-center space-x-1">
              <label htmlFor={`grado-${comboIndex}-${nivelIndex}`}>
                {nivel.grado}
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const estaHabilitada = combo.habilitado || false;
  const sePuedeHabilitar = !!olimpiadaSeleccionada;

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
            Seleccione una olimpiada para asociar áreas de competencia
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
              sePuedeHabilitar ? 'cursor-pointer' : 'cursor-not-allowed'
            } transition-colors ${
              estaHabilitada ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-white'
            }`}
            onClick={() => sePuedeHabilitar && handleAreaToggle(!estaHabilitada)}
          >
            {estaHabilitada && <FaCheck className="text-blue-600" />}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Título del área y estado */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">{combo.area}</h2>
            <p className={`text-sm ${
              estaHabilitada ? 'text-green-600' : 
              !sePuedeHabilitar ? 'text-gray-400' : 
              'text-gray-500'
            }`}>
              {estaHabilitada ? 
                'Área asociada' : 
                !sePuedeHabilitar ? 'Seleccione una olimpiada' : 
                'Área no asociada'
              }
            </p>
          </div>

          {/* Costo de inscripción */}
          <div className="mt-2 flex items-center justify-center mb-4">
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

          {/* Niveles y rangos */}
          <div className={`${!estaHabilitada ? 'opacity-50' : ''}`}>
            <h3 className="font-semibold mb-3 text-gray-700 border-b pb-1">
              Niveles y Rangos de Grados
            </h3>

            {combo.area === "Informática"
              ? renderNivelesInformatica()
              : combo.area === "Robótica"
              ? renderNivelesRobotica()
              : renderNivelesOtrasAreas()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCompetencia;