import { FaCheckCircle } from "react-icons/fa";

const ExitoModal = ({ 
  isOpen, 
  titulo = "¡Operación exitosa!", 
  mensaje, 
  textoBoton = "Aceptar",
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-5xl" />
        </div>
        
        <h2 className="text-lg font-semibold mb-4">
          {titulo}
        </h2>
        
        <p className="text-gray-600 mb-4">{mensaje}</p>
        
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md"
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
};

export default ExitoModal;