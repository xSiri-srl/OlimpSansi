import { FaCheck } from "react-icons/fa";
import { useEffect } from "react";

const AreaCard = ({ 
  area, 
  estaSeleccionada, 
  estaDisponible, 
  categorias, 
  categoriaSeleccionada, 
  manejarSeleccion, 
  handleCategoriaChange 
}) => {
  // DEBUG: Mostrar información detallada
  console.log(`🔍 AreaCard - ${area.nombre}:`, {
    estaSeleccionada,
    estaDisponible,
    categorias,
    categoriaSeleccionada
  });

  const categoriasDisponibles = categorias && categorias.length > 0 
    ? categorias 
    : ["Sin categorías disponibles"];
  
  // Auto-seleccionar categoría si hay una sola opción válida
  useEffect(() => {
    if (estaSeleccionada && !categoriaSeleccionada && categoriasDisponibles.length === 1) {
      const categoria = categoriasDisponibles[0];
      // Solo auto-seleccionar si la categoría es válida
      if (categoria !== "Sin categorías disponibles" && 
          categoria !== "Categoría no disponible para este curso" &&
          !categoria.includes("No hay categorías disponibles")) {
        console.log(`🎯 Auto-seleccionando categoría: "${categoria}" para área: "${area.nombre}"`);
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
            onChange={(e) => {
              console.log(`🎯 Seleccionando categoría "${e.target.value}" para área "${area.nombre}"`);
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
          
          {/* Mensajes informativos */}
          {!hayCategoriasValidas && (
            <div className="text-xs text-red-500 mt-1">
              {categoriasDisponibles[0] || "No hay categorías disponibles para tu grado"}
            </div>
          )}
          
          {/* Mostrar categoría auto-seleccionada */}
          {categoriaSeleccionada && esCategoriaValida(categoriaSeleccionada) && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Categoría seleccionada: {categoriaSeleccionada}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AreaCard;