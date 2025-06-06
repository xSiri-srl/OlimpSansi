import { FaCheck } from "react-icons/fa";

const AreaCard = ({ 
  area, 
  estaSeleccionada, 
  estaDisponible, 
  categorias, 
  categoriaSeleccionada, 
  manejarSeleccion, 
  handleCategoriaChange 
}) => {
  // Información de depuración para ayudar a identificar problemas
  const categoriasDisponibles = categorias && categorias.length > 0 
    ? categorias 
    : ["Sin categorías disponibles"];
  
  return (
    <div
      className={`w-40 p-4 rounded-lg text-center shadow-md relative ${
        !estaDisponible 
          ? "bg-gray-200 opacity-50" 
          : estaSeleccionada 
            ? "bg-gray-400" 
            : "bg-gray-300"
      }`}
    >
      {/* Selector circular (solo visible si el área está disponible) */}
      {estaDisponible && (
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center bg-white cursor-pointer z-10"
          onClick={() => manejarSeleccion(area.nombre)}
        >
          {estaSeleccionada && <FaCheck className="text-green-600" />}
        </div>
      )}

      <img
        src={area.imgSrc || "/placeholder.svg"}
        className={`w-full h-auto rounded-md ${estaDisponible ? "cursor-pointer" : "cursor-not-allowed"}`}
        alt={area.nombre}
        onClick={() => estaDisponible && manejarSeleccion(area.nombre)}
      />
      <p
        className={`font-semibold mt-2 ${estaDisponible ? "cursor-pointer" : "cursor-not-allowed text-gray-500"}`}
        onClick={() => estaDisponible && manejarSeleccion(area.nombre)}
      >
        {area.nombre}
        {!estaDisponible && <span className="block text-xs text-red-500">(No disponible)</span>}
      </p>

      {/* Selector de categoría para todas las áreas disponibles */}
      {estaSeleccionada && (
        <div className="mt-3">
          <label className="block text-xs text-gray-700 mb-1 font-medium">
            Selecciona una categoría:
          </label>
          <select
            className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoriaSeleccionada || ""}
            onChange={(e) =>
              handleCategoriaChange(area.nombre, e.target.value)
            }
            required
          >
            <option value="">-- Seleccionar --</option>
            {categoriasDisponibles.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          
          {categoriasDisponibles.length === 1 && categoriasDisponibles[0] === "Sin categorías disponibles" && (
            <div className="text-xs text-red-500 mt-1">
              No hay categorías disponibles para tu grado
            </div>
          )}
          
          {/* Auto-seleccionar si hay una sola opción */}
          {estaSeleccionada && !categoriaSeleccionada && categoriasDisponibles.length === 1 && 
           categoriasDisponibles[0] !== "Sin categorías disponibles" && 
           categoriasDisponibles[0] !== "Categoría no disponible para este curso" && (
            setTimeout(() => handleCategoriaChange(area.nombre, categoriasDisponibles[0]), 100)
          )}
        </div>
      )}
    </div>
  );
};

export default AreaCard;