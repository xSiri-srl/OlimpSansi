import { areasDefault } from "./constants";

const SelectorArea = ({ combo, comboIndex, combinaciones, setCombinaciones }) => {
  const manejarCambioArea = (valor) => {
    const copia = [...combinaciones];
    copia[comboIndex].area = valor;
    
    // Si se selecciona "Otra", inicializar el campo areaPersonalizada
    if (valor === "Otra") {
      copia[comboIndex].areaPersonalizada = "";
    }
    
    setCombinaciones(copia);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2 text-blue-700">Área de Competencia</label>
      {combo.area === "Otra" ? (
        <div className="space-y-2">
          <input
            type="text"
            value={combo.areaPersonalizada || ""}
            onChange={(e) => {
              const copia = [...combinaciones];
              copia[comboIndex].areaPersonalizada = e.target.value;
              setCombinaciones(copia);
            }}
            className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Ingrese el nombre del área"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                const copia = [...combinaciones];
                if (copia[comboIndex].areaPersonalizada) {
                  copia[comboIndex].area = copia[comboIndex].areaPersonalizada;
                } else {
                  copia[comboIndex].area = "";
                }
                delete copia[comboIndex].areaPersonalizada;
                setCombinaciones(copia);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        <select
          value={combo.area}
          onChange={(e) => manejarCambioArea(e.target.value)}
          className="px-3 py-2 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Seleccione un área</option>
          {areasDefault.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
          <option value="Otra">Nueva...</option>
        </select>
      )}
    </div>
  );
};

export default SelectorArea;