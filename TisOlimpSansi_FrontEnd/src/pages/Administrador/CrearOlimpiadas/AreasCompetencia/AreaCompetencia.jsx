import { useState } from "react";
import { FaTrash, FaCoins, FaPencilAlt } from "react-icons/fa";
import SelectorArea from "./SelectorArea";
import ConfiguracionGrados from "./CongifuracionGrados";
import ModalCosto from "./ModalCosto";
import { areasDefault } from "./constants";

const AreaCompetencia = ({ 
  combo, 
  comboIndex, 
  combinaciones, 
  setCombinaciones, 
  eliminarCombinacion
}) => {
  const [modalCostoOpen, setModalCostoOpen] = useState(false);

  const cambiarModoRango = (valor) => {
    const copia = [...combinaciones];
    copia[comboIndex].modoRango = valor;
    
    // Si cambiamos a modo rango y no hay categorías, inicializar con una vacía
    if (valor && (!copia[comboIndex].categoriasRango || copia[comboIndex].categoriasRango.length === 0)) {
      copia[comboIndex].categoriasRango = [{ rangoInicial: "", rangoFinal: "", nombre: "" }];
    }
    
    setCombinaciones(copia);
  };

  const actualizarCosto = (nuevoCosto) => {
    const copia = [...combinaciones];
    copia[comboIndex].costoInscripcion = nuevoCosto;
    setCombinaciones(copia);
  };

  return (
    <div className="relative bg-white p-4 rounded-lg mb-4 shadow border-l-4 border-blue-500">
      <button
        onClick={() => eliminarCombinacion(comboIndex)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Eliminar área"
      >
        <FaTrash />
      </button>

      <SelectorArea 
        combo={combo} 
        comboIndex={comboIndex} 
        combinaciones={combinaciones} 
        setCombinaciones={setCombinaciones} 
      />

      {combo.costoInscripcion && (
        <div className="mb-3 flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex items-center">
            <FaCoins className="text-yellow-500 mr-2" />
            <span className="font-medium">Costo de inscripción: </span>
            <span className="ml-1 text-green-700 font-semibold">Bs. {combo.costoInscripcion}</span>
          </div>
          <button
            onClick={() => setModalCostoOpen(true)}
            className="text-blue-500 hover:text-blue-700"
            title="Editar costo"
          >
            <FaPencilAlt />
          </button>
        </div>
      )}

      <div className="mb-3">
        <button
          onClick={() => setModalCostoOpen(true)}
          className={`text-sm flex items-center gap-1 ${
            combo.costoInscripcion ? "text-blue-500 hover:text-blue-700" : "bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-100"
          }`}
        >
          <FaCoins />
          {combo.costoInscripcion ? "Editar costo de inscripción" : "Agregar costo de inscripción"}
        </button>
      </div>

      {combo.area && (
        <div className="ml-4 border-l-2 border-blue-200 pl-4">
          {/* Opción de modo por área */}
          <div className="mb-4">
            <label className="font-medium mb-3 text-gray-700">Modo de configuración para esta área:</label>
            <div className="flex items-center mt-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  checked={!combo.modoRango}
                  onChange={() => cambiarModoRango(false)}
                  className="mr-2"
                />
                Grados individuales
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={combo.modoRango}
                  onChange={() => cambiarModoRango(true)}
                  className="mr-2"
                />
                Rango de grados
              </label>
            </div>
          </div>

          <h4 className="font-medium mb-3 text-gray-700">
            Configuración de categorías y grados
          </h4>

          <ConfiguracionGrados
            combo={combo}
            comboIndex={comboIndex}
            combinaciones={combinaciones}
            setCombinaciones={setCombinaciones}
          />
        </div>
      )}

      <ModalCosto 
        isOpen={modalCostoOpen}
        onClose={() => setModalCostoOpen(false)}
        onConfirm={actualizarCosto}
        costoActual={combo.costoInscripcion}
      />
    </div>
  );
};

export default AreaCompetencia;