import React from "react";
import { FaTimes } from "react-icons/fa";
import { useEstudianteForm } from "./hooks/useEstudianteForm"
import DatosCompetidor from "./components/DatosCompetidor";
import DatosColegio from "./components/DatosColegio";
import AreasCompetencia from "./components/AreasCompetencia";
import TutorLegal from "./components/TutorLegal";
import TutorAcademico from "./components/TutorAcademico";

const EditarEstudianteModal = ({ estudiante, onClose, onSave, cursoAreaCategoria }) => {
  const {
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
  } = useEstudianteForm(estudiante);
  
  // Si no hay datos, no renderizar nada
  if (!estudianteData) return null;
  console.log(cursoAreaCategoria);

  // Obtener las áreas actuales
  const areasActuales = estudianteData.areas_competencia || [];
  
  // Guardar cambios
  const handleSave = () => {
    if (validarDatos()) {
      onSave(estudianteData);
    }
  };

  const areasCategorias = () => {
    const grado = estudianteData?.colegio?.curso;
    const datosPorGrado = cursoAreaCategoria[grado];
    const areasYcategorias = datosPorGrado?.areas || {};
    return areasYcategorias;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-5 w-full max-w-4xl shadow-xl my-4 mx-2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="text-xl font-semibold">Editar información del competidor</h3>
          
          <div className="flex items-center gap-4">
            
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div className="space-y-4">
            <DatosCompetidor 
              estudianteData={estudianteData}
              handleChange={handleChange}
              tieneError={tieneError}
              errores={errores}
            />
            
            {/* Solo mostrar si hay campos visibles en esta sección */}
              <DatosColegio 
                estudianteData={estudianteData}
              />
          </div>
          
          {/* Columna 2 */}
          <div className="space-y-4">
            {/* Áreas de competencia */}
              <AreasCompetencia 
                estudianteData={estudianteData}
                areasActuales={areasActuales}
                handleChange={handleChange}
                mostrarCampo={mostrarCampo}
                tieneError={tieneError}
                campoEditable={campoEditable}
                errores={errores}
                areasPorGrado={areasCategorias()}
              />
            
            {/* Tutor legal - solo en modo todos */}
              <TutorLegal 
                estudianteData={estudianteData}
                handleChange={handleChange}
                tieneError={tieneError}
                errores={errores}
                validarFormatoTelefono={validarFormatoTelefono}
              />
            
            {/* Tutor académico - solo en modo todos */}
            <TutorAcademico
              estudianteData={estudianteData}
              handleChange={handleChange}
              areaIndex={0}
              nombreArea={areasActuales[0].nombre_area}
              tieneError={tieneError}
              errores={errores}
              validarFormatoCI={validarFormatoCI}
              validarCorreo={validarCorreo}
            />
          </div>
        </div>
        
        <div className="flex justify-end border-t pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-3"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarEstudianteModal;