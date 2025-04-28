import { useState, useEffect } from "react";
import axios from "axios";
import { useFormData } from "./form-data-context";
import { FaCheckCircle } from "react-icons/fa";
import ExitoModal from "./../InscripcionLista/Modales/ExitoModal";
const Confirmation = ({ navigate, handleBack }) => {
  const { globalData } = useFormData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState("");

  useEffect(() => {
  
    console.log(globalData);
    globalData.areas_competencia?.forEach((area) => {
      console.log("Nombre del área:", area.nombre_area);
      console.log("Categoría:", area.categoria);
    });

  }, [globalData]);
  

  const handleGoBack = (e) => {
    e.preventDefault();
    console.log("Confirmation: Atrás button clicked");
    handleBack();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    // Iniciar barra de progreso
    setShowProgressBar(true);
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newValue = prev + 2;
        if (newValue >= 90) {
          clearInterval(progressInterval);
          return 90; // Mantenemos en 90% hasta que termine la petición
        }
        return newValue;
      });
    }, 100);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/inscribir",
        globalData
      );
      const codigoGenerado = response.data.codigo_generado;
      setCodigoGenerado(codigoGenerado);

      // Completar la barra de progreso
      setUploadProgress(100);
      clearInterval(progressInterval);

      setSubmitStatus({
        success: true,
        message: "Inscripción registrada correctamente.",
      });

      // Llamar al backend para generar el PDF
     
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al registrar los datos", error);
      clearInterval(progressInterval);
      setShowProgressBar(false);
      setSubmitStatus({
        success: false,
        message:
          error.response?.data?.error ||
          "Error al registrar los datos o generar PDF.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setShowProgressBar(false);

    // Navegar a la pantalla de orden de pago
    console.log(codigoGenerado);
    navigate("/ordenDePago", { state: { codigoGenerado } });
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">Resumen de Registro</h2>
      <p className="text-gray-600 mb-6">
        Por favor, revise la información antes de confirmar
      </p>

      {/* Resumen formateado de la información */}
      <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-left max-w-3xl mx-auto">
        {/* Sección del responsable de inscripción */}
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
          </div>
        </div>

        {/* Sección del estudiante */}
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

        {/* Sección del colegio */}
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
              <p className="font-medium">{globalData.colegio?.curso || ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Departamento</p>
              <p className="font-medium">
                {globalData.colegio?.departamento || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provincia</p>
              <p className="font-medium">
                {globalData.colegio?.distrito || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de áreas de competencia */}
        <div className="mb-6 border-b pb-4">
  <h3 className="text-lg font-semibold text-blue-600">
    Áreas de Competencia
  </h3>
  <div className="mt-2">
    {globalData.areas_competencia?.length > 0 ? (
      globalData.areas_competencia.map((area, index) => (
        <div key={index} className="bg-gray-100 rounded px-3 py-2 mb-2">
          <p className="font-medium">{area.nombre_area || ""}</p>
          {/* Mostrar categoría para todas las áreas */}
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


        {/* Sección del tutor legal */}
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

        {/* Sección de tutores académicos */}
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
                        <p className="font-medium">{tutor.tutor?.correo || ""}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center py-4">
                      <p className="font-bold text-center">SIN TUTOR ACADÉMICO</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Sección de Desglose de Costos por Área */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">Importe</h3>
          <div className="mt-2">
            {globalData.areas_competencia?.map((area, index) => (
              <div
                key={index}
                className="flex justify-between py-1 border-b border-gray-100"
              >
                <p className="font-medium">{area.nombre_area}</p>
                <p className="font-medium">20 Bs.</p>
              </div>
            ))}
            <div className="flex justify-between py-2 mt-2 font-bold text-blue-700">
              <p>Total</p>
              <p>{`${20 * (globalData.areas_competencia?.length || 0)} Bs.`}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Recuerde que el pago debe ser realizado por el responsable de
            inscripción
          </p>
        </div>
      </div>

      {/* Mensaje de estado */}
      {submitStatus.success === false && (
        <div className="mt-4 p-3 rounded-md bg-red-100 text-red-700">
          {submitStatus.message}
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handleGoBack}
          disabled={isSubmitting}
          className="bg-gray-500 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-600 shadow-md"
        >
          Atrás
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out hover:bg-indigo-500 shadow-md ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Registrando..." : "Finalizar Registro"}
        </button>
      </div>

      {/* Barra de progreso */}
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

      {/* Modal de éxito */}
      {showSuccessModal && (
        <ExitoModal
          mensaje="Su registro ha sido procesado exitosamente."
          onClose={handleSuccessModalClose}
        />
      )}
    </div>
  );
};

export default Confirmation;
