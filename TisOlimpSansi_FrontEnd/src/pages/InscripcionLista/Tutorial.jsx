import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const Tutorial = () => {
  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="flex flex-col lg:flex-row bg-white p-5 shadow-2xl rounded-lg max-w-8xl w-full">
        
       
        <div className="lg:w-4/7 bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="border-4 p-2 border-gray-300 rounded-lg w-full">
            <img src="/images/excel.png" alt="Ejemplo Excel" className="w-full h-auto" />
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 mt-5 ">
          <button className="mt-4 bg-green-500 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
                Descargar plantilla
            </button>
            <button className="mt-4 bg-blue-500 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out text-white rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
                Iniciar inscripción
            </button>
          </div>
        </div>

      
        <div className="lg:w-3/5 px-8 lg:px-14 mt-8 lg:mt-0">
          <p className="text-red-600 font-bold text-2xl lg:text-3xl mb-6">
            TENER EN CUENTA ESTAS RECOMENDACIONES DURANTE EL LLENADO:
          </p>

          {/* Advertencias */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Si su estudiante se está inscribiendo en dos materias, debe registrarlo dos veces,
                 una por cada materia, de la siguiente manera:
              </p>
            </div>

            <div className="bg-gray-300 h-20 w-full rounded-lg"></div>

            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Asegúrese de llenar todas las celdas correctamente antes de subirlo.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Asegurese de usar solo las opciones que ya estan establecidas para cada columna.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <p className="text-gray-700 text-lg">
                Verifique que los datos sean correctos antes de subirlo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
