import { useFormData } from "./form-data-context";
import { useAreasDisponibles } from './AreasCompetencia/useAreasDisponibles';
import { useCategoriasHandler } from './AreasCompetencia/useCategoriasHandler';
import { useAreasSeleccion } from './AreasCompetencia/useAreasSeleccion';
import { procesarAreasCompetencia, validarFormulario } from './AreasCompetencia/areasUtils';
import { primeraFila, segundaFila } from './AreasCompetencia/areasConfig';
import Title from './AreasCompetencia/Title';
import LoadingIndicator from './AreasCompetencia/LoadingIndicator';
import AreaGrid from './AreasCompetencia/AreaGrid';
import AreaSummary from './AreasCompetencia/AreaSummary';
import NavigationButtons from './AreasCompetencia/NavigationButtons';
import axios from "axios";
import { useState, useEffect } from "react";

export default function AreasCompetencia({
  formData,
  handleInputChange,
  handleBack,
  handleNext,
}) {
  const { globalData, setGlobalData } = useFormData();
  const seleccionadas = formData.estudiante?.areasSeleccionadas || [];
  const categoriasSeleccionadas = formData.estudiante?.categoriasSeleccionadas || {};
  const cursoEstudiante = formData.estudiante?.curso || "";
  
  const [maxAreas, setMaxAreas] = useState(0); 
  const [cargandoMaxAreas, setCargandoMaxAreas] = useState(false);
  
  const olimpiadaId = globalData?.olimpiada?.id;


  useEffect(() => {
    if (olimpiadaId) {
      const cargarMaxAreas = async () => {
        setCargandoMaxAreas(true);
        try {
          const response = await axios.get(`http://localhost:8000/olimpiada/${olimpiadaId}`);
          
          if (response.status === 200 && response.data) {
            // Forzar la conversión a número entero
            const maxMateriasValue = parseInt(response.data.max_materias, 10);
            // Usar el valor real incluso si es 0, solo usar 0 si es NaN
            setMaxAreas(isNaN(maxMateriasValue) ? 0 : maxMateriasValue);
          }
        } catch (error) {
          console.error("Error al cargar máximo de áreas:", error);
        } finally {
          setCargandoMaxAreas(false);
        }
      };
      
      cargarMaxAreas();
    }
  }, [olimpiadaId]);

  const { 
    cargandoAreas, 
    errorCarga, 
    areaEstaDisponible, 
  } = useAreasDisponibles(olimpiadaId);

  const { obtenerCategoriaAutomatica, obtenerCategorias } = useCategoriasHandler(cursoEstudiante);
  const { manejarSeleccion, handleCategoriaChange } = useAreasSeleccion(
    seleccionadas, 
    categoriasSeleccionadas, 
    obtenerCategorias,
    handleInputChange,
    maxAreas
  );

  // Manejo del envío y avance
  const handleSubmitAndNext = () => {
    if (!validarFormulario(seleccionadas, categoriasSeleccionadas, obtenerCategorias, obtenerCategoriaAutomatica)) {
      return;
    }

    try {
      const areasCompetencia = procesarAreasCompetencia(
        seleccionadas, 
        categoriasSeleccionadas, 
        cursoEstudiante
      );

      const updatedData = {
        ...globalData,
        areas_competencia: areasCompetencia,
      };

      setGlobalData(updatedData);
      handleInputChange("estudiante", "areasComplete", true);
      handleNext();
    } catch (error) {
      console.error("Error al procesar los datos de áreas:", error);
    }
  };

  // Validación para activar/desactivar botón de siguiente
  const isFormValid = validarFormulario(
    seleccionadas, 
    categoriasSeleccionadas, 
    obtenerCategorias, 
    obtenerCategoriaAutomatica
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      <Title maxAreas={maxAreas} cargandoMaxAreas={cargandoMaxAreas} />
      
      <LoadingIndicator 
        cargandoAreas={cargandoAreas} 
        errorCarga={errorCarga} 
      />

      <AreaGrid 
        primeraFila={primeraFila}
        segundaFila={segundaFila}
        seleccionadas={seleccionadas}
        areaEstaDisponible={areaEstaDisponible}
        obtenerCategorias={obtenerCategorias}
        categoriasSeleccionadas={categoriasSeleccionadas}
        manejarSeleccion={manejarSeleccion}
        handleCategoriaChange={handleCategoriaChange}
        cargandoAreas={cargandoAreas}
        maxAreas={maxAreas}
      />

      <AreaSummary 
        seleccionadas={seleccionadas}
        categoriasSeleccionadas={categoriasSeleccionadas}
        cursoEstudiante={cursoEstudiante}
        obtenerCategoriaAutomatica={obtenerCategoriaAutomatica}
      />

      <NavigationButtons 
        handleBack={handleBack}
        handleSubmitAndNext={handleSubmitAndNext}
        isValid={isFormValid}
      />
    </div>
  );
}