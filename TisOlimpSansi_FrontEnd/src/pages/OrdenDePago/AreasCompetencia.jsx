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
import { useState, useEffect } from "react";
import { API_URL } from "../../utils/api";
import axios from "axios"

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

  const { 
    cargandoAreas, 
    errorCarga, 
    areaEstaDisponible,
    areasCategorias
  } = useAreasDisponibles(globalData);


  useEffect(() => {
    if (olimpiadaId) {
      const cargarMaxAreas = async () => {
        setCargandoMaxAreas(true);
        try {
          const response = await axios.get(`${API_URL}/olimpiada/${olimpiadaId}`);
          
          if (response.status === 200 && response.data) {
            const maxMateriasValue = parseInt(response.data.max_materias, 10);
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

  const { obtenerCategoriaAutomatica, obtenerCategorias } = useCategoriasHandler(
    cursoEstudiante,
    areasCategorias
  );
  

  const { manejarSeleccion, handleCategoriaChange } = useAreasSeleccion(
    seleccionadas, 
    categoriasSeleccionadas, 
    obtenerCategorias,
    handleInputChange,
    maxAreas
  );

  // Simplificar la validación para que coincida con la implementación
  const isFormValid = validarFormulario(seleccionadas, categoriasSeleccionadas);

  // Manejo del envío y avance
  const handleSubmitAndNext = () => {
    if (!isFormValid) {
      return;
    }

    try {
      const areasCompetencia = procesarAreasCompetencia(
        seleccionadas, 
        categoriasSeleccionadas
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
        categoriasSeleccionadas={categoriasSeleccionadas}
        manejarSeleccion={manejarSeleccion}
        handleCategoriaChange={handleCategoriaChange}
        cargandoAreas={cargandoAreas}
        maxAreas={maxAreas}
        areasCategorias={areasCategorias}
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