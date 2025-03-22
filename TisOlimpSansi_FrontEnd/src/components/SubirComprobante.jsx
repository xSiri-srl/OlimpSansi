import { useState } from "react";

const SubirComprobante = () => {
  const [code, setCode] = useState("");

  return (
    <div class="p-14">
    <div className="max-w-5xl  mx-auto bg-gray-300 p-6 shadow-lg rounded-lg">

      {/* Progreso */}
      <div className="flex items-center justify-between mb-6">
        {["Ingresar código", "Subir comprobante", "Escanear", "Ver datos escaneados", "Finalizar"].map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              index === 0 ? "bg-blue-600 text-white border-blue-600" : "border-gray-400 text-gray-400"
            }`}>
              {index + 1}
            </div>
            <span className={`text-xs mt-2 ${index === 0 ? "text-blue-600" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <div className="grid grid-cols-2 gap-6">
        {/* Izquierda - Campo de código */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Ingrese el código generado en el formulario anterior para continuar con su inscripción</h2>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Ingrese el código"
          />
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Verificar
          </button>
        </div>

        {/* Derecha - Ejemplo de comprobante */}
        <div className="bg-gray-300 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Ejemplo:</h3>
          <div className="bg-gray-400 p-6 rounded-md flex flex-col items-center justify-center">
            <div className="bg-gray-200 w-full h-16 mb-4"></div>
            <div className="bg-red-500 text-white px-2 py-1 rounded-md">fhdjfsjfs</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SubirComprobante;
