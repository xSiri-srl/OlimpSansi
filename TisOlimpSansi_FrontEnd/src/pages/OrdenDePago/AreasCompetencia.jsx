import React from "react";
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

  const manejarSeleccion = (nombre) => {
    if (seleccionadas.includes(nombre)) {
      // Deseleccionar
      handleInputChange(
        "areasSeleccionadas",
        seleccionadas.filter((area) => area !== nombre)
      );
    } else {
      // Seleccionar solo si no se ha alcanzado el límite de 2
      if (seleccionadas.length < 2) {
        handleInputChange("estudiante","areasSeleccionadas", [...seleccionadas, nombre]);
      }
    }
  };

  const renderizarArea = (area, index) => {
    const estaSeleccionada = seleccionadas.includes(area.nombre);

    return (
      <div
        key={index}
        className={`w-40 p-4 rounded-lg text-center shadow-md relative ${
          estaSeleccionada ? "bg-gray-300" : "bg-gray-200"
        }`}
        onClick={() => manejarSeleccion(area.nombre)}
      >
        {/* Selector circular */}
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center bg-white cursor-pointer z-10">
          {estaSeleccionada && <FaCheck className="text-green-600" />}
        </div>

        <img
          src={area.imgSrc}
          className="w-full h-auto rounded-md"
          alt={area.nombre}
        />
        <p className="font-semibold mt-2">{area.nombre}</p>
        {(area.nombre === "Informática" || area.nombre === "Robótica") && (
          <p className="text-sm text-gray-600 mt-1">Categoría: Curso</p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Título */}
      <div>
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

      {/* Mostrar áreas seleccionadas */}
      {seleccionadas.length > 0 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="font-semibold">
            Áreas seleccionadas: {seleccionadas.join(", ")}
          </p>
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          onClick={handleBack}
        >
          Atrás
        </button>
        <button
          type="button"
          className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          onClick={handleNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}