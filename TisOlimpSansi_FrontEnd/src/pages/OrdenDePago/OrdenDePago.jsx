import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaPrint,
  FaMapMarkerAlt,
  FaCopy,
  FaYoutube,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Iconos para Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const OrdenPago = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [codigo, setCodigo] = useState("");
  const ubicacionCaja = [-17.3934698, -66.1448631];

  useEffect(() => {
    // Hacer scroll al inicio de la página al cargar el componente
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (state?.codigoGenerado) {
      setCodigo(state.codigoGenerado);
      
    }
  }, [state]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigo);
    alert("Código copiado al portapapeles");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-2xl space-y-10 animate-fade-in">
      {/* Alerta */}
      <div className="bg-red-100 border-l-8 border-red-600 p-6 rounded-xl shadow-lg animate-pulse">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-red-700 mb-2">
            ¡SU INSCRIPCIÓN NO HA FINALIZADO!
          </h1>
          <p className="text-lg font-medium text-red-800">
            Debe realizar el pago para completar su inscripción, siga los
            siguientes pasos:
          </p>
        </div>
      </div>

      {/* Código generado */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          GUARDE Y RECUERDE ESTE CÓDIGO DE ORDEN
        </h2>
        <div className="inline-flex items-center space-x-3 bg-blue-100 border-2 border-blue-500 rounded-full px-6 py-3 shadow-md">
          <span className="text-lg font-mono tracking-widest text-blue-900">
            {codigo}
          </span>
          <button
            onClick={handleCopyCode}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            title="Copiar código"
          >
            <FaCopy className="text-xl" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Lo necesitará para generar su orden de pago y subir su comprobante de
          pago.
        </p>
      </div>

      {/* Instrucciones */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-8">
        <h3 className="text-2xl font-extrabold text-yellow-800 mb-6">
          Siga estos pasos:
        </h3>
        <div className="space-y-6">
          <div className="flex items-start">
            <span className="bg-blue-500 font-bold text-white px-3 py-1 rounded-full mr-4">
              1
            </span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                Una vez que haya copiado el código generado
              </h4>
              <p className="text-sm text-gray-600">
                Rediríjase a la pestaña <strong>"Generar Orden de pago"</strong>
                .
              </p>
              <div className="flex justify-center mt-4 w-full">
                <img
                  src="/images/generar.png"
                  alt="ejemplo_Navbar"
                  className="h-25 w-auto rounded-lg shadow"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <span className="bg-blue-500 font-bold text-white px-3 py-1 rounded-full mr-4">
              2
            </span>
            <div>
              <h4 className="font-semibold text-gray-800">
                Imprima la orden de pago
              </h4>
              <p className="text-sm text-gray-600">
                Lleve el documento para realizar el pago en Caja Facultativa.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="bg-blue-500 font-bold text-white px-3 py-1 rounded-full mr-4">
              3
            </span>
            <div className="w-full">
              <h4 className="font-semibold text-gray-800">
                Realice el pago presencial
              </h4>
              <div className="h-48 mt-3 rounded-lg overflow-hidden">
                <MapContainer
                  center={ubicacionCaja}
                  zoom={17}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={ubicacionCaja}>
                    <Popup>
                      <div className="text-sm">
                        <strong>Caja FCyT</strong>
                        <br />
                        Universidad Mayor de San Simón
                        <br />
                        Av. Oquendo S/N, Nivel 1 - Cochabamba, Bolivia
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Horario de atención: Lunes a Viernes 8:30 - 12:30 / 14:30 -
                18:30
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="bg-blue-500 font-bold text-white px-3 py-1 rounded-full mr-4">
              4
            </span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                Una vez que haya realizado el pago
              </h4>
              <p className="text-sm text-gray-600">
                Rediríjase a la pestaña <strong>"Subir comprobante"</strong>.
              </p>
              <div className="flex justify-center mt-4 w-full">
                <img
                  src="/images/Navbar.png"
                  alt="ejemplo_Navbar"
                  className="h-25 w-auto rounded-lg shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje final */}
      <p className="text-center text-sm text-gray-500">
        Una vez realizado el pago, vuelva a esta plataforma para subir el
        comprobante.
      </p>

      {/* Botón para continuar */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default OrdenPago;
