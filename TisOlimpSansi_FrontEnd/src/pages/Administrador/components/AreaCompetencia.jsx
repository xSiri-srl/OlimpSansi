import { useState, useEffect } from "react";
import { FaCheck, FaLock, FaPlus, FaTimes } from "react-icons/fa";
import { categoriasPredefinidasMap } from "./CatalogoAreasNiveles";

const AreaCompetencia = ({
  combo,
  comboIndex,
  combinaciones,
  setCombinaciones,
  eliminarCombinacion,
  olimpiadaSeleccionada,
  modoAsociacion = true,
  todosLosGrados = [],
  onEliminarCategoria,
}) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const categoriasPredefinidas = Object.keys(categoriasPredefinidasMap);

  useEffect(() => {
    if (todosLosGrados && todosLosGrados.length > 0) {
    }
  }, [todosLosGrados]);

  const handleAreaToggle = (checked) => {
    if (!olimpiadaSeleccionada) {
      alert("Por favor seleccione una olimpiada primero");
      return;
    }

    if (modoAsociacion && combo.yaAsociada && !checked) {
      alert(
        "En esta sección solo puedes asociar áreas. Para desasociar áreas, usa la sección 'Desasignar Áreas'"
      );
      return;
    }

    if (!modoAsociacion && !combo.yaAsociada && checked) {
      alert(
        "En esta sección solo puedes desasociar áreas. Para asociar áreas, usa la sección 'Asignar Áreas'"
      );
      return;
    }

    const copia = [...combinaciones];
    copia[comboIndex] = {
      ...copia[comboIndex],
      habilitado: checked,
    };
    setCombinaciones(copia);
  };
  const getAreaImage = (area) => {
    const imageMap = {
      MATEMATICAS: "/images/matematicaas.png",
      FISICA: "/images/fisica.png",
      QUIMICA: "/images/quimica.png",
      BIOLOGIA: "/images/biologia.png",
      INFORMATICA: "/images/informatica.png",
      ROBOTICA: "/images/robotica.png",
      "ASTRONOMIA Y ASTROFISICA": "/images/astronomia.png",
    };

    return imageMap[area] || "/placeholder.svg";
  };

  const handleCategoriaSelect = (index, nombreCategoria) => {
    const categoriaSeleccionada = categoriasPredefinidasMap[nombreCategoria];

    if (!categoriaSeleccionada) return;

    const copia = [...combinaciones];

    if (!copia[comboIndex].categorias) {
      copia[comboIndex].categorias = [];
    }

    const existeEnOtraPosicion = copia[comboIndex].categorias.some(
      (cat, idx) => idx !== index && cat.nombre === nombreCategoria
    );

    if (existeEnOtraPosicion) {
      alert(
        `La categoría "${nombreCategoria}" ya está asociada a esta área. Por favor seleccione una categoría diferente.`
      );
      return;
    }

    copia[comboIndex].categorias[index] = {
      nombre: categoriaSeleccionada.nombre,
      desde: categoriaSeleccionada.desde,
      hasta: categoriaSeleccionada.hasta,
    };

    setCombinaciones(copia);
  };

  const agregarCategoria = () => {
    const copia = [...combinaciones];

    if (!copia[comboIndex].categorias) {
      copia[comboIndex].categorias = [];
    }

    const categoriasExistentes = new Set(
      copia[comboIndex].categorias.map((cat) => cat.nombre)
    );

    let categoriaSeleccionada = null;
    for (const nombreCategoria of categoriasPredefinidas) {
      if (!categoriasExistentes.has(nombreCategoria)) {
        categoriaSeleccionada = categoriasPredefinidasMap[nombreCategoria];
        break;
      }
    }

    if (!categoriaSeleccionada) {
      alert("Ya has añadido todas las categorías disponibles para esta área.");
      return;
    }

    copia[comboIndex].categorias.push({
      nombre: categoriaSeleccionada.nombre,
      desde: categoriaSeleccionada.desde,
      hasta: categoriaSeleccionada.hasta,
    });

    setCombinaciones(copia);
  };

  const eliminarCategoria = async (index) => {
    const categoria = combo.categorias[index];

    if (!modoAsociacion && combo.yaAsociada && onEliminarCategoria) {
      try {
        await onEliminarCategoria(combo, categoria, index);
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
        alert("Error al eliminar la categoría. Por favor, intente nuevamente.");
      }
    } else {
      const copia = [...combinaciones];
      copia[comboIndex].categorias.splice(index, 1);
      setCombinaciones(copia);
    }
  };

  const categorias = combo.categorias || [];
  const estaHabilitada = combo.habilitado || false;
  const sePuedeHabilitar = !!olimpiadaSeleccionada;
  const esInteractuable =
    sePuedeHabilitar && (modoAsociacion ? !combo.yaAsociada : combo.yaAsociada);

  return (
    <div
      className={`relative bg-white p-4 rounded-lg mb-6 shadow-md transition-all duration-300 ${
        estaHabilitada
          ? "border-l-4 border-blue-500"
          : !sePuedeHabilitar
          ? "border-l-4 border-gray-400 opacity-60"
          : "border-l-4 border-gray-300 opacity-75"
      }`}
    >
      {!sePuedeHabilitar && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px] rounded-lg">
          <FaLock className="text-gray-500 text-3xl mb-2" />
          <p className="text-gray-600 text-center font-medium px-4">
            Seleccione una olimpiada para{" "}
            {modoAsociacion ? "asociar" : "desasociar"} áreas de competencia
          </p>
        </div>
      )}

      {sePuedeHabilitar && !esInteractuable && modoAsociacion && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px] rounded-lg">
          <FaCheck className="text-green-500 text-3xl mb-2" />
          <p className="text-gray-600 text-center font-medium px-4">
            Esta área ya está asociada. Para desasociarla, usa la sección
            'Desasignar Áreas'
          </p>
        </div>
      )}

      {sePuedeHabilitar && !esInteractuable && !modoAsociacion && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px] rounded-lg">
          <FaLock className="text-gray-500 text-3xl mb-2" />
          <p className="text-gray-600 text-center font-medium px-4">
            Esta área no está asociada a esta olimpiada. Para asociarla, usa
            'Asignar Áreas'
          </p>
        </div>
      )}

      <div className="flex items-start">
        <div className="w-40 mr-4 text-center relative">
          <img
            src={getAreaImage(combo.area)}
            alt={combo.area}
            className="w-32 h-32 mx-auto mb-2 rounded-lg"
          />

          <div
            className={`absolute top-0 right-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              esInteractuable ||
              (sePuedeHabilitar && combo.yaAsociada && modoAsociacion)
                ? "cursor-pointer"
                : "cursor-not-allowed"
            } transition-colors ${
              estaHabilitada
                ? "border-blue-500 bg-blue-50"
                : "border-gray-400 bg-white"
            }`}
            onClick={() => {
              if (
                (esInteractuable ||
                  (sePuedeHabilitar && combo.yaAsociada && modoAsociacion)) &&
                sePuedeHabilitar
              ) {
                handleAreaToggle(!estaHabilitada);
              }
            }}
          >
            {estaHabilitada && <FaCheck className="text-blue-600" />}
          </div>
        </div>
        <div className="flex-1">
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
          <div className={`${!estaHabilitada ? "opacity-50" : ""}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700 border-b pb-1">
                Categorías y Rangos de Grados
              </h3>
              <button
                onClick={() => setMostrarDetalles(!mostrarDetalles)}
                className={`text-sm px-3 py-1 rounded-full ${
                  mostrarDetalles
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                } hover:bg-blue-200 transition`}
              >
                {mostrarDetalles ? "Ocultar Categorías" : "Ver Categorías"}
              </button>
            </div>
            {mostrarDetalles && (
              <div className="space-y-3 mb-4 mt-2">
                {categorias.length === 0 ? (
                  <p className="text-gray-500 italic text-center">
                    No hay categorías definidas para esta área
                  </p>
                ) : (
                  categorias.map((categoria, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px] w-full"
                    >
                      <div className="flex-1 flex flex-wrap gap-2 items-center">
                        <div className="w-64 flex-none">
                          <label className="block text-xs text-gray-500 mb-1">
                            Categoría
                          </label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={categoria.nombre || ""}
                            onChange={(e) =>
                              handleCategoriaSelect(idx, e.target.value)
                            }
                            disabled={!estaHabilitada || !modoAsociacion}
                          >
                            {categoriasPredefinidas.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full sm:w-auto">
                          <label className="block text-xs text-gray-500 mb-1">
                            Desde
                          </label>
                          <div className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-gray-700">
                            {categoria.desde || "N/A"}
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          <label className="block text-xs text-gray-500 mb-1">
                            Hasta
                          </label>
                          <div className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-gray-700">
                            {categoria.hasta || "N/A"}
                          </div>
                        </div>
                      </div>
                      {estaHabilitada &&
                        (modoAsociacion ||
                          (!modoAsociacion && combo.yaAsociada)) && (
                          <div className="flex items-center self-center ml-2">
                            <button
                              className="flex-shrink-0 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault();
                                eliminarCategoria(idx);
                              }}
                              title="Eliminar categoría"
                            >
                              <FaTimes className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                    </div>
                  ))
                )}
                {estaHabilitada && modoAsociacion && (
                  <button
                    onClick={agregarCategoria}
                    className="w-full mt-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    <FaPlus size={14} />
                    Nueva Categoría
                  </button>
                )}
              </div>
            )}
            {!mostrarDetalles && (
              <div className="text-gray-600 text-sm">
                {categorias.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((cat, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs mr-1 mb-1"
                      >
                        <span>
                          {cat.nombre} ({cat.desde} - {cat.hasta})
                        </span>
                        {estaHabilitada &&
                          (modoAsociacion ||
                            (!modoAsociacion && combo.yaAsociada)) && (
                            <button
                              className="ml-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-4 h-4 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarCategoria(idx);
                              }}
                              title="Eliminar categoría"
                            >
                              <FaTimes className="h-2 w-2" />
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic">
                    No hay categorías asociadas.{" "}
                    {modoAsociacion
                      ? "Haga click en 'Ver Categorías' para agregar."
                      : "Este área no tiene categorías configuradas."}
                  </p>
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
