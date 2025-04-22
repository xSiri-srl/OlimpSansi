import React from "react";
import { FaCircle } from "react-icons/fa";

const OrdenesRecientes = ({ darkMode }) => {
  const mockOrders = [
    {
      id: "TSOL-2025-001",
      responsable: "María Fernanda López",
      fecha: "20 Abr 2025",
      monto: 350,
      estado: "pagado"
    },
    {
      id: "TSOL-2025-002",
      responsable: "Carlos Eduardo Pérez",
      fecha: "19 Abr 2025",
      monto: 450,
      estado: "pendiente"
    },
    {
      id: "TSOL-2025-003",
      responsable: "Ana Lucía Rodríguez",
      fecha: "18 Abr 2025",
      monto: 250,
      estado: "pagado"
    },
    {
      id: "TSOL-2025-004",
      responsable: "José Miguel Torres",
      fecha: "17 Abr 2025",
      monto: 550,
      estado: "pendiente"
    },
    {
      id: "TSOL-2025-005",
      responsable: "Laura Valentina Paz",
      fecha: "16 Abr 2025",
      monto: 300,
      estado: "pagado"
    },
    {
      id: "TSOL-2025-006",
      responsable: "Roberto Carlos Méndez",
      fecha: "15 Abr 2025",
      monto: 400,
      estado: "pendiente"
    }
  ];

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
      <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Órdenes de Pago Recientes
        </h3>
      </div>
      
      <div className="overflow-auto max-h-[400px]">
        {mockOrders.map((order) => (
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