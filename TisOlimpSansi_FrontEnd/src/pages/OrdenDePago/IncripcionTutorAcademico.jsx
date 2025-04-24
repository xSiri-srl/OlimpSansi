import React, { useState, useEffect } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useFormData } from "./form-data-context";

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
  
  // Obtener las áreas del contexto global
  const areasCompetencia = globalData.areas_competencia || [];
  
  // Inicializar el estado cuando se cargan las áreas o cuando cambia el formData
  useEffect(() => {
    const initialState = {};
    areasCompetencia.forEach(area => {
      initialState[area.nombre_area] =
        (formData.profesores?.areasRegistradas || []).includes(area.nombre_area);
    });
    setExpandedAreas(initialState);
  
    const tutoresState = {};
  
    if (globalData.tutores_academicos?.length > 0) {
      globalData.tutores_academicos.forEach(tutor => {
        const isCustomTutor = tutor.tutor?.ci !== globalData.estudiante?.ci ||
                              tutor.tutor?.correo !== globalData.estudiante?.correo;
  
        tutoresState[tutor.nombre_area] = {
          apellidoPaterno: tutor.tutor?.apellido_pa || "",
          apellidoMaterno: tutor.tutor?.apellido_ma || "",
          nombres: tutor.tutor?.nombre || "",
          ci: tutor.tutor?.ci || "",
          correo: tutor.tutor?.correo || "",
          seleccionado: isCustomTutor
        };
  
        if (isCustomTutor) {
          setExpandedAreas(prev => ({...prev, [tutor.nombre_area]: true}));
        }
      });
    } else {
      // Si no hay datos en el contexto global, inicializar con seleccionados desde formData
      (formData.profesores?.areasRegistradas || []).forEach(area => {
        tutoresState[area] = {
          apellidoPaterno: "",
          apellidoMaterno: "",
          nombres: "",
          ci: "",
          correo: "",
          seleccionado: true
        };
      });
    }
  
    setTutoresPorArea(tutoresState);
  }, [areasCompetencia, globalData, formData.profesores]);
  
  const toggleArea = (area) => {
    // Solo expandir/colapsar si el área está seleccionada
    if (tutoresPorArea[area]?.seleccionado) {
      setExpandedAreas(prev => ({
        ...prev,
        [area]: !prev[area]
      }));
    }
  };
  
  const handleCheckboxChange = (area) => {
    const nuevoEstado = !tutoresPorArea[area]?.seleccionado;
    
    setTutoresPorArea(prev => ({
      ...prev,
      [area]: {
        ...prev[area] || {
          apellidoPaterno: "",
          apellidoMaterno: "",
          nombres: "",
          ci: "",
          correo: ""
        },
        seleccionado: nuevoEstado
      }
    }));

    handleInputChange("profesores", "areasRegistradas", [
      ...new Set([
        ...(formData.profesores.areasRegistradas || []).filter(a => a !== area),
        ...(nuevoEstado ? [area] : []),
      ])
    ]);
    
    // Si se selecciona, expandir; si se deselecciona, colapsar
    setExpandedAreas(prev => ({
      ...prev,
      [area]: nuevoEstado
    }));
    
    // Limpiar errores relacionados con esta área
    Object.keys(errors).forEach(key => {
      if (key.startsWith(`${area}-`)) {
        setErrors(prev => ({...prev, [key]: ""}));
      }
    });
  };
  
  const handleFormChange = (area, field, value, regex) => {
    // Validar el valor según el regex si se proporciona
    if (regex && !regex.test(value) && value !== "") {
      return;
    }
    
    setTutoresPorArea(prev => ({
      ...prev,
      [area]: {
        ...prev[area],
        [field]: value
      }
    }));
    
    // Limpiar error del campo
    setErrors(prev => ({
      ...prev,
      [`${area}-${field}`]: ""
    }));
  };
  
  const validateInput = (area, field, value, regex) => {
    const errorKey = `${area}-${field}`;
    
    if (!value) {
      setErrors(prev => ({ ...prev, [errorKey]: "Campo obligatorio." }));
      return false;
    }
    
    if (regex && !regex.test(value)) {
      setErrors(prev => ({ ...prev, [errorKey]: "Formato inválido." }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, [errorKey]: "" }));
    return true;
  };
  
  const validateEmail = (area, email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(area, "correo", email, emailRegex);
  };
  
  const validateArea = (area) => {
    const tutor = tutoresPorArea[area];
    
    if (!tutor || !tutor.seleccionado) {
      return true; // Si no está seleccionada, no validamos
    }
    
    const isApellidoPaternoValid = validateInput(
      area,
      "apellidoPaterno",
      tutor.apellidoPaterno,
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isApellidoMaternoValid = validateInput(
      area,
      "apellidoMaterno",
      tutor.apellidoMaterno,
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isNombresValid = validateInput(
      area,
      "nombres",
      tutor.nombres,
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
    );
    
    const isCIValid = validateInput(
      area,
      "ci",
      tutor.ci,
      /^[0-9]*$/
    );
    
    const isCorreoValid = validateEmail(area, tutor.correo);
    
    return isApellidoPaternoValid && isApellidoMaternoValid && isNombresValid && isCIValid && isCorreoValid;
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    let formValid = true;
    
    // Validar todas las áreas seleccionadas
    Object.keys(tutoresPorArea).forEach(area => {
      if (tutoresPorArea[area]?.seleccionado) {
        if (!validateArea(area)) {
          formValid = false;
        }
      }
    });
    
    if (!formValid) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Construir el array de tutores académicos
      const tutoresAcademicos = [];
      
      // Procesar todas las áreas de competencia
      areasCompetencia.forEach(areaObj => {
        const area = areaObj.nombre_area;
        const tutor = tutoresPorArea[area];
        
        if (tutor?.seleccionado) {
          // Para áreas con tutor seleccionado
          tutoresAcademicos.push({
            nombre_area: area,
            tutor: {
              nombre: tutor.nombres,
              apellido_pa: tutor.apellidoPaterno,
              apellido_ma: tutor.apellidoMaterno,
              ci: tutor.ci,
              correo: tutor.correo
            }
          });
        } else {
          // Para áreas no seleccionadas, usar datos del estudiante
          tutoresAcademicos.push({
            nombre_area: area,
            tutor: {
              nombre: globalData.estudiante?.nombre || "",
              apellido_pa: globalData.estudiante?.apellido_pa || "",
              apellido_ma: globalData.estudiante?.apellido_ma || "",
              ci: globalData.estudiante?.ci || "",
              correo: globalData.estudiante?.correo || ""
            }
          });
        }
      });
      
      // Actualizar el contexto global
      const updatedData = {
        ...globalData,
        tutores_academicos: tutoresAcademicos
      };
      
      setGlobalData(updatedData);
      console.log("Tutores académicos actualizados:", updatedData);
      
      // Actualizar el formData para el componente padre
      handleInputChange("flow", "editingTutores", false);
      
      // Importante: permitir el paso al siguiente componente
      handleNext();
      
    } catch (error) {
      console.error("Error al procesar los datos de tutores académicos:", error);
      setErrors({
        general: "Hubo un error al procesar los datos."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isFormValid = () => {
    // Verificar si hay algún área seleccionada
    const areasSeleccionadas = Object.keys(tutoresPorArea).filter(
      area => tutoresPorArea[area]?.seleccionado
    );
    
    // Si no hay áreas seleccionadas, el formulario es válido (usará datos del estudiante)
    if (areasSeleccionadas.length === 0) {
      return true;
    }
    
    // Verificar que todas las áreas seleccionadas tengan datos válidos
    for (const area of areasSeleccionadas) {
      const tutor = tutoresPorArea[area];
      
      // Validar campos requeridos
      if (!tutor.apellidoPaterno || !tutor.apellidoMaterno || !tutor.nombres || !tutor.ci || !tutor.correo) {
        return false;
      }
      
      // Validar formato de correo electrónico
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(tutor.correo)) {
        return false;
      }
    }
    
    return true;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registro de Tutores Académicos</h2>
          <p className="text-center text-gray-600">
            Seleccione las áreas para las que desea registrar un tutor académico diferente al estudiante.
            Si no selecciona ninguna, se utilizarán los datos del estudiante como tutores académicos.
          </p>
        </div>
        
        {/* Mapeo de cada área de competencia */}
        {areasCompetencia.map((area, index) => (
          <div key={index} className="mb-6 border rounded-lg shadow-sm overflow-hidden">
            <div 
              className="bg-gray-100 p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleArea(area.nombre_area)}
            >
              <div className="flex-1">
                <label htmlFor={`checkbox-${index}`} className="text-lg font-medium cursor-pointer">
                  ¿Desea registrar un tutor académico para {area.nombre_area}?
                </label>
              </div>
              <div className="flex items-center">
                {tutoresPorArea[area.nombre_area]?.seleccionado && (
                  expandedAreas[area.nombre_area] ? 
                    <FaChevronUp className="text-gray-500 mr-3" /> : 
                    <FaChevronDown className="text-gray-500 mr-3" />
                )}
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  checked={tutoresPorArea[area.nombre_area]?.seleccionado || false}
                  onChange={() => handleCheckboxChange(area.nombre_area)}
                  className="h-5 w-5"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            {tutoresPorArea[area.nombre_area]?.seleccionado && expandedAreas[area.nombre_area] && (
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
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <label className="flex items-center gap-2">
                        <FaUser className="text-black" /> Apellido Paterno
                      </label>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Apellido Paterno"
                        value={tutoresPorArea[area.nombre_area]?.apellidoPaterno || ""}
                        onChange={(e) => handleFormChange(
                          area.nombre_area,
                          "apellidoPaterno",
                          e.target.value.toUpperCase(),
                          /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                        )}
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
                        value={tutoresPorArea[area.nombre_area]?.apellidoMaterno || ""}
                        onChange={(e) => handleFormChange(
                          area.nombre_area,
                          "apellidoMaterno",
                          e.target.value.toUpperCase(),
                          /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                        )}
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
                      onChange={(e) => handleFormChange(
                        area.nombre_area,
                        "nombres",
                        e.target.value.toUpperCase(),
                        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                      )}
                      maxLength="30"
                    />
                    {errors[`${area.nombre_area}-nombres`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`${area.nombre_area}-nombres`]}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <FaIdCard className="text-black" /> Carnet de Identidad
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder="Número de Carnet de Identidad"
                      value={tutoresPorArea[area.nombre_area]?.ci || ""}
                      onChange={(e) => handleFormChange(
                        area.nombre_area,
                        "ci",
                        e.target.value,
                        /^[0-9]*$/
                      )}
                      maxLength="8"
                    />
                    {errors[`${area.nombre_area}-ci`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`${area.nombre_area}-ci`]}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <FaEnvelope className="text-black" /> Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder="Correo Electrónico"
                      value={tutoresPorArea[area.nombre_area]?.correo || ""}
                      onChange={(e) => handleFormChange(
                        area.nombre_area,
                        "correo",
                        e.target.value
                      )}
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
            disabled={isSubmitting}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              !isSubmitting
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