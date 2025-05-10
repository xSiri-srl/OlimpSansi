import { useState } from "react";
import { FaTrash, FaCoins, FaPencilAlt } from "react-icons/fa";
import ModalCosto from "./ModalCosto";

const AreaCompetencia = ({
  combo,
  comboIndex,
  combinaciones,
  obtenerOpcionesPorArea,
  setCombinaciones,
  eliminarCombinacion,
}) => {
  const [modalCostoOpen, setModalCostoOpen] = useState(false);

  const actualizarCosto = (nuevoCosto) => {
    const copia = [...combinaciones];
    copia[comboIndex].costoInscripcion = nuevoCosto;
    setCombinaciones(copia);
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

  // Función para renderizar los niveles de Robótica
  const renderNivelesRobotica = () => {
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

  // Renderizar niveles para otras áreas
  const renderNivelesOtrasAreas = () => {
    return combo.niveles.map((nivel, nivelIndex) => (
      <div key={nivelIndex} className="flex items-center mb-2 space-x-4">
        <div className="flex items-center space-x-1 border-gray-300 rounded-lg p-2 w-[200px]">
          <input
            type="checkbox"
            id={`nivel-${comboIndex}-${nivelIndex}`}
            checked={combo.checkboxesNivel[nivelIndex]}
            onChange={(e) => {
              const copia = [...combinaciones];
              copia[comboIndex].checkboxesNivel[nivelIndex] = e.target.checked;
              setCombinaciones(copia);
            }}
          />
          <label htmlFor={`nivel-${comboIndex}-${nivelIndex}`}>
            {nivel.nivel}
          </label>
        </div>

        <div className="flex items-center space-x-1 ">
          <label htmlFor={`grado-${comboIndex}-${nivelIndex}`}>
            {nivel.grado}
          </label>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative bg-white p-4 rounded-lg mb-4 shadow border-l-4 border-blue-500">
      <button
        onClick={() => eliminarCombinacion(comboIndex)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Eliminar área"
      >
        <FaTrash />
      </button>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-blue-700">
          Área de Competencia
        </label>
        <div className="text-lg font-medium">{combo.area}</div>
      </div>

      {combo.costoInscripcion && (
        <div className="mb-3 flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex items-center">
            <FaCoins className="text-yellow-500 mr-2" />
            <span className="font-medium">Costo de inscripción: </span>
            <span className="ml-1 text-green-700 font-semibold">
              Bs. {combo.costoInscripcion}
            </span>
          </div>
          <button
            onClick={() => setModalCostoOpen(true)}
            className="text-blue-500 hover:text-blue-700"
            title="Editar costo"
          >
            <FaPencilAlt />
          </button>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-3 text-gray-700">
          Niveles y Rangos de Grados
        </h3>

        {combo.area === "Informática"
          ? renderNivelesInformatica()
          : combo.area === "Robótica"
          ? renderNivelesRobotica()
          : renderNivelesOtrasAreas()}
      </div>

      <div className="mb-3">
        <button
          onClick={() => setModalCostoOpen(true)}
          className={`text-sm flex items-center gap-1 ${
            combo.costoInscripcion
              ? "text-blue-500 hover:text-blue-700"
              : "bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-100"
          }`}
        >
          <FaCoins />
          {combo.costoInscripcion
            ? "Editar costo de inscripción"
            : "Agregar costo de inscripción"}
        </button>
      </div>

      <ModalCosto
        isOpen={modalCostoOpen}
        onClose={() => setModalCostoOpen(false)}
        onConfirm={actualizarCosto}
        costoActual={combo.costoInscripcion}
      />
    </div>
  );
};

export default AreaCompetencia;
