import { FaPlus } from "react-icons/fa";
import { gradosDisponibles } from "./constants";

const ConfiguracionGrados = ({ combo, comboIndex, combinaciones, setCombinaciones }) => {
  
  const manejarCambioNivel = (nivelIndex, campo, valor) => {
    const copia = [...combinaciones];
    copia[comboIndex].niveles[nivelIndex][campo] = valor;
    setCombinaciones(copia);
  };

  const manejarCambioCategoriaRango = (categoriaIndex, campo, valor) => {
    const copia = [...combinaciones];
    copia[comboIndex].categoriasRango[categoriaIndex][campo] = valor;
    setCombinaciones(copia);
  };

  const agregarNivel = () => {
    const copia = [...combinaciones];
    copia[comboIndex].niveles.push({ grado: "", categoria: "" });
    setCombinaciones(copia);
  };

  const agregarCategoriaRango = () => {
    const copia = [...combinaciones];
    copia[comboIndex].categoriasRango.push({ 
      rangoInicial: "", 
      rangoFinal: "", 
      nombre: "" 
    });
    setCombinaciones(copia);
  };

  if (combo.modoRango) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Categorías y rangos</label>
          <div className="space-y-4">
            {combo.categoriasRango.map((categoria, categoriaIndex) => (
              <div key={categoriaIndex} className="flex flex-col gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-sm">Grado inicial</label>
                    <select
                      value={categoria.rangoInicial}
                      onChange={(e) =>
                        manejarCambioCategoriaRango(categoriaIndex, "rangoInicial", e.target.value)
                      }
                      className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seleccione grado inicial</option>
                      {gradosDisponibles.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm">Grado final</label>
                    <select
                      value={categoria.rangoFinal}
                      onChange={(e) =>
                        manejarCambioCategoriaRango(categoriaIndex, "rangoFinal", e.target.value)
                      }
                      className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seleccione grado final</option>
                      {gradosDisponibles.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm">Nombre de categoría</label>
                  <input
                    type="text"
                    value={categoria.nombre}
                    onChange={(e) =>
                      manejarCambioCategoriaRango(categoriaIndex, "nombre", e.target.value)
                    }
                    className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ej. Jucumari, 1p, 2s, etc."
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-right">
            <button
              onClick={agregarCategoriaRango}
              className="flex items-center gap-2 mt-3 bg-blue-50 text-blue-700 border border-blue-300 rounded-full px-3 py-1 hover:bg-blue-100"
              title="Agregar categoría para este rango"
            >
              <FaPlus size={12} /> Añadir categoría
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="space-y-3">
        {combo.niveles.map((nivel, nivelIndex) => (
          <div key={nivelIndex} className="flex gap-4 items-center">
            <div className="w-1/2">
              <label className="block font-medium mb-1">Grado</label>
              <select
                value={nivel.grado}
                onChange={(e) =>
                  manejarCambioNivel(nivelIndex, "grado", e.target.value)
                }
                className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccione un grado</option>
                {gradosDisponibles.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="block font-medium mb-1">Nombre de Categoría</label>
              <input
                type="text"
                value={nivel.categoria}
                onChange={(e) =>
                  manejarCambioNivel(nivelIndex, "categoria", e.target.value)
                }
                className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ej. Jucumari, 1p, 2s, etc."
              />
            </div>
          </div>
        ))}

        <div className="text-right">
          <button
            onClick={agregarNivel}
            className="flex items-center gap-2 mt-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-full px-3 py-1 hover:bg-blue-100"
            title="Agregar grado/categoría"
          >
            <FaPlus size={12} /> Añadir categoría
          </button>
        </div>
      </div>
    );
  }
};

export default ConfiguracionGrados;