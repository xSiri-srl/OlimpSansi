import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaDownload, FaPrint, FaMapMarkerAlt, FaCopy, FaYoutube } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const OrdenPago = () => {
  const { state } = useLocation();
  const ordenPago = state?.ordenPago || {};
  
  // Coordenadas del OSM
  const ubicacionCaja = [-17.3934698, -66.1448631];
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(ordenPago.codigo);
    alert('Código copiado al portapapeles');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* ... Secciones anteriores ... */}

      {/* Sección de ubicación mejorada */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-start mb-4">
          <FaYoutube className="text-2xl mr-3 text-red-600" />
          <div className="flex-1">
            <h3 className="font-bold mb-2">Video Tutorial</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src="https://www.youtube.com/embed/MqsQI2Di2xY" 
                title="Tutorial de ubicación"
                allowFullScreen
                className="w-full h-48 rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <FaMapMarkerAlt className="text-2xl mr-3 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-bold mb-2">Ubicación Exacta</h3>
            <div className="h-64 rounded-lg overflow-hidden shadow-sm">
              <MapContainer 
                center={ubicacionCaja} 
                zoom={17} 
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={ubicacionCaja}>
                  <Popup>
                    <div className="text-sm">
                      <strong>Caja FCyT</strong><br/>
                      Universidad Mayor de San Simón<br/>
                      Nivel 1
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <p className="text-sm mt-2 text-gray-600">
              Av. Oquendo S/N, Cochabamba, Bolivia
            </p>
          </div>
        </div>
      </div>

      {/* ... Resto del componente ... */}
    </div>
  );
};

export default OrdenPago;