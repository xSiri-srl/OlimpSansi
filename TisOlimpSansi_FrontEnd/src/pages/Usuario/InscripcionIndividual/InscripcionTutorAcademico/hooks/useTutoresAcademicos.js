import { useState, useEffect, useCallback } from "react";
import { useFormData } from "../../form-data-context";
import { useTutorSearch } from "./useTutorSearch";

export function useTutoresAcademicos({ handleInputChange, handleNext }) {
  const { globalData, setGlobalData } = useFormData();
  const [tutoresPorArea, setTutoresPorArea] = useState({});
  const [expandedAreas, setExpandedAreas] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    searchingTutores,
    tutoresEncontrados,
    setTutoresEncontrados,
    buscarTutorPorCI,
  } = useTutorSearch({ setTutoresPorArea, setErrors });

  const areasCompetencia = globalData.areas_competencia || [];

  // Inicializar el estado cuando se cargan las áreas - CORREGIDO
  useEffect(() => {
    // Solo inicializar si hay áreas y no se ha inicializado antes
    if (areasCompetencia.length > 0 && !initialized) {
      const initialState = {};
      areasCompetencia.forEach((area) => {
        initialState[area.nombre_area] = false;
      });
      setExpandedAreas(initialState);

      // Inicializar tutoresPorArea con los datos guardados o valores por defecto
      const tutoresState = {};
      areasCompetencia.forEach((area) => {
        const areaName = area.nombre_area;
        const tutorGuardado = globalData.tutores_academicos?.find(
          (tutor) => tutor.nombre_area === areaName
        );

        if (tutorGuardado) {
          tutoresState[areaName] = {
            apellidoPaterno: tutorGuardado.tutor?.apellido_pa || "",
            apellidoMaterno: tutorGuardado.tutor?.apellido_ma || "",
            nombres: tutorGuardado.tutor?.nombre || "",
            ci: tutorGuardado.tutor?.ci || "",
            correo: tutorGuardado.tutor?.correo || "",
            seleccionado: tutorGuardado.checkbox_activo || false,
            expanded: tutorGuardado.checkbox_expanded || false,
          };

          if (tutorGuardado.checkbox_activo) {
            setExpandedAreas((prev) => ({
              ...prev,
              [areaName]: tutorGuardado.checkbox_expanded,
            }));
          }
        } else {
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
      setInitialized(true);
    }
  }, [areasCompetencia.length, initialized]); // Cambié las dependencias

  const toggleArea = useCallback((area) => {
    if (tutoresPorArea[area]?.seleccionado) {
      const newExpandedState = !expandedAreas[area];

      setExpandedAreas((prev) => ({
        ...prev,
        [area]: newExpandedState,
      }));

      setTutoresPorArea((prev) => ({
        ...prev,
        [area]: {
          ...prev[area],
          expanded: newExpandedState,
        },
      }));
    }
  }, [tutoresPorArea, expandedAreas]);

  const handleCheckboxChange = useCallback((area) => {
    const nuevoEstado = !tutoresPorArea[area]?.seleccionado;
    const nuevoExpandido = nuevoEstado;

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
  }, [tutoresPorArea]);

  const handleFormChange = useCallback((area, field, value, regex) => {
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

    if (field === "ci" && value.length >= 7 && value.length <= 8) {
      buscarTutorPorCI(value, area);
    } else if (field === "ci" && value.length < 7) {
      setTutoresEncontrados((prev) => ({
        ...prev,
        [area]: false,
      }));
    }
  }, [buscarTutorPorCI, setTutoresEncontrados]);

  const validateInput = useCallback((area, field, value, regex) => {
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
  }, []);

  const validateEmail = useCallback((area, email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(area, "correo", email, emailRegex);
  }, [validateInput]);

  const validateArea = useCallback((area) => {
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
  }, [tutoresPorArea, validateInput, validateEmail]);

  const handleSubmit = useCallback(() => {
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
          checkbox_activo: seleccionado || false,
          checkbox_expanded: expandedAreas[area] || false,
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
  }, [
    tutoresPorArea,
    validateArea,
    areasCompetencia,
    expandedAreas,
    globalData,
    setGlobalData,
    handleInputChange,
    handleNext,
  ]);

  const isFormValid = useCallback(() => {
    const areasSeleccionadas = Object.keys(tutoresPorArea).filter(
      (area) => tutoresPorArea[area]?.seleccionado
    );

    if (areasSeleccionadas.length === 0) {
      return true;
    }

    for (const area of areasSeleccionadas) {
      const tutor = tutoresPorArea[area];

      if (
        !tutor.apellidoPaterno ||
        !tutor.apellidoMaterno ||
        !tutor.nombres ||
        !tutor.ci ||
        !tutor.correo
      ) {
        return false;
      }

      if (
        tutor.ci.length < 7 ||
        tutor.nombres.length < 2 ||
        tutor.apellidoMaterno.length < 2 ||
        tutor.apellidoPaterno.length < 2
      ) {
        return false;
      }

      if (tutor.nombres.split(" ").length > 2) {
        return false;
      }
    }

    return true;
  }, [tutoresPorArea]);

  return {
    tutoresPorArea,
    expandedAreas,
    errors,
    isSubmitting,
    searchingTutores,
    tutoresEncontrados,
    handleCheckboxChange,
    handleFormChange,
    toggleArea,
    handleSubmit,
    isFormValid,
  };
}