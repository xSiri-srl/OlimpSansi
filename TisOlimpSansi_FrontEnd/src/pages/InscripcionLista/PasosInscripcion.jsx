import React from "react";
import { useNavigate } from "react-router-dom";

const PasosInscripcion = () => {
  const navigate = useNavigate();
  const handleConfirmar = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-red-700 font-bold text-2xl mb-4 text-center">
        ¡SU INSCRIPCIÓN AUN NO TERMINÓ!
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Paso 1 y 2 */}
        <div className="bg-slate-200 p-4 rounded w-full md:w-1/2">
          <div className="mb-4">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2">1</span>
            Descargue la siguiente orden de pago:
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="bg-slate-400 w-52 h-60 flex flex-col justify-center items-center text-center mb-2">
                <p>Orden de pago</p>
                <p className="text-3xl">PDF</p>
                <p className="text-2xl">⬇️</p>
              </div>
              <button className="bg-green-400 text-white px-4 py-2 rounded">
                Descargar
              </button>
            </div>
          </div>

          <div className="mt-4">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2">2</span>
            Recuerda este código, mas adelante se te pedirá para seguir con su inscripción:

            <div className="border-2 border-green-500 text-center mt-2 p-2">
              ZCZXCZC
            </div>
          </div>
        </div>

        {/* Paso 3 y 4 */}
        <div className="bg-slate-200 p-4 rounded w-full md:w-1/2">
        <div className="mb-4">
  <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2">3</span>
  Con la orden de pago impresa, diríjase a las cajas facultativas
</div>

<div className="flex justify-center mb-4">
  <div className="bg-slate-400 w-80 h-48 flex justify-center items-center">
    <iframe
      title="Mapa"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1195.8612683389127!2d-58.43876809357229!3d-34.60373898223974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb6c7f682799%3A0x6a4c58ad35e32f94!2sUBA!5e0!3m2!1ses-419!2sar!4v1643134347643!5m2!1ses-419!2sar"
      width="100%"
      height="100%"
      allowFullScreen=""
      loading="lazy"
      className="rounded"
    ></iframe>
  </div>
</div>


<div className="flex justify-center">
  <a
    href="https://g.co/kgs/GBSciku"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7-7.5 11.25-7.5 11.25S4.5 17.5 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
    Ver ubicación
  </a>
</div>
          <div className="mt-10">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2">4</span>
            Cuando ya haya pagado, redirígete a la pestaña "Subir comprobante"
          </div>

          <div className="flex justify-center mt-4">
            <div className="bg-slate-700 w-full h-8 flex justify-center items-center text-white text-xs">
            <img
              src="/images/Navbar.png"
              alt="ejemplo_Navbar"
              className="h-12 w-auto"
            />
            </div>
          </div>
         
        </div>
      
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleConfirmar}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default PasosInscripcion;
