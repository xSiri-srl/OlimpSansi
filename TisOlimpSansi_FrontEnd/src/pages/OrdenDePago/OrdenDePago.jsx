"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { FaDownload, FaPrint, FaMapMarkerAlt, FaCopy, FaYoutube } from "react-icons/fa"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import axios from "axios"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Solución para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const OrdenPago = () => {
  const { state } = useLocation()
  const [codigo, setCodigo] = useState("")
  const ubicacionCaja = [-17.3934698, -66.1448631]

  useEffect(() => {
    // Obtener el código de la ubicación
    if (state && state.codigoGenerado) {
      setCodigo(state.codigoGenerado)
    }
  }, [state])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigo)
    alert("Código copiado al portapapeles")
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orden-pago/${codigo}`, { responseType: "blob" })
      console.log("Código actual:", codigo)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `orden-pago-${codigo}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error("Error descargando PDF:", error)
      alert("Error al descargar la orden de pago")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Alerta importante */}
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p className="font-bold">¡SU INSCRIPCIÓN NO TERMINÓ!</p>
        <p>Complete el proceso subiendo su comprobante después de pagar</p>
      </div>

      {/* Sección de descarga */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Orden de Pago Generada</h2>
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center mx-auto mb-4"
        >
          <FaDownload className="mr-2" />
          Descargar Orden de Pago
        </button>
        <p className="text-sm text-gray-600">Si no se descargó automáticamente, use el botón anterior</p>
      </div>

      {/* Instrucciones */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-start mb-4">
          <FaPrint className="text-2xl mr-3 text-yellow-600" />
          <div>
            <h3 className="font-bold mb-1">IMPRIMA LA ORDEN DE PAGO</h3>
            <p className="text-sm">Para realizar el pago en Caja Facultativa</p>
            <p className="text-xs text-gray-600 mt-1">El pago debe ser realizado por el responsable de inscripción</p>
          </div>
        </div>

        <div>
          {/* Video Tutorial y Mapa lado a lado */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Video Tutorial */}
            <div className="flex items-start md:w-1/2">
              <FaYoutube className="text-2xl mr-3 text-red-600" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">VIDEO TUTORIAL</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.youtube.com/embed/MqsQI2Di2xY"
                    title="Tutorial de ubicación"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-48 rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Mapa de ubicación */}
            <div className="flex items-start md:w-1/2">
              <FaMapMarkerAlt className="text-2xl mr-3 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">UBICACIÓN PARA PAGO</h3>
                <div className="h-48 rounded-lg overflow-hidden shadow-sm">
                  <MapContainer center={ubicacionCaja} zoom={17} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={ubicacionCaja}>
                      <Popup>
                        <div className="text-sm">
                          <strong>Caja FCyT</strong>
                          <br />
                          Universidad Mayor de San Simón
                          <br />
                          Nivel 1 - Av. Oquendo S/N
                          <br />
                          Cochabamba, Bolivia
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  Horario de atención: Lunes a Viernes 8:30 - 12:30 / 14:30 - 18:30
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Código de orden */}
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
        <h4 className="text-sm font-semibold mb-2">GUARDE ESTE CÓDIGO DE ORDEN</h4>
        <div className="flex items-center justify-center space-x-2">
          <span className="bg-gray-100 px-4 py-2 rounded-md font-mono">{codigo}</span>
          <button onClick={handleCopyCode} className="p-2 hover:bg-gray-100 rounded-lg" title="Copiar código">
            <FaCopy className="text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Necesitará este código para subir su comprobante de pago</p>
      </div>

      {/* Nota final */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Después de realizar el pago, vuelva a esta plataforma para subir su comprobante
      </p>
    </div>
  )
}

export default OrdenPago
