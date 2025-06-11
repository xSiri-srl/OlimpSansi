import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaFileInvoiceDollar, FaCheckCircle, FaUserGraduate } from "react-icons/fa";
import StatCard from './StatCard';

const StatisticsCards = ({ stats, darkMode, olimpiadaSeleccionada }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      

      <div className="relative group">
        <Link
          to={`/admin/preInscritos?olimpiada=${olimpiadaSeleccionada?.id}`}
          className="block transform transition hover:-translate-y-1 hover:shadow-lg"
        >
          <StatCard
            title="Pre-inscritos"
            value={stats.estudiantesRegistrados}
            icon={<FaUsers />}
            bgColor="bg-green-50"
            textColor="text-green-600"
            darkMode={darkMode}
          />
        </Link>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
          Generar lista de pre-inscritos
        </div>
      </div>

      <div className="relative group">
        <Link
          to={`/admin/inscritos_verificados?olimpiada=${olimpiadaSeleccionada?.id}`}
          className="block transform transition hover:-translate-y-1 hover:shadow-lg"
        >
          <StatCard
            title="Inscripciones Verificadas"
            value={stats.estudiantesInscritos}
            icon={<FaCheckCircle />}
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
            darkMode={darkMode}
          />
        </Link>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
          Generar lista de inscritos verificados
        </div>
      </div>

      <div className="relative group">
        <Link
          to={`/admin/descargar_listas?olimpiada=${olimpiadaSeleccionada?.id}`}
          className="block transform transition hover:-translate-y-1 hover:shadow-lg"
        >
          <StatCard
            title="Total Competidores"
            value={stats.totalInscritos}
            icon={<FaUserGraduate />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
            darkMode={darkMode}
          />
        </Link>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
          Generar lista de inscritos
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;