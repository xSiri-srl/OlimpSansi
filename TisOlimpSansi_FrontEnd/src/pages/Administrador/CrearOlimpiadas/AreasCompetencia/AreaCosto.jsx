import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import ModalCosto from "./ModalCosto";

const AreaCosto = ({ area, actualizarCosto }) => {
  const [modalCostoOpen, setModalCostoOpen] = useState(false);
  
  // Función mejorada para mapear áreas a imágenes
  const getAreaImage = (areaName) => {
    if (!areaName) return "/placeholder.svg";
    
    // Normalizar el nombre para manejo consistente
    const normalizedName = String(areaName)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Quitar acentos
      .replace(/[-_\s]+/g, " ")         // Unificar separadores
      .trim();                          // Quitar espacios al inicio y final
    
    console.log(`Buscando imagen para área: "${areaName}" (normalizado: "${normalizedName}")`);
    
    // Mapeo más flexible usando coincidencias parciales
    if (normalizedName.includes("matematica")) return "/images/matematicaas.png";
    if (normalizedName.includes("fisica")) return "/images/fisica.png";
    if (normalizedName.includes("quimica")) return "/images/quimica.png";
    if (normalizedName.includes("biologia")) return "/images/biologia.png";
    if (normalizedName.includes("informatica")) return "/images/informatica.png";
    if (normalizedName.includes("robotica")) return "/images/robotica.png";
    if (normalizedName.includes("astronom")) return "/images/astronomia.png";
    
    console.log(`⚠️ No se encontró imagen para: "${areaName}"`);
    return "/placeholder.svg";
  };

  // Función para manejar la confirmación del modal
  const handleModalConfirm = (nuevoCosto) => {
    actualizarCosto(nuevoCosto);
    setModalCostoOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 transition-all duration-300">
      <div className="flex items-start">
        {/* Imagen del área */}
        <div className="w-32 mr-6 text-center">
          <img 
            src={getAreaImage(area.area)} 
            alt={area.area || "Área de competencia"} 
            className="w-24 h-24 mx-auto mb-2 rounded-lg"
            onError={(e) => {
              console.error(`Error cargando imagen para ${area.area}`);
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Título del área */}
          <div className="mb-3 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-700">{area.area}</h2>
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Área asociada
              </span>
            </div>
          </div>

          {/* Información de niveles simplificada */}
          {(area.niveles || area.rangos) && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {area.niveles ? 
                  `${area.niveles.length} ${area.niveles.length === 1 ? 'nivel' : 'niveles'} configurados` : 
                  area.rangos ? 
                  `${area.rangos.length} ${area.rangos.length === 1 ? 'nivel' : 'niveles'} configurados` : 
                  "Sin niveles configurados"}
              </p>
            </div>
          )}

          {/* Información de costo actual */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCoins className="text-yellow-500 mr-2" />
                <span className="font-medium">Costo de inscripción: </span>
                <span className="ml-1 text-green-700 font-semibold">
                  {area.costoInscripcion ? `Bs. ${area.costoInscripcion}` : "No definido"}
                </span>
              </div>
              <button
                onClick={() => setModalCostoOpen(true)}
                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 text-sm flex items-center gap-1"
              >
                <FaCoins className="text-sm" />
                {area.costoInscripcion && Number(area.costoInscripcion) > 0 ? "Modificar costo" : "Asignar costo"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para configurar el costo */}
      <ModalCosto
        isOpen={modalCostoOpen}
        onClose={() => setModalCostoOpen(false)}
        onConfirm={handleModalConfirm}
        costoActual={area.costoInscripcion}
      />
    </div>
  );
};

export default AreaCosto;