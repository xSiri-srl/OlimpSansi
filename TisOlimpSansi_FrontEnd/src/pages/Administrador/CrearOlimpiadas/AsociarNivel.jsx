import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const SelectorAreaGrado = () => {
  const olimpiadas = [
    "Olimpiada Nacional de Matemática",
    "Olimpiada de Ciencia Escolar",
    "Olimpiada de Lógica y Pensamiento",
  ];
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [modoRango, setModoRango] = useState(false);

  const [combinaciones, setCombinaciones] = useState([
    { area: "", niveles: [{ grado: "", categoria: "" }], rango: "", categoriaUnica: "" },
  ]);

  const [areas] = useState(["Matemática", "Programación", "Física"]);
  const gradosDisponibles = [
    "3° de primaria", "4° de primaria", "5° de primaria", "6° de primaria",
    "1° de secundaria", "2° de secundaria", "3° de secundaria",
    "4° de secundaria", "5° de secundaria", "6° de secundaria",
  ];

  const manejarCambioArea = (index, valor) => {
    const copia = [...combinaciones];
    copia[index].area = valor;
    setCombinaciones(copia);
  };

  const manejarCambioNivel = (comboIndex, nivelIndex, campo, valor) => {
    const copia = [...combinaciones];
    copia[comboIndex].niveles[nivelIndex][campo] = valor;
    setCombinaciones(copia);
  };

  const manejarCambioRango = (comboIndex, campo, valor) => {
    const copia = [...combinaciones];
    copia[comboIndex][campo] = valor;
    setCombinaciones(copia);
  };

  const agregarNivel = (comboIndex) => {
    const copia = [...combinaciones];
    copia[comboIndex].niveles.push({ grado: "", categoria: "" });
    setCombinaciones(copia);
  };

  const agregarCombinacion = () => {
    setCombinaciones([
      ...combinaciones,
      { area: "", niveles: [{ grado: "", categoria: "" }], rango: "", categoriaUnica: "" },
    ]);
  };

  const eliminarCombinacion = (index) => {
    const nuevaLista = combinaciones.filter((_, i) => i !== index);
    setCombinaciones(nuevaLista);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center mb-2">
        Asociar área/grado a la Olimpiada
      </h1>

      <div className="mb-4 text-center">
        <label className="font-semibold mr-2">Seleccionar olimpiada:</label>
        <select
          value={olimpiadaSeleccionada}
          onChange={(e) => setOlimpiadaSeleccionada(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">-- Seleccione una olimpiada --</option>
          {olimpiadas.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={modoRango}
            onChange={(e) => setModoRango(e.target.checked)}
            className="mr-2"
          />
          Usar rango de grados y una categoría
        </label>
      </div>

      <p className="text-sm text-center mb-4">
        Seleccione las áreas y grados que tendrá la olimpiada{" "}
        {olimpiadaSeleccionada ? `"${olimpiadaSeleccionada}"` : "-TAL-"}
      </p>

      <div className="bg-gray-200 p-2 rounded w-full max-w-3xl mx-auto">
        {combinaciones.map((combo, comboIndex) => (
          <div key={comboIndex} className="relative bg-blue-200 p-3 rounded mb-4">
            <button
              onClick={() => eliminarCombinacion(comboIndex)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Eliminar combinación"
            >
              <FaTrash />
            </button>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Área</label>
              <select
                value={combo.area}
                onChange={(e) => manejarCambioArea(comboIndex, e.target.value)}
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
            </div>

            {modoRango ? (
              <div className="flex gap-2 items-center mb-2">
                <div className="w-1/2">
                  <label className="block font-semibold mb-1">Rango de grados</label>
                  <input
                    type="text"
                    value={combo.rango}
                    onChange={(e) => manejarCambioRango(comboIndex, "rango", e.target.value)}
                    className="px-3 py-2 border rounded w-full"
                    placeholder="Ej: 3° primaria - 6° primaria"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block font-semibold mb-1">Categoría</label>
                  <input
                    type="text"
                    value={combo.categoriaUnica}
                    onChange={(e) =>
                      manejarCambioRango(comboIndex, "categoriaUnica", e.target.value)
                    }
                    className="px-3 py-2 border rounded w-full"
                    placeholder="Ej. Jukumari"
                  />
                </div>
              </div>
            ) : (
              <>
                {combo.niveles.map((nivel, nivelIndex) => (
                  <div key={nivelIndex} className="flex gap-2 items-center mb-2">
                    <div className="w-1/2">
                      <label className="block font-semibold mb-1">Grado</label>
                      <select
                        value={nivel.grado}
                        onChange={(e) =>
                          manejarCambioNivel(comboIndex, nivelIndex, "grado", e.target.value)
                        }
                        className="px-3 py-2 border rounded w-full"
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
                      <label className="block font-semibold mb-1">Categoría</label>
                      <input
                        type="text"
                        value={nivel.categoria}
                        onChange={(e) =>
                          manejarCambioNivel(comboIndex, nivelIndex, "categoria", e.target.value)
                        }
                        className="px-3 py-2 border rounded w-full"
                        placeholder="Ej. Jukumari, 3P"
                      />
                    </div>
                  </div>
                ))}

                <div className="text-right">
                  <button
                    onClick={() => agregarNivel(comboIndex)}
                    className="flex items-center gap-2 mt-2 bg-white border rounded-full px-3 py-1 hover:bg-gray-100"
                    title="Agregar grado/categoría"
                  >
                    <FaPlus /> Añadir nivel
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        <button
          onClick={agregarCombinacion}
          className="flex items-center gap-2 mx-auto mt-4 bg-white border rounded-full p-2 hover:bg-gray-100"
          title="Agregar nueva combinación"
        >
          <FaPlus /> Nueva combinación
        </button>
      </div>
    </div>
  );
};

export default SelectorAreaGrado;
