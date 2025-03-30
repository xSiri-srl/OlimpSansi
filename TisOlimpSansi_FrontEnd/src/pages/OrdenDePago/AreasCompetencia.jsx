import { FaCheck } from "react-icons/fa";

const primeraFila = [
  { nombre: "Matemáticas", imgSrc: "/images/mate.jpg" },
  { nombre: "Física", imgSrc: "/images/fisi.jpg" },
  { nombre: "Química", imgSrc: "/images/quimi.jpeg" },
];

const segundaFila = [
  { nombre: "Biología", imgSrc: "/images/bio.jpg" },
  { nombre: "Informática", imgSrc: "/images/info.jpg" },
  { nombre: "Robótica", imgSrc: "/images/robo.jpg" },
  { nombre: "Astronomía y Astrofísica", imgSrc: "/images/astro.jpeg" },
];

export default function AreasCompetencia({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const seleccionadas = formData.estudiante?.areasSeleccionadas || [];
  const categoriasSeleccionadas = formData.estudiante?.categoriasSeleccionadas || {};
  const cursoEstudiante = formData.estudiante?.curso || "";

  const obtenerCategorias = (area) => {
    if (area !== "Informática" && area !== "Robótica") {
      return null;
    }
    
    const esPrimaria = cursoEstudiante.includes("Primaria");
    const esSecundaria = cursoEstudiante.includes("Secundaria");

    const numero = parseInt(cursoEstudiante.match(/\d+/)?.[0] || "0");
    
    // Para Informática
    if (area === "Informática") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return ["\"Guacamayo\" 5to a 6to Primaria"];
      } else if (esSecundaria && numero >= 1 && numero <= 3) {
        return [
          "\"Guanaco\" 1ro a 3ro Secundaria", 
          "\"Londra\" 1ro a 3ro Secundaria",
          "\"Bufeo\" 1ro a 3ro Secundaria"
        ];
      } else if (esSecundaria && numero >= 4 && numero <= 6) {
        return [
          "\"Jucumari\" 4to a 6to Secundaria",
          "\"Puma\" 4to a 6to Secundaria"
        ];
      }
    }
    
    // Para Robótica
    if (area === "Robótica") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return [
          "\"Builders P\" 5to a 6to Primaria",
          "\"Lego P\" 5to a 6to Primaria"
        ];
      } else if (esSecundaria) {
        return [
          "\"Builders S\" 1ro a 6to Secundaria",
          "\"Lego S\" 1ro a 6to Secundaria"
        ];
      }
    }
    
    return ["Categoría no disponible para este curso"];
  };

  const manejarSeleccion = (nombre) => {
    let nuevasSeleccionadas;
    let nuevasCategoriasSeleccionadas = { ...categoriasSeleccionadas };
    
    if (seleccionadas.includes(nombre)) {
      nuevasSeleccionadas = seleccionadas.filter((area) => area !== nombre);
      
      delete nuevasCategoriasSeleccionadas[nombre];
      
    } else {
      if (seleccionadas.length < 2) {
        nuevasSeleccionadas = [...seleccionadas, nombre];
        
        // Si es Informática o Robótica, inicializar la categoría como vacía
        if (nombre === "Informática" || nombre === "Robótica") {
          const categorias = obtenerCategorias(nombre);
          if (categorias && categorias.length > 0) {
            nuevasCategoriasSeleccionadas[nombre] = "";
          }
        }
      } else {
        return;
      }
    }

    handleInputChange("estudiante", "areasSeleccionadas", nuevasSeleccionadas);

    handleInputChange("estudiante", "categoriasSeleccionadas", nuevasCategoriasSeleccionadas);
  };

  const handleCategoriaChange = (area, categoria) => {
    const nuevasCategoriasSeleccionadas = { ...categoriasSeleccionadas, [area]: categoria };
    handleInputChange("estudiante", "categoriasSeleccionadas", nuevasCategoriasSeleccionadas);
  };

  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);
    const categorias = obtenerCategorias(area.nombre);
    const categoriaSeleccionada = categoriasSeleccionadas[area.nombre] || "";

    return (
      <div
        key={index}
        className={`w-40 p-4 rounded-lg text-center shadow-md relative ${
          estaSeleccionada ? "bg-gray-300" : "bg-gray-200"
        }`}
      >
        {/* Selector circular */}
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center bg-white cursor-pointer z-10"
          onClick={() => manejarSeleccion(area.nombre)}
        >
          {estaSeleccionada && <FaCheck className="text-green-600" />}
        </div>

        <img
          src={area.imgSrc}
          className="w-full h-auto rounded-md cursor-pointer"
          alt={area.nombre}
          onClick={() => manejarSeleccion(area.nombre)}
        />
        <p className="font-semibold mt-2 cursor-pointer" onClick={() => manejarSeleccion(area.nombre)}>
          {area.nombre}
        </p>
        
        {/* Selector de categoría si está seleccionada y tiene categorías */}
        {estaSeleccionada && categorias && categorias.length > 0 && (
          <div className="mt-3">
            <label className="block text-xs text-gray-700 mb-1 font-medium">
              Selecciona una categoría:
            </label>
            <select
              className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoriaSeleccionada}
              onChange={(e) => handleCategoriaChange(area.nombre, e.target.value)}
            >
              <option value="">-- Seleccionar --</option>
              {categorias.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Título */}
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2 text-gray-500">
          Áreas de Competencia
        </h2>
        <p className="text-sm text-gray-600">
          Selecciona hasta 2 áreas de competencia.
        </p>
      </div>

      {/* Primera fila */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {primeraFila.map((area, index) => renderizarArea(area, index))}
      </div>

      {/* Segunda fila */}
      <div className="flex flex-wrap justify-center gap-6">
        {segundaFila.map((area, index) =>
          renderizarArea(area, index + primeraFila.length)
        )}
      </div>

      {/* Mostrar áreas y categorías seleccionadas */}
      {seleccionadas.length > 0 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-center">
          <p className="font-semibold mb-1">Áreas seleccionadas:</p>
          <ul className="list-disc list-inside text-sm">
            {seleccionadas.map((area, index) => (
              <li key={index}>
                {area}
                {categoriasSeleccionadas[area] && (
                  <span className="font-medium"> - {categoriasSeleccionadas[area]}</span>
                )}
                {(area === "Informática" || area === "Robótica") && !categoriasSeleccionadas[area] && (
                  <span className="text-red-500"> (selecciona una categoría)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          type="button"
          className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-gray-500 hover:-translate-y-1 hover:scale-105 hover:bg-gray-600"
          onClick={handleBack}
        >
          Atrás
        </button>
        <button
          type="button"
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md 
            ${validarFormulario() ? 
              "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500" : 
              "bg-gray-400 cursor-not-allowed"}`}
          onClick={validarFormulario() ? handleNext : null}
        >
          Siguiente
        </button>
      </div>
    </div>
  );

  function validarFormulario() {
    if (seleccionadas.length === 0) return false;
    for (const area of seleccionadas) {
      if ((area === "Informática" || area === "Robótica")) {
        const categorias = obtenerCategorias(area);
        if (categorias && categorias.length > 0 && !categoriasSeleccionadas[area]) {
          return false;
        }
      }
    }
    
    return true;
  }
}