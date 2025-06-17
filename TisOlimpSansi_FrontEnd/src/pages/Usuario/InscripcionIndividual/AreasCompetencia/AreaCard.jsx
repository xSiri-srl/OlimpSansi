import { FaCheck } from "react-icons/fa";
import { useEffect } from "react";

const AreaCard = ({ 
  area, 
  estaSeleccionada, 
  categorias, 
  categoriaSeleccionada, 
  manejarSeleccion, 
  handleCategoriaChange 
}) => {
  const categoriasDisponibles = categorias && categorias.length > 0 
    ? categorias 
    : ["Sin categorías disponibles"];
  
  useEffect(() => {
    if (estaSeleccionada && !categoriaSeleccionada && categoriasDisponibles.length === 1) {
      const categoria = categoriasDisponibles[0];
      if (categoria !== "Sin categorías disponibles" && 
          categoria !== "Categoría no disponible para este curso" &&
          !categoria.includes("No hay categorías disponibles")) {
        handleCategoriaChange(area.nombre, categoria);
      }
    }
  }, [estaSeleccionada, categoriaSeleccionada, categoriasDisponibles, area.nombre, handleCategoriaChange]);
  
  const esCategoriaValida = (categoria) => {
    return categoria && 
           categoria !== "Sin categorías disponibles" && 
           categoria !== "Categoría no disponible para este curso" &&
           !categoria.includes("No hay categorías disponibles") &&
           !categoria.includes("No hay categorías disponibles para");
  };
  
  const hayCategoriasValidas = categoriasDisponibles.some(esCategoriaValida);
  
  return (
    <div
      className={`w-40 p-4 rounded-lg text-center shadow-md relative ${
        estaSeleccionada ? "bg-blue-100 border-2 border-blue-400" : "bg-white border-2 border-gray-200 hover:border-blue-300"
      } transition-all duration-200 cursor-pointer`}
    >
      <div
        className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center bg-white cursor-pointer z-10 hover:border-blue-500 transition-colors"
        onClick={() => manejarSeleccion(area.nombre)}
      >
        {estaSeleccionada && <FaCheck className="text-green-600" />}
      </div>

      <img
        src={area.imgSrc || "/placeholder.svg"}
        className="w-full h-auto rounded-md cursor-pointer hover:opacity-80 transition-opacity"
        alt={area.nombre}
        onClick={() => manejarSeleccion(area.nombre)}
      />
      
      <p
        className="font-semibold mt-2 cursor-pointer text-gray-800 hover:text-blue-600 transition-colors"
        onClick={() => manejarSeleccion(area.nombre)}
      >
        {area.nombre}
      </p>

      {/* Selector de categoría */}
      {estaSeleccionada && (
        <div className="mt-3 bg-gray-50 p-2 rounded-md">
          <label className="block text-xs text-gray-700 mb-1 font-medium">
            Selecciona una categoría:
          </label>
          
          <select
            className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={categoriaSeleccionada || ""}
            onChange={(e) => {
              handleCategoriaChange(area.nombre, e.target.value);
            }}
            required
          >
            <option value="">-- Seleccionar --</option>
            {categoriasDisponibles
              .filter(esCategoriaValida)
              .map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
          
          {!hayCategoriasValidas && (
            <div className="text-xs text-red-500 mt-1 bg-red-50 p-1 rounded">
              {categoriasDisponibles[0] || "No hay categorías disponibles para tu grado"}
            </div>
          )}
          
          {/* Mostrar categoría auto-seleccionada */}
          {categoriaSeleccionada && esCategoriaValida(categoriaSeleccionada) && (
            <div className="text-xs text-green-600 mt-1 bg-green-50 p-1 rounded">
              ✓ Categoría: {categoriaSeleccionada}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AreaCard;