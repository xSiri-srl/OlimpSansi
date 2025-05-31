import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useFormData } from "./form-data-context";
import api from "../../utils/api";

export default function FormularioTutoresAcademicos({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const { globalData, setGlobalData } = useFormData();
  const [tutoresPorArea, setTutoresPorArea] = useState({});
  const [expandedAreas, setExpandedAreas] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchingTutores, setSearchingTutores] = useState({});
  const [tutoresEncontrados, setTutoresEncontrados] = useState({});

  // Obtener las áreas del contexto global
  const areasCompetencia = globalData.areas_competencia || [];

  const buscarTutorPorCI = async (ci, area) => {
    if (ci?.length >= 7) {
      setSearchingTutores((prev) => ({
        ...prev,
        [area]: true,
      }));

      try {
        const apiUrl = `/api/buscarTutor/${ci}`;
        console.log(`Buscando tutor para ${area} con CI: ${ci}`);

        const response = await api.get(apiUrl);

        if (response.data.found) {
          const tutor = response.data.tutor;

          // Actualizar los datos del tutor para esta área
          setTutoresPorArea((prev) => ({
            ...prev,
            [area]: {
              ...prev[area],
              apellidoPaterno: tutor.apellido_pa || "",
              apellidoMaterno: tutor.apellido_ma || "",
              nombres: tutor.nombre || "",
              correo: tutor.correo || "",
              ci: tutor.ci,
            },
          }));

          // Marcar como encontrado
          setTutoresEncontrados((prev) => ({
            ...prev,
            [area]: true,
          }));

          console.log("Tutor encontrado:", tutor);
        } else {
          setTutoresEncontrados((prev) => ({
            ...prev,
            [area]: false,
          }));
        }
      } catch (error) {
        console.error("Error al buscar tutor:", error);
        setErrors((prev) => ({
          ...prev,
          [`${area}-ci`]:
            "Error al buscar en la base de datos. Intente de nuevo.",
        }));
      } finally {
        setSearchingTutores((prev) => ({
          ...prev,
          [area]: false,
        }));
      }
    }
  };
  // Inicializar el estado cuando se cargan las áreas
  useEffect(() => {
    const initialState = {};
    areasCompetencia.forEach((area) => {
      initialState[area.nombre_area] = false;
    });
    setExpandedAreas(initialState);

    // Inicializar tutoresPorArea con los datos guardados o valores por defecto
    const tutoresState = {};
    areasCompetencia.forEach((area) => {
      const areaName = area.nombre_area;

      // Buscar el tutor guardado para esta área
      const tutorGuardado = globalData.tutores_academicos?.find(
        (tutor) => tutor.nombre_area === areaName
      );

      // Verificar si existe información guardada para este área
      if (tutorGuardado) {
        tutoresState[areaName] = {
          apellidoPaterno: tutorGuardado.tutor?.apellido_pa || "",
          apellidoMaterno: tutorGuardado.tutor?.apellido_ma || "",
          nombres: tutorGuardado.tutor?.nombre || "",
          ci: tutorGuardado.tutor?.ci || "",
          correo: tutorGuardado.tutor?.correo || "",
          // Usar el estado checkbox guardado o false por defecto
          seleccionado: tutorGuardado.checkbox_activo || false,
          // Mantener el estado expandido según el checkbox
          expanded: tutorGuardado.checkbox_expanded || false,
        };

        // Actualizar el estado expandido según lo guardado
        if (tutorGuardado.checkbox_activo) {
          setExpandedAreas((prev) => ({
            ...prev,
            [areaName]: tutorGuardado.checkbox_expanded,
          }));
        }
      } else {
        // Inicializar con valores por defecto
        tutoresState[areaName] = {
          apellidoPaterno: "",
          apellidoMaterno: "",
          nombres: "",
          ci: "",
          correo: "",
          seleccionado: false,
          expanded: false,
        };
      }
    });

    setTutoresPorArea(tutoresState);
  }, [areasCompetencia, globalData.tutores_academicos]);

  const toggleArea = (area) => {
    if (tutoresPorArea[area]?.seleccionado) {
      const newExpandedState = !expandedAreas[area];

      setExpandedAreas((prev) => ({
        ...prev,
        [area]: newExpandedState,
      }));

      // Actualizar también el estado expanded en tutoresPorArea
      setTutoresPorArea((prev) => ({
        ...prev,
        [area]: {
          ...prev[area],
          expanded: newExpandedState,
        },
      }));
    }
  };

  const handleCheckboxChange = (area) => {
    const nuevoEstado = !tutoresPorArea[area]?.seleccionado;
    const nuevoExpandido = nuevoEstado; // Expandir automáticamente al activar

    setTutoresPorArea((prev) => ({
      ...prev,
      [area]: {
        ...(prev[area] || {
          apellidoPaterno: "",
          apellidoMaterno: "",
          nombres: "",
          ci: "",
          correo: "",
        }),
        seleccionado: nuevoEstado,
        expanded: nuevoExpandido,
      },
    }));

    setExpandedAreas((prev) => ({
      ...prev,
      [area]: nuevoExpandido,
    }));
  };

  const handleFormChange = (area, field, value, regex) => {
    if (regex && !regex.test(value) && value !== "") return;

    setTutoresPorArea((prev) => ({
      ...prev,
      [area]: {
        ...prev[area],
        [field]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [`${area}-${field}`]: "",
    }));

    // Si el campo es CI y tiene 7-8 dígitos, buscar en la base de datos
    if (field === "ci" && value.length >= 7 && value.length <= 8) {
      buscarTutorPorCI(value, area);
    } else if (field === "ci" && value.length < 7) {
      // Resetear estado de encontrado si el CI es demasiado corto
      setTutoresEncontrados((prev) => ({
        ...prev,
        [area]: false,
      }));
    }
  };

  const validateInput = (area, field, value, regex) => {
    const errorKey = `${area}-${field}`;

    if (!value) {
      setErrors((prev) => ({ ...prev, [errorKey]: "Campo obligatorio." }));
      return false;
    }

    if (regex && !regex.test(value)) {
      setErrors((prev) => ({ ...prev, [errorKey]: "Formato inválido." }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    return true;
  };

  const validateEmail = (area, email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(area, "correo", email, emailRegex);
  };

  const validateArea = (area) => {
    const tutor = tutoresPorArea[area];
    if (!tutor || !tutor.seleccionado) return true;

    const valid = [
      validateInput(
        area,
        "apellidoPaterno",
        tutor.apellidoPaterno,
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
      ),
      validateInput(
        area,
        "apellidoMaterno",
        tutor.apellidoMaterno,
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
      ),
      validateInput(
        area,
        "nombres",
        tutor.nombres,
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
      ),
      validateInput(area, "ci", tutor.ci, /^[0-9]*$/),
      validateEmail(area, tutor.correo),
    ];

    return valid.every(Boolean);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    let formValid = true;

    Object.keys(tutoresPorArea).forEach((area) => {
      if (tutoresPorArea[area]?.seleccionado && !validateArea(area)) {
        formValid = false;
      }
    });

    if (!formValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const tutoresAcademicos = areasCompetencia.map((areaObj) => {
        const area = areaObj.nombre_area;
        const tutor = tutoresPorArea[area];
        const seleccionado = tutor?.seleccionado;

        return {
          nombre_area: area,
          // Guardar los estados del checkbox
          checkbox_activo: seleccionado || false,
          checkbox_expanded: expandedAreas[area] || false,
          // Si no está seleccionado, guardar datos vacíos en lugar de los datos del estudiante
          tutor: seleccionado
            ? {
                nombre: tutor.nombres,
                apellido_pa: tutor.apellidoPaterno,
                apellido_ma: tutor.apellidoMaterno,
                ci: tutor.ci,
                correo: tutor.correo,
              }
            : {
                nombre: "",
                apellido_pa: "",
                apellido_ma: "",
                ci: "",
                correo: "",
              },
        };
      });

      setGlobalData({ ...globalData, tutores_academicos: tutoresAcademicos });
      handleInputChange("flow", "editingTutores", false);
      handleNext();
    } catch (error) {
      console.error(
        "Error al procesar los datos de tutores académicos:",
        error
      );
      setErrors({ general: "Hubo un error al procesar los datos." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    // Verificar si hay algún área seleccionada
    const areasSeleccionadas = Object.keys(tutoresPorArea).filter(
      (area) => tutoresPorArea[area]?.seleccionado
    );

    // Si no hay áreas seleccionadas, el formulario es válido (ahora guardará datos vacíos)
    if (areasSeleccionadas.length === 0) {
      return true;
    }

    // Verificar que todas las áreas seleccionadas tengan datos válidos
    for (const area of areasSeleccionadas) {
      const tutor = tutoresPorArea[area];

      // Validar campos requeridos
      if (
        !tutor.apellidoPaterno ||
        !tutor.apellidoMaterno ||
        !tutor.nombres ||
        !tutor.ci ||
        !tutor.correo
      ) {
        return false;
      }

      // Validar longitudes mínimas
      if (
        tutor.ci.length < 7 ||
        tutor.nombres.length < 2 ||
        tutor.apellidoMaterno.length < 2 ||
        tutor.apellidoPaterno.length < 2
      ) {
        return false;
      }

      // Validar número de nombres (máximo 2)
      if (tutor.nombres.split(" ").length > 2) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Registro de Tutores Académicos
          </h2>
          <p className="text-center text-gray-600">
            Seleccione las áreas para las que desea registrar un tutor académico
            diferente al estudiante. Si no selecciona ninguna, no se registrarán
            tutores académicos para estas áreas.
          </p>
        </div>

        {/* Mapeo de cada área de competencia */}
        {areasCompetencia.map((area, index) => (
          <div
            key={index}
            className="mb-6 border rounded-lg shadow-sm overflow-hidden"
          >
            <div
              className="bg-gray-100 p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleArea(area.nombre_area)}
            >
              <div className="flex-1">
                <label
                  htmlFor={`checkbox-${index}`}
                  className="text-lg font-medium cursor-pointer"
                >
                  ¿Desea registrar un tutor académico para {area.nombre_area}?
                </label>
              </div>
              <div className="flex items-center">
                {tutoresPorArea[area.nombre_area]?.seleccionado &&
                  (expandedAreas[area.nombre_area] ? (
                    <FaChevronUp className="text-gray-500 mr-3" />
                  ) : (
                    <FaChevronDown className="text-gray-500 mr-3" />
                  ))}
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  checked={
                    tutoresPorArea[area.nombre_area]?.seleccionado || false
                  }
                  onChange={() => handleCheckboxChange(area.nombre_area)}
                  className="h-5 w-5"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {tutoresPorArea[area.nombre_area]?.seleccionado &&
              expandedAreas[area.nombre_area] && (
                <div className="p-6 border-t bg-white">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-500">
                      Profesor de {area.nombre_area}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Por favor, completa los datos del tutor académico.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Carnet de Identidad (Ahora es el primer campo) */}
                    <div>
                      <label className="flex items-center gap-2">
                        <FaIdCard className="text-black" /> Carnet de Identidad
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          placeholder="Número de Carnet de Identidad"
                          value={tutoresPorArea[area.nombre_area]?.ci || ""}
                          onChange={(e) =>
                            handleFormChange(
                              area.nombre_area,
                              "ci",
                              e.target.value,
                              /^[0-9]*$/
                            )
                          }
                          maxLength="8"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {searchingTutores[area.nombre_area] && (
                            <span className="text-blue-500 text-sm">
                              Buscando...
                            </span>
                          )}
                          {tutoresEncontrados[area.nombre_area] && (
                            <span className="text-green-500 text-sm">
                              ✓ Encontrado
                            </span>
                          )}
                        </div>
                      </div>
                      {errors[`${area.nombre_area}-ci`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`${area.nombre_area}-ci`]}
                        </p>
                      )}

                      {tutoresEncontrados[area.nombre_area] && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-2 text-sm">
                          Tutor encontrado en el sistema. Los datos han sido
                          cargados automáticamente.
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <div className="w-full">
                        <label className="flex items-center gap-2">
                          <FaUser className="text-black" /> Apellido Paterno
                        </label>
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          placeholder="Apellido Paterno"
                          value={
                            tutoresPorArea[area.nombre_area]?.apellidoPaterno ||
                            ""
                          }
                          onChange={(e) =>
                            handleFormChange(
                              area.nombre_area,
                              "apellidoPaterno",
                              e.target.value.toUpperCase(),
                              /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                            )
                          }
                          maxLength="15"
                        />
                        {errors[`${area.nombre_area}-apellidoPaterno`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`${area.nombre_area}-apellidoPaterno`]}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className="flex items-center gap-2">
                          <FaUser className="text-black" /> Apellido Materno
                        </label>
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          placeholder="Apellido Materno"
                          value={
                            tutoresPorArea[area.nombre_area]?.apellidoMaterno ||
                            ""
                          }
                          onChange={(e) =>
                            handleFormChange(
                              area.nombre_area,
                              "apellidoMaterno",
                              e.target.value.toUpperCase(),
                              /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                            )
                          }
                          maxLength="15"
                        />
                        {errors[`${area.nombre_area}-apellidoMaterno`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`${area.nombre_area}-apellidoMaterno`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <FaUser className="text-black" /> Nombres
                      </label>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Nombres"
                        value={tutoresPorArea[area.nombre_area]?.nombres || ""}
                        onChange={(e) =>
                          handleFormChange(
                            area.nombre_area,
                            "nombres",
                            e.target.value.toUpperCase(),
                            /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                          )
                        }
                        maxLength="30"
                      />
                      {errors[`${area.nombre_area}-nombres`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`${area.nombre_area}-nombres`]}
                        </p>
                      )}
                    </div>

                    {/* Campo de correo electrónico que faltaba */}
                    <div>
                      <label className="flex items-center gap-2">
                        <FaEnvelope className="text-black" /> Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Correo Electrónico"
                        value={tutoresPorArea[area.nombre_area]?.correo || ""}
                        onChange={(e) =>
                          handleFormChange(
                            area.nombre_area,
                            "correo",
                            e.target.value,
                            null
                          )
                        }
                      />
                      {errors[`${area.nombre_area}-correo`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`${area.nombre_area}-correo`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        ))}

        {/* Mensaje de error general */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {errors.general}
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              isFormValid() && !isSubmitting
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Procesando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
