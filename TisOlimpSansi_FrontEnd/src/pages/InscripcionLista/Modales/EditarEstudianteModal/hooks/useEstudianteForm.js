import { useState, useEffect } from 'react';
import { SECCIONES } from '../constants'
import { normalizarDatosEstudiante } from '../utils';

export const useEstudianteForm = (estudiante) => {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES.TODOS);
  const [estudianteData, setEstudianteData] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (estudiante?.originalData) {
      console.log("Datos originales recibidos:", estudiante.originalData);
      
      const normalizedData = normalizarDatosEstudiante(estudiante.originalData);
      
      console.log("Datos normalizados:", normalizedData);
  
      const erroresIniciales = {};
      
      // Validar áreas que requieren categoría
      normalizedData.areas_competencia?.forEach((area, index) => {
        if ((area.nombre_area === "Informática" || area.nombre_area === "Robótica") && !area.categoria) {
          erroresIniciales[`categoria_${index}`] = `Debe seleccionar una categoría para ${area.nombre_area}`;
        }
      });
      
      // Validar CI del estudiante
      if (normalizedData.estudiante?.ci && !/^\d{7,8}$/.test(normalizedData.estudiante.ci)) {
        erroresIniciales.ci = "El CI del estudiante debe contener entre 7 y 8 dígitos numéricos";
      }
      
      // Validar formato de teléfono del tutor legal
      if (normalizedData.tutor_legal?.numero_celular && !/^\d{7,9}$/.test(normalizedData.tutor_legal.numero_celular)) {
        erroresIniciales.tutor_legal_telefono = "El teléfono debe contener entre 7 y 9 dígitos numéricos";
      }
      
      // Validar CI de tutores académicos
      normalizedData.tutores_academicos?.forEach((tutor, index) => {
        if (tutor?.tutor?.ci && !/^\d{7,8}$/.test(tutor.tutor.ci)) {
          erroresIniciales[`tutor_academico_${index}_ci`] = "El CI del tutor académico debe contener entre 7 y 8 dígitos numéricos";
        }
      });
      
      // Validar CI del tutor legal
      if (normalizedData.tutor_legal?.ci && !/^\d{7,8}$/.test(normalizedData.tutor_legal.ci)) {
        erroresIniciales.tutor_legal_ci = "El CI del tutor legal debe contener entre 7 y 8 dígitos numéricos";
      }
      
      // Establecer errores encontrados
      if (Object.keys(erroresIniciales).length > 0) {
        setErrores(erroresIniciales);
      }
      
      setEstudianteData(normalizedData);
    }
  }, [estudiante]);

  const handleChange = (section, field, value) => {
    setEstudianteData(prev => {
      const newData = {...prev};
      
      if (section === 'estudiante') {
        newData.estudiante = {...newData.estudiante, [field]: value};
      } else if (section === 'colegio') {
        newData.colegio = {...newData.colegio, [field]: value};
      } else if (section === 'tutor_legal') {
        newData.tutor_legal = {...newData.tutor_legal, [field]: value};
      } else if (section.startsWith('tutor_academico_')) {
        const index = parseInt(section.split('_')[2]);
        if (!newData.tutores_academicos) newData.tutores_academicos = [];
        if (!newData.tutores_academicos[index]) {
          newData.tutores_academicos[index] = {
            nombre_area: newData.areas_competencia?.[index]?.nombre_area || '',
            tutor: {}
          };
        }
        newData.tutores_academicos[index].tutor = {
          ...newData.tutores_academicos[index].tutor,
          [field]: value
        };
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
      
      console.log("Datos actualizados:", newData);
      return newData;
    });
  };

  // función para cambiar el departamento y resetear provincia
  const handleDepartamentoChange = (value) => {
    setEstudianteData(prev => ({
      ...prev,
      colegio: {
        ...prev.colegio,
        departamento: value,
        provincia: '' 
      }
    }));
  };

  // Validar todos los campos requeridos
  const validarDatos = () => {
    const nuevoErrores = {};
    
    // Validar datos del estudiante
    if (!estudianteData.estudiante?.nombre) 
      nuevoErrores.nombre = "El nombre es obligatorio";
    if (!estudianteData.estudiante?.apellido_pa) 
      nuevoErrores.apellido_pa = "El apellido paterno es obligatorio";
    if (!estudianteData.estudiante?.ci) 
      nuevoErrores.ci = "El CI es obligatorio";
    if (estudianteData.estudiante?.ci) {
      if (!/^\d{7,8}$/.test(estudianteData.estudiante.ci)) {
        nuevoErrores.ci = "El CI debe contener entre 7 y 8 dígitos numéricos";
      }
    }

      // Validar datos del tutor legal
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
      // Validar CI de tutores académicos
      estudianteData.tutores_academicos?.forEach((tutor, index) => {
         if (tutor?.tutor?.ci) {
            if (!/^\d{7,8}$/.test(tutor.tutor.ci)) {
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
    if (!estudianteData.areas_competencia || estudianteData.areas_competencia.length === 0 ||
        !estudianteData.areas_competencia[0]?.nombre_area) {
      nuevoErrores.areas = "Debe seleccionar al menos un área de competencia";
    }
    
    // validar categorías para informática y robótica
    estudianteData.areas_competencia?.forEach((area, index) => {
      if ((area.nombre_area === "Informática" || area.nombre_area === "Robótica") && !area.categoria) {
        nuevoErrores[`categoria_${index}`] = `Debe seleccionar una categoría para ${area.nombre_area}`;
      }
    });
    
    setErrores(nuevoErrores);
    return Object.keys(nuevoErrores).length === 0;
  };

  // verificar si el campo tiene error
  const tieneError = (campo) => Boolean(errores[campo]);

  // Función para mostrar u ocultar campos según la sección activa
  // Función para mostrar u ocultar campos según la sección activa
  const mostrarCampo = (campo) => {
    if (seccionActiva === SECCIONES.TODOS) return true;
    
    // En modo de solo campos inválidos, verificar todos los tipos de errores
    
    // Si el campo específico tiene error, siempre mostrarlo
    if (tieneError(campo)) {
      return true;
    }
    
    // Para errores específicos de estudiante
    if (tieneError('ci') || tieneError('apellido_pa') || tieneError('nombre')) {
      if (campo === 'ci' || campo === 'apellido_pa' || campo === 'nombre') {
        return true;
      }
    }
    
    // Para errores específicos de colegio
    if (tieneError('nombre_colegio') || tieneError('curso')) {
      if (campo === 'nombre_colegio' || campo === 'curso') {
        return true;
      }
    }
    
    // Para errores de categoría en áreas
    const tieneErrorCategoria = Object.keys(errores).some(key => key.startsWith('categoria_'));
    if (tieneErrorCategoria || tieneError('areas')) {
      if (campo === 'areas') {
        return true;
      }
    }
    
    // Para errores en tutor legal
    if (tieneError('tutor_legal_ci') || tieneError('tutor_legal_telefono')) {
      if (campo === 'tutor_legal') {
        return true;
      }
    }
    
    // Para errores en tutores académicos
    const tieneErrorTutorAcademico = Object.keys(errores).some(key => key.startsWith('tutor_academico_'));
    if (tieneErrorTutorAcademico) {
      if (campo === 'tutores_academicos') {
        return true;
      }
    }
    
    // No mostrar el campo por defecto en modo "Solo campos inválidos"
    return false;
  };
    // Validar formato numérico para CI
    const validarFormatoCI = (value) => {
      // Permitir solo dígitos y limitar longitud
      return value.replace(/\D/g, '').substring(0, 8);
    };
    
    // Validar formato numérico para teléfono
    const validarFormatoTelefono = (value) => {
      // Permitir solo dígitos y limitar longitud
      return value.replace(/\D/g, '').substring(0, 9);
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
    validarFormatoCI,
    validarFormatoTelefono
  };
};