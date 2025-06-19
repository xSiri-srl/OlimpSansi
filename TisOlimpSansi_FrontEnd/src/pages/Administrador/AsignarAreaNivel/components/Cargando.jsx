import React from "react";

const Cargando = ({ mensaje }) => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      <p className="mt-2 text-gray-600">{mensaje}</p>
    </div>
  );
};

export default Cargando;