import React from "react";

const Tutorial = () => {
  return (
    <div className="flex justify-center items-center p-10 bg-gray-100">
      <div className="flex bg-white p-6 shadow-lg rounded-lg max-w-4xl w-full">
        {/* Sección de la imagen */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="border-4 border-blue-500 p-2">
            <img
              src="/images/bio.jpg"
              alt="Ejemplo Excel"
              className="w-full h-auto"
            />
          </div>
          <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
            Descargar plantilla
          </button>
          <button className="mt-5 bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
            Iniciar inscripción
          </button>
        </div>
        
        {/* Sección de texto */}
        <div className="w-1/2 px-6">
          <p className="text-red-600 font-bold text-lg">
            Tener en cuenta estas recomendaciones, durante el llenado
          </p>
          <p className="mt-4 text-gray-700">
            Si su estudiante, se está inscribiendo a 2 materias debe llenarlo de la siguiente manera
          </p>
          <div className="mt-4 bg-gray-300 h-16 w-full"></div>
          <p className="mt-4 text-gray-700">
            Recuerda que no puede dejar algún campo vacío
          </p>
          <p className="mt-6 text-red-600 font-bold text-lg">
            Tener en cuenta estas recomendaciones, durante el llenado
          </p>
        </div>
      </div>
    </div>
  );
  };

export default Tutorial;
