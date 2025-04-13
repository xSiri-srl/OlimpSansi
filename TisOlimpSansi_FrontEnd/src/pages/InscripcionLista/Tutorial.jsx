import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Ícono de cierre

const Tutorial = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1); // Escala de zoom

  const handleSeleccion = () => {
    navigate(`/inscripcion-lista/registro-lista`);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    setScale((prev) => {
      let next = prev - delta * 0.001;
      return Math.min(Math.max(next, 0.5), 3); // Limita el zoom entre 0.5x y 3x
    });
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-9">
      <div className="flex flex-col lg:flex-row bg-white p-5 shadow-2xl rounded-lg max-w-7xl w-full">
        {/* Lado izquierdo */}
<div className="lg:w-1/2 bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center">
  <p className="text-red-600 font-bold text-2xl lg:text-3xl mb-6 text-center">
    EJEMPLO DE LLENADO
  </p>
  <div
  className="w-full overflow-x-auto overflow-y-hidden border border-gray-300 rounded shadow"
  style={{ height: "8cm" }}
>
<div
  style={{
    height: '8cm',
    overflowX: 'auto',
    overflowY: 'hidden',
    border: '1px solid #ccc',
    borderRadius: '0.5rem',
    padding: '0.5rem',
  }}
>
  <div style={{ width: 'max-content' }}>
    <img
      src="/images/Ejemplo.png"
      alt="Ejemplo Expandido"
      style={{
        height: '7cm',
        display: 'block',
      }}
    />
  </div>
</div>

</div>





<p className="text-center text-sm text-gray-500 mb-2">
  Usa la barra para deslizar, y visualizar todos los campos
</p>


          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            <a
              href="/images/plantilla/plantilla_inscripcion.xlsx"
              download
              className="mt-4 bg-green-500 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md text-center"
            >
              Descargar plantilla
            </a>
            <button
              onClick={handleSeleccion}
              className="mt-4 bg-blue-500 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
            >
              Iniciar inscripción
            </button>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="lg:w-1/2 px-8 lg:px-14 mt-8 lg:mt-0">
          <p className="text-red-600 font-bold text-2xl lg:text-3xl mb-6">
            TENER EN CUENTA ESTAS RECOMENDACIONES DURANTE EL LLENADO:
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Si su estudiante se está inscribiendo en dos materias, debe registrarlo dos veces,
                una por cada materia.
              </p>
            </div>

            <div className="bg-gray-300 h-20 w-full rounded-lg flex items-center justify-center text-gray-500 italic">
              Imagen de ejemplo de doble inscripción
            </div>

            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Asegúrese de llenar todas las celdas correctamente antes de subirlo.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Use solo las opciones establecidas para cada columna.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Verifique que los datos sean correctos antes de subir el archivo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal con zoom y botón X */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl max-h-[90vh] p-4 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Botón X */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-3xl text-gray-500 hover:text-red-600"
            >
              <IoClose />
            </button>

            {/* Imagen con zoom scroll */}
            <div
              onWheel={handleWheel}
              className="overflow-auto max-h-[80vh] flex justify-center items-center"
            >
              <img
                src="/images/excel.png"
                alt="Ejemplo Expandido"
                className="transition-transform duration-200 ease-in-out"
                style={{ transform: `scale(${scale})` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
