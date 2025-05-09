import {useState} from "react";
const ModalCosto = ({ isOpen, onClose, onConfirm, costoActual }) => {
    const [costo, setCosto] = useState(costoActual || "");
    
    if (!isOpen) return null;
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onConfirm(costo);
      onClose();
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold mb-4">Costo de Inscripción</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-1">Monto en Bs.</label>
              <div className="flex items-center">
                <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md">Bs.</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. 50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default ModalCosto;