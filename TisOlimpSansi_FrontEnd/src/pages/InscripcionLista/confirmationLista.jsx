"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "./form-context";
import ExitoModal from "./Modales/ExitoModal";
import ErrorModal from "./Modales/RegistrosInvalidosModal";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../../utils/api";

const ConfirmationLista = ({ setStep }) => {
  const { globalData, setGlobalData } = useFormData();
  const { estudiantes } = useFormData();
  const responsableInscripcion = globalData.responsable_inscripcion;
  const navigate = useNavigate();

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
    console.log(globalData);
    globalData.areas_competencia?.forEach((area) => {
      console.log("Nombre del área:", area.nombre_area);
      console.log("Categoría:", area.categoria);
    });
  }, [globalData]);

  const handleGoBack = () => {
    console.log("Confirmation: Atrás button clicked");
    setStep(4); // Volver al paso 4 (lista de competidores)
  };

  const calcularTotalAreas = () => {
    let totalAreas = 0;
    estudiantes.forEach((estudiante) => {
      if (
        estudiante.areas_competencia &&
        Array.isArray(estudiante.areas_competencia)
      ) {
        totalAreas += estudiante.areas_competencia.length;
      }
    });
    return totalAreas;
  };

  const calcularTotalImporte = () => {
    const totalAreas = calcularTotalAreas();
    return totalAreas * 20; // 20 Bs por área
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

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

    // Estructura el JSON que se enviará
    const datosPreparados = {
      olimpiada: globalData.olimpiada,
      responsable_inscripcion: responsableInscripcion,
      estudiantes: estudiantes.map((estudiante) => {
        // Crear una copia del estudiante para manipular
        const estudianteModificado = { ...estudiante };

        // Si hay áreas de competencia, verificar tutores académicos
        if (
          estudianteModificado.areas_competencia &&
          estudianteModificado.areas_competencia.length > 0
        ) {
          // Asegurar que tutores_academicos sea un array
          if (!estudianteModificado.tutores_academicos) {
            estudianteModificado.tutores_academicos = [];
          }

          // Verificar cada área para asegurarse de que tiene un tutor académico
          estudianteModificado.areas_competencia.forEach((area, index) => {
            // Si no hay tutor para esta área, crear uno con valores predeterminados
            if (
              !estudianteModificado.tutores_academicos[index] ||
              !estudianteModificado.tutores_academicos[index].tutor
            ) {
              estudianteModificado.tutores_academicos[index] = {
                area_id: index,
                area_nombre: area.nombre_area,
                tutor: {
                  nombre: "",
                  apellido_pa: "",
                  apellido_ma: "",
                  ci: "",
                  correo: "",
                },
              };
            } else {
              // Si existe el tutor pero tiene campos vacíos, rellenarlos con valores predeterminados
              const tutor =
                estudianteModificado.tutores_academicos[index].tutor;

              if (!tutor.nombre || tutor.nombre.trim() === "") {
                tutor.nombre = "";
              }

              if (!tutor.apellido_pa || tutor.apellido_pa.trim() === "") {
                tutor.apellido_pa = "";
              }

              if (!tutor.apellido_ma || tutor.apellido_ma.trim() === "") {
                tutor.apellido_ma = "";
              }

              if (!tutor.ci || tutor.ci.trim() === "") {
                tutor.ci = "";
              }

              if (!tutor.correo || tutor.correo.trim() === "") {
                tutor.correo = "";
              }
            }
          });
        }

        return estudianteModificado;
      }),
    };

    try {
      console.log(datosPreparados);
      const response = await api.post(
        "/api/inscribir-lista",
        datosPreparados
      );

      if (response.status === 201) {
        // Completar la barra de progreso
        setUploadProgress(100);
        clearInterval(progressInterval);

        // Guardar el código generado
        setCodigoGenerado(response.data.codigo_generado);

        // Actualizar el estado global con el código generado
        setGlobalData({
          ...globalData,
          codigoGenerado: response.data.codigo_generado,
        });

        setSubmitStatus({
          success: true,
          message: "Inscripción registrada correctamente.",
        });

        // Mostrar modal de éxito
        setShowSuccessModal(true);
      } else {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al registrar los datos", error);
      clearInterval(progressInterval);
      setShowProgressBar(false);

      let rawMessage = error.response?.data?.message || error.message || "";
      let mensajeFinal = rawMessage;

      if (rawMessage.includes("Areas/categorias válidas:")) {
        const [mensajeBase, combinacionesRaw] = rawMessage.split("Combinaciones válidas:");
        const combinaciones = combinacionesRaw
          .split("-")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        mensajeFinal = `${mensajeBase.trim()}\n\nCombinaciones válidas:\n${combinaciones
          .map((c) => `• ${c}`)
          .join("\n")}`;
      }

      // ✅ Pasar el string completo como mensaje plano
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

    console.log(codigoGenerado);
    navigate("/orden-pago", { state: { codigoGenerado } });
  };

  return (
    <div className="text-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Resumen de Registro por Lista
        </h2>
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
                  {`${responsableInscripcion?.nombre || ""} 
                    ${responsableInscripcion?.apellido_pa || ""} 
                    ${responsableInscripcion?.apellido_ma || ""}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Carnet de Identidad</p>
                <p className="font-medium">
                  {responsableInscripcion?.ci || ""}
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
          {/* Sección de resumen de estudiantes */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold text-blue-600">
              Resumen de Competidores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500">Total de Inscripciones</p>
                <p className="font-medium">{estudiantes.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Total de Áreas Registradas
                </p>
                <p className="font-medium">{calcularTotalAreas()}</p>
              </div>
            </div>
          </div>

          {/* Tabla detallada de competidores */}
          <div
            className={`mt-6 ${
              estudiantes.length > 25 ? "max-h-96 overflow-y-auto pr-2" : ""
            }`}
          >
            <h4 className="font-medium text-gray-700 mb-2">
              Lista de Competidores
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Nombre</th>
                    <th className="px-4 py-2 border">Área</th>
                    <th className="px-4 py-2 border">Categoría</th>
                    <th className="px-4 py-2 border">Curso</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes
                    .flatMap((estudiante, estudianteIndex) => {
                      // Si no hay áreas de competencia, mostrar una fila con datos básicos
                      if (
                        !estudiante.areas_competencia ||
                        !Array.isArray(estudiante.areas_competencia) ||
                        estudiante.areas_competencia.length === 0
                      ) {
                        return [
                          {
                            id: estudianteIndex,
                            nombre: `${estudiante.estudiante?.nombre || ""} ${
                              estudiante.estudiante?.apellido_pa || ""
                            } ${estudiante.estudiante?.apellido_ma || ""}`,
                            area: "N/A",
                            categoria: "N/A",
                            curso: estudiante.colegio?.curso || "N/A",
                          },
                        ];
                      }

                      // Si hay áreas de competencia, crear una fila por cada área
                      return estudiante.areas_competencia.map(
                        (area, areaIndex) => ({
                          id: `${estudianteIndex}-${areaIndex}`,
                          nombre: `${estudiante.estudiante?.nombre || ""} ${
                            estudiante.estudiante?.apellido_pa || ""
                          } ${estudiante.estudiante?.apellido_ma || ""}`,
                          area: area.nombre_area || "N/A",
                          categoria: area.categoria || "N/A",
                          curso: estudiante.colegio?.curso || "N/A",
                        })
                      );
                    })
                    .map((item, index) => (
                      <tr key={item.id} className="text-gray-800">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{item.nombre}</td>
                        <td className="px-4 py-2 border">{item.area}</td>
                        <td className="px-4 py-2 border">{item.categoria}</td>
                        <td className="px-4 py-2 border">{item.curso}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-2 bg-red-100 border-4 border-red-500 rounded-xl text-center shadow-xl animate-pulse flex items-center justify-center">
            <FaExclamationTriangle className="text-red-700 text-2xl" />
            <p className="text-red-800 font-bold text-sm p-2 tracking-wide">
              Recuerde que el pago debe ser realizado por el responsable de
              inscripción
            </p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={handleGoBack}
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
                  handleConfirmSubmit();
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
              >
                <FaCheckCircle className="text-lg" />
                Aceptar
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
              Registrando competidores...
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
          mensaje="La lista de competidores ha sido registrada exitosamente."
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

export default ConfirmationLista;
