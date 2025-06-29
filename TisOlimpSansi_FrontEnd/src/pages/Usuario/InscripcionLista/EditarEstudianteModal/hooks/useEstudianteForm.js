import { useState, useEffect } from "react";
import { SECCIONES } from "../constants";
import { normalizarDatosEstudiante } from "../utils";

export const useEstudianteForm = (estudiante) => {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES.TODOS);
  const [estudianteData, setEstudianteData] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (estudiante?.originalData) {
      const normalizedData = normalizarDatosEstudiante(estudiante.originalData);
      const erroresIniciales = {};
      if (
        normalizedData.estudiante?.nombre &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(normalizedData.estudiante.nombre)
      ) {
        erroresIniciales.nombre = "El nombre debe contener solo letras";
      }

      if (
        normalizedData.estudiante?.apellido_pa &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(normalizedData.estudiante.apellido_pa)
      ) {
        erroresIniciales.apellido_pa =
          "El apellido paterno debe contener solo letras";
      }

      if (
        normalizedData.estudiante?.apellido_ma &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(normalizedData.estudiante.apellido_ma)
      ) {
        erroresIniciales.apellido_ma =
          "El apellido materno debe contener solo letras";
      }

      normalizedData.areas_competencia?.forEach((area, index) => {
        if (
          (area.nombre_area === "Informática" ||
            area.nombre_area === "Robótica") &&
          !area.categoria
        ) {
          erroresIniciales[
            `categoria_${index}`
          ] = `Debe seleccionar una categoría para ${area.nombre_area}`;
        } else if (
          (area.nombre_area === "Informática" ||
            area.nombre_area === "Robótica") &&
          area.categoria
        ) {
          const curso = normalizedData.colegio?.curso || "";
          const esPrimaria = curso.includes("Primaria");
          const esSecundaria = curso.includes("Secundaria");
          const numeroCurso = parseInt(curso.match(/\d+/)?.[0] || "0");

          if (area.nombre_area === "Informática") {
            if (esPrimaria && (numeroCurso === 5 || numeroCurso === 6)) {
              if (!area.categoria.includes("Guacamayo")) {
                erroresIniciales[
                  `categoria_${index}`
                ] = `La categoría seleccionada no corresponde al curso ${curso}`;
              }
            } else if (esSecundaria && numeroCurso >= 1 && numeroCurso <= 3) {
              if (
                !area.categoria.includes("Guanaco") &&
                !area.categoria.includes("Londra") &&
                !area.categoria.includes("Bufeo")
              ) {
                erroresIniciales[
                  `categoria_${index}`
                ] = `La categoría seleccionada no corresponde al curso ${curso}`;
              }
            } else if (esSecundaria && numeroCurso >= 4 && numeroCurso <= 6) {
              if (
                !area.categoria.includes("Jucumari") &&
                !area.categoria.includes("Puma")
              ) {
                erroresIniciales[
                  `categoria_${index}`
                ] = `La categoría seleccionada no corresponde al curso ${curso}`;
              }
            }
          }

          if (area.nombre_area === "Robótica") {
            if (esPrimaria && (numeroCurso === 5 || numeroCurso === 6)) {
              if (
                !area.categoria.includes("Builders P") &&
                !area.categoria.includes("Lego P")
              ) {
                erroresIniciales[
                  `categoria_${index}`
                ] = `La categoría seleccionada no corresponde al curso ${curso}`;
              }
            } else if (esSecundaria) {
              if (
                !area.categoria.includes("Builders S") &&
                !area.categoria.includes("Lego S")
              ) {
                erroresIniciales[
                  `categoria_${index}`
                ] = `La categoría seleccionada no corresponde al curso ${curso}`;
              }
            }
          }
        }
      });
      normalizedData.areas_competencia?.forEach((area, index) => {
        if (
          (area.nombre_area === "Informática" ||
            area.nombre_area === "Robótica") &&
          !area.categoria
        ) {
          erroresIniciales[
            `categoria_${index}`
          ] = `Debe seleccionar una categoría para ${area.nombre_area}`;
        }
      });

      if (
        normalizedData.estudiante?.ci &&
        !/^\d{7,8}$/.test(normalizedData.estudiante.ci)
      ) {
        erroresIniciales.ci =
          "El CI del estudiante debe contener entre 7 y 8 dígitos numéricos";
      }

      if (
        normalizedData.tutor_legal?.numero_celular &&
        !/^\d{7,9}$/.test(normalizedData.tutor_legal.numero_celular)
      ) {
        erroresIniciales.tutor_legal_telefono =
          "El teléfono debe contener entre 7 y 9 dígitos numéricos";
      }

      normalizedData.tutores_academicos?.forEach((tutor, index) => {
        if (tutor?.tutor?.ci && !/^\d{7,8}$/.test(tutor.tutor.ci)) {
          erroresIniciales[`tutor_academico_${index}_ci`] =
            "El CI del tutor académico debe contener entre 7 y 8 dígitos numéricos";
        }
      });

      if (
        normalizedData.tutor_legal?.ci &&
        !/^\d{7,8}$/.test(normalizedData.tutor_legal.ci)
      ) {
        erroresIniciales.tutor_legal_ci =
          "El CI del tutor legal debe contener entre 7 y 8 dígitos numéricos";
      }

      if (Object.keys(erroresIniciales).length > 0) {
        setErrores(erroresIniciales);
      }

      setEstudianteData(normalizedData);
    }
  }, [estudiante]);

  const handleChange = (section, field, value) => {
    setEstudianteData((prev) => {
      const newData = { ...prev };

      if (section === "estudiante") {
        newData.estudiante = { ...newData.estudiante, [field]: value };
      } else if (section === "colegio") {
        newData.colegio = { ...newData.colegio, [field]: value };
      } else if (section === "tutor_legal") {
        newData.tutor_legal = { ...newData.tutor_legal, [field]: value };
      } else if (section.startsWith("tutor_academico_")) {
        const index = parseInt(section.split("_")[2]);
        if (!newData.tutores_academicos) newData.tutores_academicos = [];
        if (!newData.tutores_academicos[index]) {
          newData.tutores_academicos[index] = {
            nombre_area: newData.areas_competencia?.[index]?.nombre_area || "",
            tutor: {},
          };
        }
        newData.tutores_academicos[index].tutor = {
          ...newData.tutores_academicos[index].tutor,
          [field]: value,
        };
      } else if (section.startsWith("area_")) {
        const index = parseInt(section.split("_")[1]);
        if (!newData.areas_competencia) newData.areas_competencia = [];
        if (!newData.areas_competencia[index]) {
          newData.areas_competencia[index] = { nombre_area: "", categoria: "" };
        }

        if (field === "nombre_area") {
          if (!newData.tutores_academicos) {
            newData.tutores_academicos = [];
          }

          if (!newData.tutores_academicos[index]) {
            newData.tutores_academicos[index] = {
              nombre_area: value,
              tutor: {
                nombre: "",
                apellido_pa: "",
                apellido_ma: "",
                ci: "",
                correo: "",
              },
            };
          } else {
            newData.tutores_academicos[index].nombre_area = value;
          }

          newData.areas_competencia[index].nombre_area = value;
          newData.areas_competencia[index].categoria = "";
        } else {
          newData.areas_competencia[index][field] = value;
        }
      }

      return newData;
    });
  };

  const handleDepartamentoChange = (value) => {
    setEstudianteData((prev) => ({
      ...prev,
      colegio: {
        ...prev.colegio,
        departamento: value,
        provincia: "",
      },
    }));
  };

  const validarDatos = () => {
    const nuevoErrores = {};
    if (!estudianteData.estudiante?.nombre) {
      nuevoErrores.nombre = "El nombre es obligatorio";
    } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.estudiante.nombre)) {
      nuevoErrores.nombre = "El nombre debe contener solo letras";
    }

    if (!estudianteData.estudiante?.apellido_pa) {
      nuevoErrores.apellido_pa = "El apellido paterno es obligatorio";
    } else if (
      !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.estudiante.apellido_pa)
    ) {
      nuevoErrores.apellido_pa =
        "El apellido paterno debe contener solo letras";
    }

    if (
      estudianteData.estudiante?.apellido_ma &&
      !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.estudiante.apellido_ma)
    ) {
      nuevoErrores.apellido_ma =
        "El apellido materno debe contener solo letras";
    }

    if (!estudianteData.estudiante?.ci) {
      nuevoErrores.ci = "El CI es obligatorio";
    } else if (!/^\d{7,8}$/.test(estudianteData.estudiante.ci)) {
      nuevoErrores.ci = "El CI debe contener entre 7 y 8 dígitos numéricos";
    }

    if (estudianteData.tutor_legal) {
      if (
        estudianteData.tutor_legal.nombre &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.tutor_legal.nombre)
      ) {
        nuevoErrores.tutor_legal_nombre =
          "El nombre del tutor debe contener solo letras";
      }

      if (
        estudianteData.tutor_legal.apellido_pa &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.tutor_legal.apellido_pa)
      ) {
        nuevoErrores.tutor_legal_apellido_pa =
          "El apellido paterno del tutor debe contener solo letras";
      }

      if (
        estudianteData.tutor_legal.apellido_ma &&
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.tutor_legal.apellido_ma)
      ) {
        nuevoErrores.tutor_legal_apellido_ma =
          "El apellido materno del tutor debe contener solo letras";
      }

      if (estudianteData.tutor_legal?.ci) {
        if (!/^\d{7,8}$/.test(estudianteData.tutor_legal.ci)) {
          nuevoErrores.tutor_legal_ci =
            "El CI del tutor debe contener entre 7 y 8 dígitos numéricos";
        }
      }

      if (estudianteData.tutor_legal?.numero_celular) {
        if (!/^\d{7,9}$/.test(estudianteData.tutor_legal.numero_celular)) {
          nuevoErrores.tutor_legal_telefono =
            "El teléfono debe contener entre 7 y 9 dígitos numéricos";
        }
      }
    }

    estudianteData.tutores_academicos?.forEach((tutor, index) => {
      const tutorData = tutor?.tutor || {};
      const hasTutorData =
        tutorData.nombre ||
        tutorData.apellido_pa ||
        tutorData.apellido_ma ||
        tutorData.ci ||
        tutorData.correo;

      if (hasTutorData) {
        if (!tutorData.nombre) {
          nuevoErrores[`tutor_academico_${index}_nombre`] =
            "El nombre del tutor académico es requerido";
        } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.nombre)) {
          nuevoErrores[`tutor_academico_${index}_nombre`] =
            "El nombre del tutor académico debe contener solo letras";
        }

        if (!tutorData.apellido_pa) {
          nuevoErrores[`tutor_academico_${index}_apellido_pa`] =
            "El apellido paterno del tutor académico es requerido";
        } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.apellido_pa)) {
          nuevoErrores[`tutor_academico_${index}_apellido_pa`] =
            "El apellido paterno del tutor académico debe contener solo letras";
        }

        if (
          tutorData.apellido_ma &&
          !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.apellido_ma)
        ) {
          nuevoErrores[`tutor_academico_${index}_apellido_ma`] =
            "El apellido materno del tutor académico debe contener solo letras";
        }

        if (!tutorData.ci) {
          nuevoErrores[`tutor_academico_${index}_ci`] =
            "El CI del tutor académico es requerido";
        } else if (!/^\d{7,8}$/.test(tutorData.ci)) {
          nuevoErrores[`tutor_academico_${index}_ci`] =
            "El CI del tutor académico debe contener entre 7 y 8 dígitos numéricos";
        }
      }
    });

    if (!estudianteData.colegio?.nombre_colegio)
      nuevoErrores.nombre_colegio = "El nombre del colegio es obligatorio";
    if (!estudianteData.colegio?.curso)
      nuevoErrores.curso = "El curso es obligatorio";

    if (
      !estudianteData.areas_competencia ||
      estudianteData.areas_competencia.length === 0 ||
      !estudianteData.areas_competencia[0]?.nombre_area
    ) {
      nuevoErrores.areas = "Debe seleccionar al menos un área de competencia";
    }

    estudianteData.areas_competencia?.forEach((area, index) => {
      if (
        (area.nombre_area === "Informática" ||
          area.nombre_area === "Robótica") &&
        !area.categoria
      ) {
        nuevoErrores[
          `categoria_${index}`
        ] = `Debe seleccionar una categoría para ${area.nombre_area}`;
      } else if (
        (area.nombre_area === "Informática" ||
          area.nombre_area === "Robótica") &&
        area.categoria
      ) {
        const curso = estudianteData.colegio?.curso || "";
        const esPrimaria = curso.includes("Primaria");
        const esSecundaria = curso.includes("Secundaria");
        const numeroCurso = parseInt(curso.match(/\d+/)?.[0] || "0");

        if (area.nombre_area === "Informática") {
          if (esPrimaria && (numeroCurso === 5 || numeroCurso === 6)) {
            if (!area.categoria.includes("Guacamayo")) {
              nuevoErrores[
                `categoria_${index}`
              ] = `La categoría seleccionada no corresponde al curso ${curso}`;
            }
          } else if (esSecundaria && numeroCurso >= 1 && numeroCurso <= 3) {
            if (
              !area.categoria.includes("Guanaco") &&
              !area.categoria.includes("Londra") &&
              !area.categoria.includes("Bufeo")
            ) {
              nuevoErrores[
                `categoria_${index}`
              ] = `La categoría seleccionada no corresponde al curso ${curso}`;
            }
          } else if (esSecundaria && numeroCurso >= 4 && numeroCurso <= 6) {
            if (
              !area.categoria.includes("Jucumari") &&
              !area.categoria.includes("Puma")
            ) {
              nuevoErrores[
                `categoria_${index}`
              ] = `La categoría seleccionada no corresponde al curso ${curso}`;
            }
          }
        }

        if (area.nombre_area === "Robótica") {
          if (esPrimaria && (numeroCurso === 5 || numeroCurso === 6)) {
            if (
              !area.categoria.includes("Builders P") &&
              !area.categoria.includes("Lego P")
            ) {
              nuevoErrores[
                `categoria_${index}`
              ] = `La categoría seleccionada no corresponde al curso ${curso}`;
            }
          } else if (esSecundaria) {
            if (
              !area.categoria.includes("Builders S") &&
              !area.categoria.includes("Lego S")
            ) {
              nuevoErrores[
                `categoria_${index}`
              ] = `La categoría seleccionada no corresponde al curso ${curso}`;
            }
          }
        }
      }
    });

    setErrores(nuevoErrores);
    return Object.keys(nuevoErrores).length === 0;
  };

  const tieneError = (campo) => Boolean(errores[campo]);

  const mostrarCampo = (campo) => {
    if (seccionActiva === SECCIONES.TODOS) return true;

    if (tieneError(campo)) {
      return true;
    }

    if (tieneError("ci") || tieneError("apellido_pa") || tieneError("nombre")) {
      if (campo === "ci" || campo === "apellido_pa" || campo === "nombre") {
        return true;
      }
    }

    if (tieneError("nombre_colegio") || tieneError("curso")) {
      if (campo === "nombre_colegio" || campo === "curso") {
        return true;
      }
    }

    const tieneErrorCategoria = Object.keys(errores).some((key) =>
      key.startsWith("categoria_")
    );
    if (tieneErrorCategoria || tieneError("areas")) {
      if (campo === "areas") {
        return true;
      }
    }

    if (tieneError("tutor_legal_ci") || tieneError("tutor_legal_telefono")) {
      if (campo === "tutor_legal") {
        return true;
      }
    }

    const tieneErrorTutorAcademico = Object.keys(errores).some((key) =>
      key.startsWith("tutor_academico_")
    );
    if (tieneErrorTutorAcademico) {
      if (campo === "tutores_academicos") {
        return true;
      }
    }

    return false;
  };
  const validarFormatoCI = (value) => {
    return value.replace(/\D/g, "").substring(0, 8);
  };

  const validarFormatoTelefono = (value) => {
    return value.replace(/\D/g, "").substring(0, 9);
  };

  const campoEditable = (campo) => {
    if (tieneError(campo)) return true;

    if (
      campo === "areas" &&
      Object.keys(errores).some((e) => e.startsWith("categoria_"))
    )
      return true;

    if (campo === "nombre" && !estudianteData.estudiante?.nombre) return true;
    if (campo === "apellido_pa" && !estudianteData.estudiante?.apellido_pa)
      return true;
    if (campo === "ci" && !estudianteData.estudiante?.ci) return true;
    if (campo === "nombre_colegio" && !estudianteData.colegio?.nombre_colegio)
      return true;
    if (campo === "curso" && !estudianteData.colegio?.curso) return true;

    if (
      campo === "areas" &&
      (!estudianteData.areas_competencia ||
        estudianteData.areas_competencia.length === 0 ||
        !estudianteData.areas_competencia[0]?.nombre_area)
    )
      return true;

    if (campo.startsWith("categoria_")) {
      const index = parseInt(campo.split("_")[1]);
      const area = estudianteData.areas_competencia?.[index]?.nombre_area;
      if (!area) return true;
      if (
        (area === "Informática" || area === "Robótica") &&
        !estudianteData.areas_competencia[index]?.categoria
      ) {
        return true;
      }
    }

    if (campo.startsWith("tutor_academico_")) {
      const parts = campo.split("_");
      const index = parseInt(parts[2]);
      const field = parts.slice(3).join("_");
      const tutor = estudianteData.tutores_academicos?.[index]?.tutor;
      if (!tutor) return true;

      const camposObligatorios = ["nombre", "apellido_pa", "ci"];
      const camposCompletos = camposObligatorios.every(
        (c) => tutor[c] && !tieneError(`tutor_academico_${index}_${c}`)
      );

      if (camposCompletos) return false;

      if (!tutor[field]) return true;
    }
    return false;
  };

  return {
    seccionActiva,
    setSeccionActiva,
    estudianteData,
    errores,
    handleChange,
    handleDepartamentoChange,
    validarDatos,
    tieneError,
    mostrarCampo,
    campoEditable,
    validarFormatoCI,
    validarFormatoTelefono,
  };
};
