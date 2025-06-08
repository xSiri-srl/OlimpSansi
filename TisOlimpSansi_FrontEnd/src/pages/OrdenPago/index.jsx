import React from "react";
import { useOrdenPago } from "./hooks/useOrdenPago";
import CodigoVerificacion from "./componentes/CodigoVerificacion";
import ResumenPreinscripcion from "./componentes/ResumenPreInscripcion";
import AccionesOrdenPago from "./componentes/AccionesOrdenPago";

const GenerarOrdenPago = () => {
  const {
    // Estados
    error,
    loading,
    codigoGenerado,
    resumen,
    cargando,
    descargando,
    mostrarModal,
    ordenYaGenerada,
    progreso,
    pdfUrl,
    mostrarPrevisualizacion,
    costoUnico,
    costosPorArea,
    tieneCostoUnico,
    costosLoading,

    // Setters
    setMostrarModal,

    // Funciones
    verificarCodigo,
    calcularTotal,
    obtenerDesglosePorArea,
    confirmarGenerarOrden,
    handleDownload,
    togglePrevisualizacion,
    handleCodigoChange,
  } = useOrdenPago();

  return (
    <div className="p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 sm:p-9 shadow-lg rounded-lg">
        {/* Componente de verificación de código */}
        <CodigoVerificacion
          codigoGenerado={codigoGenerado}
          error={error}
          loading={loading}
          verificarCodigo={verificarCodigo}
          handleCodigoChange={handleCodigoChange}
        />

        {/* Componente del resumen de preinscripción */}
        <ResumenPreinscripcion
          resumen={resumen}
          costosLoading={costosLoading}
          tieneCostoUnico={tieneCostoUnico}
          costoUnico={costoUnico}
          costosPorArea={costosPorArea}
          obtenerDesglosePorArea={obtenerDesglosePorArea}
          calcularTotal={calcularTotal}
        />

        {/* Componente de acciones (solo se muestra si hay resumen) */}
        {resumen && (
          <AccionesOrdenPago
            cargando={cargando}
            descargando={descargando}
            ordenYaGenerada={ordenYaGenerada}
            pdfUrl={pdfUrl}
            mostrarPrevisualizacion={mostrarPrevisualizacion}
            mostrarModal={mostrarModal}
            progreso={progreso}
            codigoGenerado={codigoGenerado}
            confirmarGenerarOrden={confirmarGenerarOrden}
            togglePrevisualizacion={togglePrevisualizacion}
            handleDownload={handleDownload}
            setMostrarModal={setMostrarModal}
          />
        )}
      </div>
    </div>
  );
};

export default GenerarOrdenPago;
