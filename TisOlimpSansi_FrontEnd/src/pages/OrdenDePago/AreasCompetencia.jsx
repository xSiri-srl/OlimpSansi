"use client";

import { FaCheck } from "react-icons/fa";
import { useFormData } from "./form-data-context";

const primeraFila = [
  { nombre: "Matemáticas", imgSrc: "/images/matematicaas.png" },
  { nombre: "Física", imgSrc: "/images/fisica.png" },
  { nombre: "Química", imgSrc: "/images/quimica.png" },
];

const segundaFila = [
  { nombre: "Biología", imgSrc: "/images/biologia.png" },
  { nombre: "Informática", imgSrc: "/images/informatica.png" },
  { nombre: "Robótica", imgSrc: "/images/robotica.png" },
  { nombre: "Astronomía y Astrofísica", imgSrc: "/images/astronomia.png" },
];

// Mapa de categorías según área y grado
const categoriasMap = {
  "ASTRONOMÍA - ASTROFÍSICA": {
    "3RO DE PRIMARIA": "3P",
    "4TO DE PRIMARIA": "4P",
    "5TO DE PRIMARIA": "5P",
    "6TO DE PRIMARIA": "6P",
    "1RO DE SECUNDARIA": "1S",
    "2DO DE SECUNDARIA": "2S",
    "3RO DE SECUNDARIA": "3S",
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  BIOLOGÍA: {
    "2DO DE SECUNDARIA": "2S",
    "3RO DE SECUNDARIA": "3S",
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  FÍSICA: {
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  Informática: {
    "5TO DE PRIMARIA": "Guacamayo",
    "6TO DE PRIMARIA": "Guacamayo",
    "1RO DE SECUNDARIA": ["Guanaco", "Londra", "Bufeo"],
    "2DO DE SECUNDARIA": ["Guanaco", "Londra", "Bufeo"],
    "3RO DE SECUNDARIA": ["Guanaco", "Londra", "Bufeo"],
    "4TO DE SECUNDARIA": ["Jucumari", "Puma"],
    "5TO DE SECUNDARIA": ["Jucumari", "Puma"],
    "6TO DE SECUNDARIA": ["Jucumari", "Puma"],
  },
  MATEMÁTICAS: {
    "1RO DE SECUNDARIA": "PRIMER NIVEL",
    "2DO DE SECUNDARIA": "SEGUNDO NIVEL",
    "3RO DE SECUNDARIA": "TERCER NIVEL",
    "4TO DE SECUNDARIA": "CUARTO NIVEL",
    "5TO DE SECUNDARIA": "QUINTO NIVEL",
    "6TO DE SECUNDARIA": "SEXTO NIVEL",
  },
  QUÍMICA: {
    "2DO DE SECUNDARIA": "2S",
    "3RO DE SECUNDARIA": "3S",
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  ROBÓTICA: {
    "5TO DE PRIMARIA": ["BUILDERS P", "LEGO P"],
    "6TO DE PRIMARIA": ["BUILDERS P", "LEGO P"],
    "1RO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "2DO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "3RO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "4TO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "5TO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "6TO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
  },
};

export default function AreasCompetencia({
  formData,
  handleInputChange,
  handleBack,
  handleNext,
}) {
  const { globalData, setGlobalData } = useFormData();
  const seleccionadas = formData.estudiante?.areasSeleccionadas || [];
  const categoriasSeleccionadas =
    formData.estudiante?.categoriasSeleccionadas || {};
  const cursoEstudiante = formData.estudiante?.curso || "";

  // Función para obtener la categoría según el área y curso
  const obtenerCategoriaAutomatica = (area) => {
    // Normalizar el nombre del área para coincidir con el mapa
    let areaNormalizada = area.toUpperCase();
    if (areaNormalizada === "ASTRONOMÍA Y ASTROFÍSICA") {
      areaNormalizada = "ASTRONOMÍA - ASTROFÍSICA";
    }

    // Verificar si existe una categoría para esta área y grado
    if (
      categoriasMap[areaNormalizada] &&
      categoriasMap[areaNormalizada][cursoEstudiante]
    ) {
      return categoriasMap[areaNormalizada][cursoEstudiante];
    }

    return null; // No existe categoría para esta combinación
  };

  const obtenerCategorias = (area) => {
    // Verificar si el área es Informática o Robótica
    if (area !== "Informática" && area !== "Robótica") {
      return null;
    }

    // Verificar si tenemos datos en categoriasMap para esta área
    const areaNormalizada = area === "Informática" ? "Informática" : "ROBÓTICA";

    if (
      categoriasMap[areaNormalizada] &&
      categoriasMap[areaNormalizada][cursoEstudiante]
    ) {
      const categorias = categoriasMap[areaNormalizada][cursoEstudiante];

      // Si es un array, devolver las categorías formateadas
      if (Array.isArray(categorias)) {
        return categorias.map((cat) => {
          if (area === "Informática") {
            return `"${cat}" ${cursoEstudiante}`;
          } else {
            // Robótica
            return `"${cat}" ${cursoEstudiante}`;
          }
        });
      }
      // Si es un string, devolver como array de un elemento
      else {
        return [`"${categorias}" ${cursoEstudiante}`];
      }
    }

    // Usar la lógica existente como fallback
    const esPrimaria = cursoEstudiante.includes("Primaria");
    const esSecundaria = cursoEstudiante.includes("Secundaria");
    const numero = Number.parseInt(cursoEstudiante.match(/\d+/)?.[0] || "0");

    // Para Informática
    if (area === "Informática") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return ['"Guacamayo" 5to a 6to Primaria'];
      } else if (esSecundaria && numero >= 1 && numero <= 3) {
        return [
          '"Guanaco" 1ro a 3ro Secundaria',
          '"Londra" 1ro a 3ro Secundaria',
          '"Bufeo" 1ro a 3ro Secundaria',
        ];
      } else if (esSecundaria && numero >= 4 && numero <= 6) {
        return [
          '"Jucumari" 4to a 6to Secundaria',
          '"Puma" 4to a 6to Secundaria',
        ];
      }
    }

    // Para Robótica
    if (area === "Robótica") {
      if (esPrimaria && (numero === 5 || numero === 6)) {
        return [
          '"Builders P" 5to a 6to Primaria',
          '"Lego P" 5to a 6to Primaria',
        ];
      } else if (esSecundaria) {
        return [
          '"Builders S" 1ro a 6to Secundaria',
          '"Lego S" 1ro a 6to Secundaria',
        ];
      }
    }

    return ["Categoría no disponible para este curso"];
  };

  const manejarSeleccion = (nombre) => {
    let nuevasSeleccionadas;
    const nuevasCategoriasSeleccionadas = { ...categoriasSeleccionadas };

    if (seleccionadas.includes(nombre)) {
      nuevasSeleccionadas = seleccionadas.filter((area) => area !== nombre);
      delete nuevasCategoriasSeleccionadas[nombre];
    } else {
      if (seleccionadas.length < 2) {
        nuevasSeleccionadas = [...seleccionadas, nombre];

        if (nombre === "Informática" || nombre === "Robótica") {
          const categorias = obtenerCategorias(nombre);
          console.log(`Categorías obtenidas para ${nombre}:`, categorias);
          if (categorias && categorias.length > 0) {
            nuevasCategoriasSeleccionadas[nombre] = "";
          }
        }
      } else {
        return;
      }
    }

    handleInputChange("estudiante", "areasSeleccionadas", nuevasSeleccionadas);
    handleInputChange(
      "estudiante",
      "categoriasSeleccionadas",
      nuevasCategoriasSeleccionadas
    );
  };

  const handleCategoriaChange = (area, categoria) => {
    const nuevasCategoriasSeleccionadas = {
      ...categoriasSeleccionadas,
      [area]: categoria,
    };
    handleInputChange(
      "estudiante",
      "categoriasSeleccionadas",
      nuevasCategoriasSeleccionadas
    );
  };

  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);
    const categorias = obtenerCategorias(area.nombre);
    const categoriaSeleccionada = categoriasSeleccionadas[area.nombre] || "";

    return (
      <div
        key={index}
        className={`w-40 p-4 rounded-lg text-center shadow-md relative ${
          estaSeleccionada ? "bg-gray-400" : "bg-gray-300"
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
          src={area.imgSrc || "/placeholder.svg"}
          className="w-full h-auto rounded-md cursor-pointer"
          alt={area.nombre}
          onClick={() => manejarSeleccion(area.nombre)}
        />
        <p
          className="font-semibold mt-2 cursor-pointer"
          onClick={() => manejarSeleccion(area.nombre)}
        >
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
              onChange={(e) =>
                handleCategoriaChange(area.nombre, e.target.value)
              }
              required
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

  const handleSubmitAndNext = () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      const esSecundaria = cursoEstudiante.includes("Secundaria");
      const numero = Number.parseInt(cursoEstudiante.match(/\d+/)?.[0] || "0");
      const areasCompetencia = seleccionadas.map((area) => {
        // Normalizar el nombre del área
        const nombreArea = area.toUpperCase();
        let nombreAreaNormalizado = nombreArea;
        if (nombreArea === "ASTRONOMÍA Y ASTROFÍSICA") {
          nombreAreaNormalizado = "ASTRONOMÍA - ASTROFÍSICA";
        }

        // Obtener la categoría automática según el área y curso
        const categoria = null;
        if (area === "Informática" || area === "Robótica") {
          const categoriaCompleta = categoriasSeleccionadas[area] || "";

          // Extraer el nombre entre comillas y convertirlo a mayúsculas
          const nombreCategoria = (
            categoriaCompleta.match(/"([^"]+)"/)?.[1] || ""
          ).toUpperCase();

          console.log(
            `Categoría original: ${categoriaCompleta} -> Categoría procesada: ${nombreCategoria}`
          );
          console.log(
            `Área original: ${area} -> Área procesada: ${area.toUpperCase()}`
          );

          return {
            nombre_area: area.toUpperCase(),
            categoria: nombreCategoria,
          };
        } else if (area == "Matemáticas") {
          let nombreCategoria = "";
          if (numero == 1) {
            nombreCategoria = "PRIMER NIVEL";
          } else if (numero == 2) {
            nombreCategoria = "SEGUNDO NIVEL";
          } else if (numero == 3) {
            nombreCategoria = "TERCER NIVEL";
          } else if (numero == 4) {
            nombreCategoria = "CUARTO NIVEL";
          } else if (numero == 5) {
            nombreCategoria = "QUINTO NIVEL";
          } else {
            nombreCategoria = "SEXTO NIVEL";
          }

          return {
            nombre_area: area.toUpperCase(),
            categoria: nombreCategoria,
          };
          return {
            nombre_area: area.toUpperCase(),
          };
        } else {
          let nombreCategoria = "";
          if (esSecundaria) {
            nombreCategoria = numero + "S";
          } else {
            nombreCategoria = numero + "P";
          }

          return {
            nombre_area: area.toUpperCase(),
            categoria: nombreCategoria,
          };
        }
      });

      const updatedData = {
        ...globalData,
        areas_competencia: areasCompetencia,
      };

      setGlobalData(updatedData);

      console.log("Datos de áreas actualizados en JSON:", updatedData);
      console.log("Áreas seleccionadas:", seleccionadas);
      console.log("Categorías asignadas:", areasCompetencia);

      handleInputChange("estudiante", "areasComplete", true);

      handleNext();
    } catch (error) {
      console.error("Error al procesar los datos de áreas:", error);
    }
  };

  function validarFormulario() {
    if (seleccionadas.length === 0) return false;

    for (const area of seleccionadas) {
      if (area === "Informática" || area === "Robótica") {
        const categorias = obtenerCategorias(area);

        // Verificar si hay categorías disponibles
        if (categorias && categorias.length > 0) {
          // Si la categoría no está seleccionada o es "Categoría no disponible para este curso"
          if (
            !categoriasSeleccionadas[area] ||
            categoriasSeleccionadas[area].includes(
              "Categoría no disponible para este curso"
            )
          ) {
            return false;
          }
        }
      } else {
        // Para otras áreas, verificar si existe una categoría automática
        const categoria = obtenerCategoriaAutomatica(area);
        if (categoria === null) {
          return false;
        }
      }
    }

    return true;
  }

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
            {seleccionadas.map((area, index) => {
              // Mostrar la categoría automática para áreas que no son Informática o Robótica
              let categoriaInfo = "";
              if (area !== "Informática" && area !== "Robótica") {
                const categoriaAuto = obtenerCategoriaAutomatica(area);
                if (categoriaAuto) {
                  categoriaInfo = ` - Categoría: ${categoriaAuto}`;
                } else {
                  categoriaInfo = ` - No disponible para ${cursoEstudiante}`;
                }
              } else if (categoriasSeleccionadas[area]) {
                categoriaInfo = ` - ${categoriasSeleccionadas[area]}`;
              } else {
                categoriaInfo = ` - (selecciona una categoría)`;
              }

              return (
                <li key={index}>
                  {area}
                  <span
                    className={
                      categoriaInfo.includes("No disponible")
                        ? "text-red-500 font-medium"
                        : "font-medium"
                    }
                  >
                    {categoriaInfo}
                  </span>
                </li>
              );
            })}
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
            ${
              validarFormulario()
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          onClick={handleSubmitAndNext}
          disabled={!validarFormulario()}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
