import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { API_URL } from "../../../utils/api";
import axios from "axios";

const OrdenesRecientes = ({ darkMode, olimpiadaSeleccionada }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrdenesRecientes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificación más robusta de olimpiada seleccionada
        if (!olimpiadaSeleccionada || 
            typeof olimpiadaSeleccionada !== 'object' || 
            (!olimpiadaSeleccionada.id && !olimpiadaSeleccionada.ID)) {
          console.log('No hay olimpiada seleccionada válida');
          setOrders([]);
          setLoading(false);
          return;
        }

        const olimpiadaId = olimpiadaSeleccionada.id;
        
        console.log('Fetching orders for olimpiada:', olimpiadaId); // Debug
        
        const response = await axios.get(`${API_URL}/api/ordenes-recientes`, {
          params: { olimpiada_id: olimpiadaId }
        });
        console.log("tamanioooo: ", response.data.length)
        console.log('Response data:', response.data); // Debug
        setOrders(response.data || []);
        
      } catch (err) {
        console.error("Error al cargar órdenes recientes:", err);
        console.error("Error details:", err.response?.data); // Más detalles del error
        setError(`Error al cargar datos del servidor: ${err.response?.data?.message || err.message}`);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdenesRecientes();
  }, [olimpiadaSeleccionada]); 

  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Órdenes de Pago
          </h3>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Órdenes de Pago
          </h3>
        </div>
        <div className="p-6 text-center text-red-500">
          {error}
          <p className="text-xs mt-2 opacity-60">
            Debug: olimpiadaSeleccionada = {JSON.stringify(olimpiadaSeleccionada)}
          </p>
        </div>
      </div>
    );
  }

  // Verificación más específica para mostrar el mensaje de selección
  const hasValidOlimpiada = olimpiadaSeleccionada && 
                           typeof olimpiadaSeleccionada === 'object' && 
                           (olimpiadaSeleccionada.id || olimpiadaSeleccionada.ID);

  if (!hasValidOlimpiada) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Órdenes de Pago
          </h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          Selecciona una olimpiada para ver las órdenes recientes
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Órdenes de Pago 
          </h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          No hay órdenes de pago en esta olimpiada
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
      <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Órdenes de Pago
        </h3>
        {olimpiadaSeleccionada && (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
            {olimpiadaSeleccionada.titulo || olimpiadaSeleccionada.nombre || 'Olimpiada'}
          </p>
        )}
      </div>
      
      <div className="overflow-auto max-h-[400px]">
        {orders.map((order) => (
          <div 
            key={order.id}
            className={`px-6 py-4 flex justify-between items-center border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div>
              <p className={`font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                {order.id}
              </p>
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {order.responsable}
              </p>
            </div>
            
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {order.fecha}
            </div>
            
            <div className="flex items-center">
              <span className={`
                px-3 py-1 rounded-full text-sm flex items-center gap-1.5 
                ${order.estado === "pagado" 
                  ? darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800" 
                  : darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800"
                }
              `}>
                <FaCircle className="text-xs" />
                {order.estado === "pagado" ? "Pagado" : "Pendiente"}
              </span>
              <span className={`ml-4 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                {order.monto} Bs.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdenesRecientes;