import { useState, useEffect } from 'react';

export const useEstudianteForm = (estudiante, ests, onEstudiantesChange) => {
  const [estudianteData, setEstudianteData] = useState(null);
  const [errores, setErrores] = useState({});
  const [estudiantes, setEstudiantes] = useState(ests)

  useEffect(() => {
    if (estudiante?.originalData) {
      console.log("Datos originales recibidos:", estudiante.originalData);
      
      const normalizedData = estudiante.originalData;
      
      console.log("Datos normalizados:", normalizedData);      
      setEstudianteData(normalizedData);
    }
  }, [estudiante]);

  const handleChange = (section, field, value) => {
    setEstudianteData(prev => {
      const newData = {...prev};
      
      if (section === 'estudiante') {
      newData.estudiante = { ...newData.estudiante, [field]: value };

      // Si se cambia el correo del estudiante (competidor), sincronizar todos los datos del estudiante
      if (field === 'correo') {
        const correoAnterior = prev.estudiante?.correo;
        if (correoAnterior && correoAnterior !== value) {
          setEstudiantes(prevEstudiantes => {
            const actualizados = prevEstudiantes.map(est => {
              if (
                est.estudiante?.correo === correoAnterior &&
                est.estudiante?.ci === newData.estudiante?.ci
              ) {
                return {
                  ...est,
                  estudiante: {
                    ...est.estudiante,
                    ...newData.estudiante // sincronizar datos
                  }
                };
              }
              return est;
            });

            if (onEstudiantesChange) {
              onEstudiantesChange(actualizados);
            }

            return actualizados;
          });
        }
      }
    } else if (section === 'colegio') {
        newData.colegio = {...newData.colegio, [field]: value};
      } else if (section === 'tutor_legal') {
        newData.tutor_legal = { ...newData.tutor_legal, [field]: value };
        const ciTutor = newData.tutor_legal.ci;

        setEstudiantes(prevEstudiantes => {
          const actualizados = prevEstudiantes.map(est => {
            if (est.tutor_legal?.ci === ciTutor) {
              return {
                ...est,
                tutor_legal: {
                  ...est.tutor_legal,
                  ...newData.tutor_legal // sincronizar datos
                }
              };
            }
            return est;
          });

          if (onEstudiantesChange) {
            onEstudiantesChange(actualizados);
          }

          return actualizados;
        });
      } else if (section.startsWith('tutor_academico_')) {
        // Actualizar el tutor académico local
        newData.tutores_academicos[0].tutor = {
          ...newData.tutores_academicos[0].tutor,
          [field]: value
        };

        const tutorActualizado = newData.tutores_academicos[0].tutor;
        // Solo si el CI existe y no está vacío
        if (tutorActualizado.ci && tutorActualizado.ci !== '') {
          const ciTutorAcademico = tutorActualizado.ci;

          setEstudiantes(prevEstudiantes => {
            const actualizados = prevEstudiantes.map(est => {
              if (est.tutores_academicos[0].tutor.ci == newData.tutores_academicos[0].tutor.ci) {
                const tutoresActualizados = est.tutores_academicos?.map(tutorAcademico => {
                  if (tutorAcademico.tutor?.ci === ciTutorAcademico) {
                    return {
                      ...tutorAcademico,
                      tutor: {
                        ...tutorAcademico.tutor,
                        ...tutorActualizado
                      }
                    };
                  }
                  return tutorAcademico;
                });

                if (tutoresActualizados && tutoresActualizados.some(t => t.tutor?.ci === ciTutorAcademico)) {
                  return {
                    ...est,
                    tutores_academicos: tutoresActualizados
                  };
                }
              }
              return est;
            });

            // 👇 Esta es la clave que faltaba
            if (onEstudiantesChange) {
              onEstudiantesChange(actualizados);
            }

            return actualizados;
          });
        }
      } else if (section.startsWith('area_')) {
        const index = parseInt(section.split('_')[1]);
        if (!newData.areas_competencia) newData.areas_competencia = [];
        if (!newData.areas_competencia[index]) {
          newData.areas_competencia[index] = { nombre_area: '', categoria: '' };
        }
        
        if (field === 'nombre_area') {
          // Al cambiar el área, actualizar también el área del tutor académico
          if (!newData.tutores_academicos) {
            newData.tutores_academicos = [];
          }
          
          if (!newData.tutores_academicos[index]) {
            newData.tutores_academicos[index] = {
              nombre_area: value,
              tutor: { nombre: "", apellido_pa: "", apellido_ma: "", ci: "", correo: "" }
            };
          } else {
            newData.tutores_academicos[index].nombre_area = value;
          }
          
          newData.areas_competencia[index].nombre_area = value;
          // Resetear la categoría si cambia el área
          newData.areas_competencia[index].categoria = '';
        } else {
          newData.areas_competencia[index][field] = value;
        }
      }
      
      return newData;
    });
  };

const validarDatos = () => {
  const nuevoErrores = {};
  
  // Validar datos del estudiante
  if (!estudianteData.estudiante?.nombre) {
    nuevoErrores.nombre = "El nombre es obligatorio";
  } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.estudiante.nombre)) {
    nuevoErrores.nombre = "El nombre debe contener solo letras";
  }
  
  if (!estudianteData.estudiante?.apellido_pa) {
    nuevoErrores.apellido_pa = "El apellido paterno es obligatorio";
  } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.estudiante.apellido_pa)) {
    nuevoErrores.apellido_pa = "El apellido paterno debe contener solo letras";
  }
  
  if (estudianteData.estudiante?.apellido_ma && 
      !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.estudiante.apellido_ma)) {
    nuevoErrores.apellido_ma = "El apellido materno debe contener solo letras";
  }
  
  if (!estudianteData.estudiante?.ci) {
    nuevoErrores.ci = "El CI es obligatorio";
  } else if (!/^\d{7,8}$/.test(estudianteData.estudiante.ci)) {
    nuevoErrores.ci = "El CI debe contener entre 7 y 8 dígitos numéricos";
  }

  // Validar tutor legal si hay datos
  if (estudianteData.tutor_legal) {
    if (estudianteData.tutor_legal.nombre && 
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.tutor_legal.nombre)) {
      nuevoErrores.tutor_legal_nombre = "El nombre del tutor debe contener solo letras";
    }
    
    if (estudianteData.tutor_legal.apellido_pa && 
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.tutor_legal.apellido_pa)) {
      nuevoErrores.tutor_legal_apellido_pa = "El apellido paterno del tutor debe contener solo letras";
    }
    
    if (estudianteData.tutor_legal.apellido_ma && 
        !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(estudianteData.tutor_legal.apellido_ma)) {
      nuevoErrores.tutor_legal_apellido_ma = "El apellido materno del tutor debe contener solo letras";
    }
    
    if (estudianteData.tutor_legal?.ci) {
      if (!/^\d{7,8}$/.test(estudianteData.tutor_legal.ci)) {
        nuevoErrores.tutor_legal_ci = "El CI del tutor debe contener entre 7 y 8 dígitos numéricos";
      }
    }
    
    if (estudianteData.tutor_legal?.numero_celular) {
      if (!/^\d{7,9}$/.test(estudianteData.tutor_legal.numero_celular)) {
        nuevoErrores.tutor_legal_telefono = "El teléfono debe contener entre 7 y 9 dígitos numéricos";
      }
    }
  }
  
  // Validar CI de tutores académicos - SOLO si hay datos parciales ingresados
  estudianteData.tutores_academicos?.forEach((tutor, index) => {
    // Solo validar si al menos uno de los campos tiene datos
    const tutorData = tutor?.tutor || {};
    const hasTutorData = tutorData.nombre || tutorData.apellido_pa || tutorData.apellido_ma || 
                         tutorData.ci || tutorData.correo;
    
    // Si hay datos parciales, entonces validar que estén los campos requeridos
    if (hasTutorData) {
      if (!tutorData.nombre) {
        nuevoErrores[`tutor_academico_${index}_nombre`] = "El nombre del tutor académico es requerido";
      } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.nombre)) {
        nuevoErrores[`tutor_academico_${index}_nombre`] = "El nombre del tutor académico debe contener solo letras";
      }
      
      if (!tutorData.apellido_pa) {
        nuevoErrores[`tutor_academico_${index}_apellido_pa`] = "El apellido paterno del tutor académico es requerido";
      } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.apellido_pa)) {
        nuevoErrores[`tutor_academico_${index}_apellido_pa`] = "El apellido paterno del tutor académico debe contener solo letras";
      }
      if (!tutorData.apellido_ma) {
        nuevoErrores[`tutor_academico_${index}_apellido_ma`] = "El apellido materno del tutor académico es requerido";
      } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.apellido_ma)) {
        nuevoErrores[`tutor_academico_${index}_apellido_ma`] = "El apellido materno del tutor académico debe contener solo letras";
      }
      
      if (tutorData.apellido_ma && !/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(tutorData.apellido_ma)) {
        nuevoErrores[`tutor_academico_${index}_apellido_ma`] = "El apellido materno del tutor académico debe contener solo letras";
      }
      
      if (!tutorData.ci) {
        nuevoErrores[`tutor_academico_${index}_ci`] = "El CI del tutor académico es requerido";
      } else if (!/^\d{7,8}$/.test(tutorData.ci)) {
        nuevoErrores[`tutor_academico_${index}_ci`] = "El CI del tutor académico debe contener entre 7 y 8 dígitos numéricos";
      }
    }
  });
  
  // Validar datos del colegio
  if (!estudianteData.colegio?.nombre_colegio) 
    nuevoErrores.nombre_colegio = "El nombre del colegio es obligatorio";
  if (!estudianteData.colegio?.curso) 
    nuevoErrores.curso = "El curso es obligatorio";
  
  // Validar áreas de competencia
  if (!estudianteData.areas_competencia || estudianteData.areas_competencia[0].nombre_area == "" ||
      !estudianteData.areas_competencia[0]?.nombre_area) {
    nuevoErrores.areas = "Debe seleccionar un área de competencia";
  }
  // Validar áreas de competencia
  if (!estudianteData.areas_competencia || estudianteData.areas_competencia[0].categoria == "" ||
      !estudianteData.areas_competencia[0]?.categoria) {
        if(estudianteData.areas_competencia[0].nombre_area == ""){
          nuevoErrores[`categoria_${0}`] = `Debe seleccionar un área de competencia y luego una categoria`;
        }else{
          nuevoErrores[`categoria_${0}`] = `Debe seleccionar una categoría para ${estudianteData.areas_competencia[0].nombre_area}`;
        }
  }

  const tutorData = estudianteData.tutor_legal;
  if (!tutorData.correo) {
    nuevoErrores[`tutor_legal_correo`] = "El correo del tutor es requerido";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tutorData.correo)) {
    nuevoErrores[`tutor_legal_correo`] = "El correo del tutor no es válido";
  }

  if (!estudianteData.estudiante?.correo) {
    nuevoErrores.correo = "El correo del estudiante es obligatorio";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(estudianteData.estudiante.correo)) {
    nuevoErrores.correo = "El correo del estudiante no es válido";
  }

  const tutorAcademicoData = estudianteData.tutores_academicos[0].tutor;
  if (!tutorData.correo) {
    nuevoErrores[`tutor_academico_${0}_correo`] = "El correo del tutor académico es requerido";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tutorAcademicoData.correo)) {
    nuevoErrores[`tutor_academico_${0}_correo`] = "El correo del tutor académico no es válido";
  }
  
  setErrores(nuevoErrores);
  return Object.keys(nuevoErrores).length === 0;
};

  // verificar si el campo tiene error
  const tieneError = (campo) => Boolean(errores[campo]);

  // Función para mostrar u ocultar campos según la sección activa
  const mostrarCampo = (campo) => {
    return true;
  };
    // Validar formato numérico para CI
    const validarFormatoCI = (value) => {
      // Permitir solo dígitos y limitar longitud
      return value.replace(/\D/g, '').substring(0, 8);
    };

    // Validar y limpiar el correo electrónico
  const validarCorreo = (value) => {
    const email = value.trim(); // quitar espacios adelante/atrás

    // Expresión regular simple para validar email
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regexCorreo.test(email) ? email : email; // Retorna el valor igual, pero podrías retornar '' si querés forzar solo válido
  };
    
    // Validar formato numérico para teléfono
    const validarFormatoTelefono = (value) => {
      // Permitir solo dígitos y limitar longitud
      return value.replace(/\D/g, '').substring(0, 8);
    };

    const campoEditable = (campo) => {
      // Si el campo tiene error, siempre debe ser editable
      if (tieneError(campo)) return true;
      
      // Los campos que tienen errores relacionados también deben ser editables
      if (campo === 'areas' && Object.keys(errores).some(e => e.startsWith('categoria_'))) return true;
      
      // Verificar si el campo está vacío (obligatorio)
      if (campo === 'nombre' && !estudianteData.estudiante?.nombre) return true;
      if (campo === 'apellido_pa' && !estudianteData.estudiante?.apellido_pa) return true;
      if (campo === 'ci' && !estudianteData.estudiante?.ci) return true;
      if (campo === 'nombre_colegio' && !estudianteData.colegio?.nombre_colegio) return true;
      if (campo === 'curso' && !estudianteData.colegio?.curso) return true;
      
      // Para áreas de competencia
      if (campo === 'areas' && (!estudianteData.areas_competencia || estudianteData.areas_competencia.length === 0 || 
          !estudianteData.areas_competencia[0]?.nombre_area)) return true;
      
      // Categorías para informática/robótica
      if (campo.startsWith('categoria_')) {
        const index = parseInt(campo.split('_')[1]);
        const area = estudianteData.areas_competencia?.[index]?.nombre_area;
        if (!area) return true;
        if ((area === 'Informática' || area === 'Robótica') && !estudianteData.areas_competencia[index]?.categoria) {
          return true;
        }
      }
      
      if (campo.startsWith('tutor_academico_')) {
        const parts = campo.split('_');
        const index = parseInt(parts[2]);
        const field = parts.slice(3).join('_'); 
        const tutor = estudianteData.tutores_academicos?.[index]?.tutor;
        if (!tutor) return true;
        
        // Verificar si todos los campos obligatorios del tutor están llenos y sin errores
        const camposObligatorios = ['nombre', 'apellido_pa', 'ci'];
        const camposCompletos = camposObligatorios.every(c => 
          tutor[c] && !tieneError(`tutor_academico_${index}_${c}`)
        );
        
        // Si están todos los campos obligatorios completos y sin errores, no debe ser editable
        if (camposCompletos) return false;
        
        // Si el campo específico está vacío, debe ser editable
        if (!tutor[field]) return true;
      }
      return false;
    };

return {
  estudianteData,
  errores,
  handleChange,
  validarDatos,
  tieneError,
  mostrarCampo,
  campoEditable,
  validarFormatoCI,
  validarFormatoTelefono,
  validarCorreo
};

};