"use client";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import FormularioCodigo from "./components/FormularioCodigo";
import TablaEstudiantes from "./components/TablaEstudiantes";
import PanelAcciones from "./components/PanelAcciones";
import EditarEstudianteModal from "./Modales/EditarEstudianteModal";
import ModalPeriodo from "./Modales/ModalPeriodo";
import useCodigoPreInscripcion from "./hooks/useCodigoPreInscripcion";

const CodigoPreInscripcion = () => {
  const navigate = useNavigate();
  const {
    codigoPreInscripcion,
    setCodigoPreInscripcion,
    error,
    setError,
    setResumen,
    loading,
    savingChanges,
    estudiantes,
    setEstudiantes,
    cursoAreaCategoria,
    processedEstudiantes,
    setProcessedEstudiantes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    showPeriodoModal,
    setShowPeriodoModal,
    olimpiadaSeleccionadaInfo,
    showModal,
    modalContent,
    selectedStudent,
    verificarCodigo,
    filteredEstudiantes,
    totalPages,
    handleStudentClick,
    handleCloseModal,
    handleCloseModal2,
    handleSaveEdit,
    guardarTodosLosCambios,
    paginate,
    totalErrors,
    nuevosErrores,
  } = useCodigoPreInscripcion();

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
        <div className="relative w-full max-w-2xl mx-auto my-6">
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-gray-600 hover:text-gray-900 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="relative p-6 flex-auto">{children}</div>
            <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
              <button
                className="text-gray-500 background-transparent font-medium px-4 py-2 text-sm rounded hover:bg-gray-100 mr-2"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-gray-200 p-9 shadow-lg rounded-lg">
        <FormularioCodigo
          codigoPreInscripcion={codigoPreInscripcion}
          setCodigoPreInscripcion={setCodigoPreInscripcion}
          error={error}
          loading={loading}
          verificarCodigo={verificarCodigo}
          setResumen={setResumen}
          setError={setError}
          setEstudiantes={setEstudiantes}
          setProcessedEstudiantes={setProcessedEstudiantes}
        />
        {processedEstudiantes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Lista de Competidores
            </h2>
            <TablaEstudiantes
              processedEstudiantes={processedEstudiantes}
              totalErrors={totalErrors}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filter={filter}
              setFilter={setFilter}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              filteredEstudiantes={filteredEstudiantes}
              totalPages={totalPages}
              handleStudentClick={handleStudentClick}
              paginate={paginate}
            />
            <PanelAcciones
              totalErrors={totalErrors}
              savingChanges={savingChanges}
              guardarTodosLosCambios={guardarTodosLosCambios}
            />
          </div>
        )}
      </div>
      {showModal && selectedStudent && modalContent.type !== "success" && (
        <EditarEstudianteModal
          estudiante={selectedStudent}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
          cursoAreaCategoria={cursoAreaCategoria}
          estudiantes={estudiantes}
          onEstudiantesChange={setEstudiantes}
          nuevosErrores={nuevosErrores}
        />
      )}
      {showModal && modalContent.type === "success" && (
        <Modal
          show={true}
          onClose={handleCloseModal2}
          title={modalContent.title}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FaSave className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {modalContent.title}
            </h3>
            <p className="text-sm text-gray-500">{modalContent.content}</p>
          </div>
        </Modal>
      )}
      <ModalPeriodo
        isOpen={showPeriodoModal}
        onClose={() => setShowPeriodoModal(false)}
        fechaIni={olimpiadaSeleccionadaInfo.fechaIni}
        fechaFin={olimpiadaSeleccionadaInfo.fechaFin}
      />
    </div>
  );
};

export default CodigoPreInscripcion;
