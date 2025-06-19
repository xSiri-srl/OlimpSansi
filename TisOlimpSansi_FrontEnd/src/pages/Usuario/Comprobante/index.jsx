import StepIndicator from "./components/StepIndicator";
import CodigoStep from "./components/CodigoStep";
import SubirArchivoStep from "./components/SubirArchivoStep";
import EscanearStep from "./components/EscanearStep";
import DatosEscaneadosStep from "./components/DatosEscaneadosStep";
import ExitoModal from "../../../components/Modales/ExitoModal";
import ModalPeriodo from "../../../components/Modales/ModalPeriodo";
import { useSubirComprobante } from "./hooks/useSubirComprobante";

const SubirComprobante = () => {
  const {
    step,
    setStep,
    selectedFile,
    preview,
    loading,
    error,
    codigoGenerado,
    setCodigoGenerado,
    nombreResponsableRegistrado,
    numeroComprobante,
    setNumeroComprobante,
    comprobanteNombre,
    setcomprobanteNombre,
    fechaComprobante,
    setfechaComprobante,
    errorNumero,
    errorNombre,
    errorFecha,
    errorNumeroUnico,
    setErrorNumeroUnico,
    showModalExito,
    showPeriodoModal,
    setShowPeriodoModal,
    olimpiadaInfo,
    verificarCodigo,
    handleFileChange,
    procesarComprobante,
    handleFinalizar,
    handleAceptar,
    handleScanAgain,
    handleCropSelection
  } = useSubirComprobante();

  const stepConfig = [
    "Ingresar código",
    "Subir comprobante",
    "Escanear",
    "Ver datos escaneados",
    "Finalizar",
  ];

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
        <StepIndicator steps={stepConfig} currentStep={step} />

        {step === 1 && (
          <CodigoStep
            codigoGenerado={codigoGenerado}
            setCodigoGenerado={setCodigoGenerado}
            error={error}
            loading={loading}
            onVerificar={verificarCodigo}
          />
        )}

        {step === 2 && (
          <SubirArchivoStep
            onFileChange={handleFileChange}
            selectedFile={selectedFile}
            error={error}
          />
        )}

        {step === 3 && (
          <EscanearStep
            preview={preview}
            selectedFile={selectedFile}
            loading={loading}
            error={error}
            onBack={() => setStep(2)}
            onCropSelection={handleCropSelection}
            onProcesar={procesarComprobante}
          />
        )}

        {step === 4 && (
          <DatosEscaneadosStep
            preview={preview}
            selectedFile={selectedFile}
            numeroComprobante={numeroComprobante}
            setNumeroComprobante={setNumeroComprobante}
            comprobanteNombre={comprobanteNombre}
            setcomprobanteNombre={setcomprobanteNombre}
            fechaComprobante={fechaComprobante}
            setfechaComprobante={setfechaComprobante}
            errorNumero={errorNumero}
            errorNombre={errorNombre}
            errorFecha={errorFecha}
            errorNumeroUnico={errorNumeroUnico}
            setErrorNumeroUnico={setErrorNumeroUnico}
            loading={loading}
            error={error}
            onScanAgain={handleScanAgain}
            onFinalizar={handleFinalizar}
          />
        )}

        <ExitoModal 
          isOpen={showModalExito}
          titulo="¡Su comprobante fue subido con éxito!"
          mensaje="FINALIZÓ SU INSCRIPCIÓN"
          textoBoton="Aceptar"
          onClose={handleAceptar}
        />

        <ModalPeriodo
          isOpen={showPeriodoModal}
          onClose={() => setShowPeriodoModal(false)}
          fechaIni={olimpiadaInfo.fechaIni}
          fechaFin={olimpiadaInfo.fechaFin}
        />
      </div>
    </div>
  );
};

export default SubirComprobante;