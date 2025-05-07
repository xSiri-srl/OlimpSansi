import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const SelectorAreaNivel = () => {
  const [combinaciones, setCombinaciones] = useState([
    { area: "", niveles: [""] },
  ]);
  const [areasPersonalizadas, setAreasPersonalizadas] = useState([]);
  const [nivelesPersonalizados, setNivelesPersonalizados] = useState([]);

  const [areas, setAreas] = useState(["Matemática", "Programación", "Física"]);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([
    "3P",
    "4P",
    "5P",
    "1S",
    "2S",
    "3S",
    "4S",
    "5S",
    "6S",
  ]);

  const agregarCombinacion = () => {
    setCombinaciones([...combinaciones, { area: "", niveles: [""] }]);
  };

  const eliminarCombinacion = (index) => {
    const nuevaLista = combinaciones.filter((_, i) => i !== index);
    setCombinaciones(nuevaLista);
  };

  const manejarCambioArea = (index, valor) => {
    const copia = [...combinaciones];
    copia[index].area = valor;
    setCombinaciones(copia);
  };

  const manejarCambioNivel = (index, nivelIndex, valor) => {
    const copia = [...combinaciones];
    copia[index].niveles[nivelIndex] = valor;
    setCombinaciones(copia);
  };

  const agregarNivel = (index) => {
    const copia = [...combinaciones];
    copia[index].niveles.push("");
    setCombinaciones(copia);
  };

  const eliminarNivel = (areaIndex, nivelIndex) => {
    const copia = [...combinaciones];
    copia[areaIndex].niveles = copia[areaIndex].niveles.filter(
      (_, i) => i !== nivelIndex
    );
    setCombinaciones(copia);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center mb-2">
        Asociar área/nivel a la Olimpiada
      </h1>
      <p className="text-sm text-center mb-4">
        Seleccione las áreas y niveles que tendrá la olimpiada -TAL-
      </p>
      <div className="bg-gray-200 p-2 rounded w-full max-w-3xl mx-auto">
        {combinaciones.map((combo, index) => (
          <div key={index} className="relative bg-blue-200 p-3 rounded mb-4">
            {/* Botón para eliminar combinación */}
            <button
              onClick={() => eliminarCombinacion(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Eliminar combinación"
            >
              <FaTrash />
            </button>

            {/* Tabla para alinear área y niveles */}
            <div className="w-full">
              {/* Cabeceras */}
              <div className="flex mb-1">
                <div className="w-1/2">
                  <label className="block font-semibold">Área</label>
                </div>
                <div className="w-1/2">
                  <label className="block font-semibold">Nivel</label>
                </div>
              </div>

              {/* Área y primer nivel */}
              <div className="flex mb-2">
                <div className="w-1/2 pr-2">
                  {combo.area !== "Otra" ? (
                    <select
                      value={combo.area}
                      onChange={(e) => manejarCambioArea(index, e.target.value)}
                      className="px-3 py-2 border rounded w-full"
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                      <option value="Otra">Otra...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Ingrese nueva área"
                      onBlur={(e) => {
                        const nueva = e.target.value.trim();
                        if (nueva && !areas.includes(nueva)) {
                          setAreas([...areas, nueva]);
                          manejarCambioArea(index, nueva);
                        }
                      }}
                      className="px-3 py-2 border rounded w-full"
                    />
                  )}
                </div>

                <div className="w-1/2 flex items-center">
                  {combo.niveles[0] !== "Otro" ? (
                    <select
                      value={combo.niveles[0]}
                      onChange={(e) =>
                        manejarCambioNivel(index, 0, e.target.value)
                      }
                      className="px-3 py-2 border rounded w-full"
                    >
                      <option value="">Seleccione un nivel</option>
                      {nivelesDisponibles.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                      <option value="Otro">Otro...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Ingrese nuevo nivel"
                      onBlur={(e) => {
                        const nuevo = e.target.value.trim();
                        if (nuevo && !nivelesDisponibles.includes(nuevo)) {
                          setNivelesDisponibles([...nivelesDisponibles, nuevo]);
                          manejarCambioNivel(index, 0, nuevo);
                        }
                      }}
                      className="px-3 py-2 border rounded w-full"
                    />
                  )}
                  <button
                    onClick={() => agregarNivel(index)}
                    className="flex-shrink-0 ml-2 bg-white border rounded-full p-1 hover:bg-gray-100"
                    title="Agregar nivel"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Niveles adicionales */}
              {combo.niveles.slice(1).map((nivel, nivelIndex) => (
                <div key={nivelIndex + 1} className="flex mb-2">
                  <div className="w-1/2 pr-2">
                    {/* Espacio en blanco para alineación */}
                  </div>
                  <div className="w-1/2 flex items-center">
                    <div className="w-full">
                      <label className="block font-semibold mb-1">Nivel</label>
                      <div className="flex items-center">
                        <select
                          value={nivel}
                          onChange={(e) =>
                            manejarCambioNivel(
                              index,
                              nivelIndex + 1,
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border rounded w-full"
                        >
                          <option value="">Seleccione un nivel</option>
                          {nivelesDisponibles.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => eliminarNivel(index, nivelIndex + 1)}
                          className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700"
                          title="Eliminar nivel adicional"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={agregarCombinacion}
          className="flex items-center gap-2 mx-auto mt-2 bg-white border rounded-full p-2 hover:bg-gray-100"
          title="Agregar fila"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default SelectorAreaNivel;
