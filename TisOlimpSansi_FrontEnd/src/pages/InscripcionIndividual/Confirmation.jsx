import { useState, useEffect } from "react";
import { useFormData } from "./form-data-context";
import axios from "axios"
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import ExitoModal from "../InscripcionLista/Modales/ExitoModal";
import ErrorModal from "../InscripcionLista/Modales/RegistrosInvalidosModal";
import { API_URL } from "../../utils/api";

const Confirmation = ({ navigate, handleBack }) => {
  const {globalData, setGlobalData}  = useFormData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    globalData.areas_competencia?.forEach((area) => {

    });
  }, [globalData]);

  const handleGoBack = (e) => {
    e.preventDefault();
    handleBack();
  };


  console.log('Datos sd:',globalData)

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    setShowProgressBar(true);
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newValue = prev + 2;
        if (newValue >= 90) {
          clearInterval(progressInterval);
          return 90; 
        }
        return newValue;
      });
    }, 100);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/inscribir`,
        globalData
      );
      const codigoGenerado = response.data.codigo_generado;
      setCodigoGenerado(codigoGenerado);

      setUploadProgress(100);
      clearInterval(progressInterval);

      setSubmitStatus({
        success: true,
        message: "Inscripción registrada correctamente.",
      });

      setShowProgressBar(false);
      setShowSuccessModal(true); 
    } catch (error) {
      console.error("Error al registrar los datos", error);
      clearInterval(progressInterval);
      setShowProgressBar(false);
      
      let rawMessage = error.response?.data?.message || error.response?.data?.error || error.message || "";
      let mensajeFinal = rawMessage;

      if (rawMessage.includes("Areas/categorias válidas:")) {
        const [mensajeBase, combinacionesRaw] = rawMessage.split(
          "Combinaciones válidas:"
        );
        const combinaciones = combinacionesRaw
          .split("-")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        mensajeFinal = `${mensajeBase.trim()}\n\nCombinaciones válidas:\n${combinaciones
          .map((c) => `• ${c}`)
          .join("\n")}`;
      }

      setErrorMessage(mensajeFinal);
      setShowErrorModal(true);
      
      setSubmitStatus({
        success: false,
        message: mensajeFinal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setShowProgressBar(false);
    navigate("/orden-pago", { state: { codigoGenerado } });
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">Resumen de Registro</h2>
      <p className="text-gray-600 mb-6">
        Por favor, revise la información antes de confirmar
      </p>

      <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-left max-w-3xl mx-auto">
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">
            Responsable de Inscripción
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium">
                {`${globalData.responsable_inscripcion?.nombre || ""} 
                  ${globalData.responsable_inscripcion?.apellido_pa || ""} 
                  ${globalData.responsable_inscripcion?.apellido_ma || ""}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carnet de Identidad</p>
              <p className="font-medium">
                {globalData.responsable_inscripcion?.ci || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Correo Electrónico</p>
              <p className="font-medium">
                {globalData.responsable_inscripcion?.correo_responsable || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">
            Datos del Estudiante
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium">
                {`${globalData.estudiante?.nombre || ""} 
                  ${globalData.estudiante?.apellido_pa || ""} 
                  ${globalData.estudiante?.apellido_ma || ""}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carnet de Identidad</p>
              <p className="font-medium">{globalData.estudiante?.ci || ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
              <p className="font-medium">
                {globalData.estudiante?.fecha_nacimiento || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Correo Electrónico</p>
              <p className="font-medium">
                {globalData.estudiante?.correo || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">
            Datos de la Unidad Educativa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">
                Nombre de la Unidad Educativa
              </p>
              <p className="font-medium">
                {globalData.colegio?.nombre_colegio || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Curso</p>
              <p className="font-medium uppercase">
                {globalData.colegio?.curso || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Departamento</p>
              <p className="font-medium uppercase">
                {globalData.colegio?.departamento || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Distrito</p>
              <p className="font-medium">
                {globalData.colegio?.distrito || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">
            Áreas de Competencia
          </h3>
          <div className="mt-2">
            {globalData.areas_competencia?.length > 0 ? (
              globalData.areas_competencia.map((area, index) => (
                <div key={index} className="bg-gray-100 rounded px-3 py-2 mb-2">
                  <p className="font-medium">{area.nombre_area || ""}</p>
                  {area.categoria && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500">Categoría: </span>
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {area.categoria}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No se seleccionaron áreas de competencia
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">Tutor Legal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium">
                {`${globalData.tutor_legal?.nombre || ""} 
                  ${globalData.tutor_legal?.apellido_pa || ""} 
                  ${globalData.tutor_legal?.apellido_ma || ""}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carnet de Identidad</p>
              <p className="font-medium">{globalData.tutor_legal?.ci || ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Correo Electrónico</p>
              <p className="font-medium">
                {globalData.tutor_legal?.correo || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">
                {globalData.tutor_legal?.numero_celular || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-medium">
                {globalData.tutor_legal?.tipo || ""}
              </p>
            </div>
          </div>
        </div>

        {globalData.tutores_academicos &&
          globalData.tutores_academicos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600">
                Tutores Académicos
              </h3>
              {globalData.tutores_academicos.map((tutor, index) => (
                <div key={index} className="bg-gray-100 rounded p-3 mb-2">
                  <p className="font-medium text-gray-700">
                    {tutor.nombre_area}
                  </p>
                  {tutor.checkbox_activo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Nombre Completo</p>
                        <p className="font-medium">
                          {`${tutor.tutor?.nombre || ""} 
                          ${tutor.tutor?.apellido_pa || ""} 
                          ${tutor.tutor?.apellido_ma || ""}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CI</p>
                        <p className="font-medium">{tutor.tutor?.ci || ""}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Correo</p>
                        <p className="font-medium">
                          {tutor.tutor?.correo || ""}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center py-4">
                      <p className="font-bold text-center">
                        SIN TUTOR ACADÉMICO
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        <div className="mt-4 p-2  bg-red-100 border-4 border-red-500 rounded-xl text-center shadow-xl animate-pulse flex items-center justify-center">
          <FaExclamationTriangle className="text-red-700 text-2xl" />
          <p className="text-red-800 font-bold text-sm p-2 tracking-wide">
            Recuerde que el pago debe ser realizado por el responsable de
            inscripción
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handleGoBack}
          disabled={isSubmitting}
          className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-600 shadow-md"
        >
          Atrás
        </button>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:bg-indigo-500 shadow-md"
        >
          Registrar Preinscripción
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-5xl animate-pulse" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              ¿Estás seguro?
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Esta acción registrará la información. Por favor, revisa bien los
              datos. ¿Deseas continuar?
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  setMostrarModal(false);
                  handleSubmit();
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
              >
                <FaCheckCircle className="text-lg" />
                Sí, crear
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
              >
                <FaTimesCircle className="text-lg" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgressBar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Procesando registro...
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              {uploadProgress < 100
                ? "Enviando datos al servidor..."
                : "Completado"}
            </p>
          </div>
        </div>
      )}


      {showSuccessModal && (
        <ExitoModal
          mensaje="Su registro ha sido procesado exitosamente."
          onClose={handleSuccessModalClose}
        />
      )}

      
      {showErrorModal && (
        <ErrorModal
          mensaje={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default Confirmation;