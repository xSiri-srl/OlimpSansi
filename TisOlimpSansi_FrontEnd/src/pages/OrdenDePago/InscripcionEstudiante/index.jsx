import { useState, useEffect } from "react";
import { useFormData } from "../form-data-context";
import DatosPersonalesForm from "./DatosPersonalesForm";
import DatosColegioForm from "./DatosColegioForm";
import useFormValidation from "./hooks/useFormValidation";
import useColegioData from "./hooks/useColegioData";
import axios from "axios";
import { CURSOS } from "./constants";

export default function InscripcionEstudiante({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [estudianteFound, setEstudianteFound] = useState(false);
  const { globalData, setGlobalData } = useFormData();

  const colegioData = useColegioData(formData, handleInputChange);
  const { errors, setErrors, isFormValid, validateAllFields } = useFormValidation(
    formData, 
    colegioData.esNuevoColegio
  );

const buscarEstudiantePorCI = async (ci) => {
  if (ci?.length >= 7) {
    setIsSearching(true);
    console.log("Buscando estudiante con CI:", ci);
    
    try {
      const apiUrl = `http://localhost:8000/api/buscarEstudiante/${ci}`;
      console.log("Consultando API en:", apiUrl);
      
      const response = await axios.get(apiUrl);
      console.log("Respuesta recibida:", response.data);
      
      if (response.data.found) {
        const estudiante = response.data.estudiante;
        
        handleInputChange('estudiante', 'nombres', estudiante.nombre);
        handleInputChange('estudiante', 'apellidoPaterno', estudiante.apellido_pa);
        handleInputChange('estudiante', 'apellidoMaterno', estudiante.apellido_ma);
        
        // Formatear correctamente la fecha (yyyy-mm-dd)
        if (estudiante.fecha_nacimiento) {
          console.log("Fecha original recibida:", estudiante.fecha_nacimiento);
          
          let fechaFormateada;
          
          if (typeof estudiante.fecha_nacimiento === 'string') {
            if (estudiante.fecha_nacimiento.includes('T')) {
              fechaFormateada = estudiante.fecha_nacimiento.split('T')[0];
            } else if (estudiante.fecha_nacimiento.includes(' ')) {
              fechaFormateada = estudiante.fecha_nacimiento.split(' ')[0];
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(estudiante.fecha_nacimiento)) {
              fechaFormateada = estudiante.fecha_nacimiento;
            } else {
              const fecha = new Date(estudiante.fecha_nacimiento);
              if (!isNaN(fecha.getTime())) {
                fechaFormateada = fecha.toISOString().split('T')[0];
              }
            }
          } else if (estudiante.fecha_nacimiento instanceof Date) {
            fechaFormateada = estudiante.fecha_nacimiento.toISOString().split('T')[0];
          }
          
          console.log("Fecha formateada:", fechaFormateada);
          
          if (fechaFormateada) {
            setTimeout(() => {
              handleInputChange('estudiante', 'fechaNacimiento', fechaFormateada);
              console.log("Fecha establecida en el formulario:", fechaFormateada);
            }, 0);
          } else {
            console.error("No se pudo formatear la fecha:", estudiante.fecha_nacimiento);
          }
        }
        
        handleInputChange('estudiante', 'correo', estudiante.correo || '');
        handleInputChange('estudiante', 'correoPertenece', estudiante.propietario_correo || '');
        
        if (estudiante.colegio) {
          handleInputChange('estudiante', 'departamentoSeleccionado', estudiante.colegio.departamento);
          handleInputChange('estudiante', 'distrito', estudiante.colegio.distrito);
          handleInputChange('estudiante', 'colegio', estudiante.colegio.nombre_colegio);
        }
        
        // Manejar la normalización del grado/curso en un bloque try-catch separado
        try {
          if (estudiante.grado && estudiante.grado.nombre_grado) {
            const gradoNombre = estudiante.grado.nombre_grado;
            console.log("Grado recibido del backend:", gradoNombre);
            
            // Normalizar el nombre del grado para que coincida con las opciones del desplegable
            let cursoNormalizado = gradoNombre;
            
            // Primero verificar si ya hay una coincidencia exacta
            if (CURSOS.includes(gradoNombre)) {
              cursoNormalizado = gradoNombre;
            } else {
              // Si no hay coincidencia exacta, intentamos normalizar
              const gradoLower = gradoNombre.toLowerCase();
              
              // Detectar si es primaria o secundaria
              const esPrimaria = gradoLower.includes('primaria');
              const esSecundaria = gradoLower.includes('secundaria');
              
              // Extraer el número del grado
              const numeroMatch = gradoLower.match(/\d+/);
              const numero = numeroMatch ? numeroMatch[0] : '';
              
              if (numero) {
                // Buscar coincidencias en el array CURSOS
                const posibleCurso = CURSOS.find(curso => {
                  const cursoLower = curso.toLowerCase();
                  
                  // Verificar si coincide el nivel (primaria/secundaria) y el número
                  if (esPrimaria && cursoLower.includes('primaria') && cursoLower.includes(numero)) {
                    return true;
                  }
                  if (esSecundaria && cursoLower.includes('secundaria') && cursoLower.includes(numero)) {
                    return true;
                  }
                  return false;
                });
                
                if (posibleCurso) {
                  cursoNormalizado = posibleCurso;
                }
              }
            }
            
            console.log("Grado normalizado:", cursoNormalizado);
            
            // Establecer el curso normalizado en el formulario
            handleInputChange('estudiante', 'curso', cursoNormalizado);
          }
        } catch (cursoError) {
          console.error("Error al procesar el curso:", cursoError);
          // No mostramos error al usuario para no interrumpir el flujo
        }
        
        setEstudianteFound(true);
        console.log("Estudiante encontrado:", estudiante);
      } else {
        setEstudianteFound(false);
        console.log("No se encontró estudiante con ese CI");
      }
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
      setErrors(prev => ({
        ...prev,
        ci: "Error al buscar en la base de datos. Intente de nuevo."
      }));
      setEstudianteFound(false);
    } finally {
      setIsSearching(false);
    }
  }
};


  const handleCIChange = (value) => {
    handleInputChange("estudiante", "ci", value);
    setErrors((prev) => ({ ...prev, ci: "" }));
    
    if (value.length >= 7 && value.length <= 8) {
      buscarEstudiantePorCI(value);
    } else if (value.length < 7) {
      setEstudianteFound(false);
    }
  };


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        colegioData.sugerenciasRef.current &&
        !colegioData.sugerenciasRef.current.contains(event.target)
      ) {
        colegioData.setMostrarSugerencias(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmitAndNext = () => {
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedData = {
        ...globalData,
        estudiante: {
          nombre: formData.estudiante?.nombres,
          apellido_pa: formData.estudiante?.apellidoPaterno,
          apellido_ma: formData.estudiante?.apellidoMaterno,
          ci: formData.estudiante?.ci,
          fecha_nacimiento: formData.estudiante?.fechaNacimiento,
          correo: formData.estudiante?.correo,
          propietario_correo: formData.estudiante?.correoPertenece,
        },
        colegio: {
          nombre_colegio: formData.estudiante?.colegio,
          departamento: formData.estudiante?.departamentoSeleccionado,
          distrito: formData.estudiante?.distrito,
          curso: formData.estudiante?.curso,
          es_nuevo: colegioData.esNuevoColegio,
        },
      };

      // Guardar en el contexto global
      setGlobalData(updatedData);

      console.log("Datos actualizados en JSON:", updatedData);

      // Continuar al siguiente paso
      handleNext();
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      setErrors({
        general: "Error al guardar los datos. Inténtelo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Columna 1: Datos Personales */}
        <DatosPersonalesForm 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleCIChange={handleCIChange}
          errors={errors}
          isSearching={isSearching}
          estudianteFound={estudianteFound}
        />

        {/* Columna 2: Datos del Colegio */}
        <DatosColegioForm 
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          colegioData={colegioData}
        />
      </div>

      {/* Mensaje de error general */}
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 w-full max-w-4xl">
          {errors.general}
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="flex justify-center mt-8 gap-4 w-full">
        <button
          type="button"
          className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-gray-500 hover:-translate-y-1 hover:scale-105 hover:bg-gray-600"
          onClick={handleBack}
          disabled={isSubmitting}
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleSubmitAndNext}
          disabled={!isFormValid || isSubmitting}
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
            isFormValid && !isSubmitting
              ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Procesando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}