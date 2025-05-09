import React, { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
const CrearOlimpiadas = () => {
  const [titulo, setTitulo] = useState("");
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [periodoIns, setPeriodoIns] = useState("");
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const endpoint = "http://localhost:8000";
  const years = Array.from({ length: 2030 - 2025 + 1 }, (_, i) => 2025 + i);

  const validarCampos = () => {
    const hoy = new Date();
    const ini = new Date(fechaIni);
    const fin = new Date(fechaFinal);
    const nuevosErrores = {};

    if (!titulo.trim()) nuevosErrores.titulo = "El título no puede estar vacío";
    if (!periodoIns) nuevosErrores.periodoIns = "Debe seleccionar un período";
    if (!fechaIni) nuevosErrores.fechaIni = "Debe ingresar la fecha de inicio";
    else if (ini < hoy.setHours(0, 0, 0, 0))
      nuevosErrores.fechaIni = "La fecha de inicio no puede ser anterior";

    if (!fechaFinal) nuevosErrores.fechaFinal = "Debe ingresar la fecha final";
    else if (fechaIni && fin <= ini)
      nuevosErrores.fechaFinal = "La fecha final debe ser posterior a la fecha de inicio";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleCrear = () => {
    if (validarCampos()) {
      setShowConfirmModal(true);
    }
  };


    const confirmarCreacion = async () => {
      setShowConfirmModal(false);
      setLoading(true);

      try {
       
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
          withCredentials: true,
        });

   
        const csrfToken = Cookies.get('XSRF-TOKEN');
        axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;

       
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.user?.id;

        const olimpiadaData = {
          id_user: userId,
          titulo,
          fecha_ini: fechaIni,
          fecha_fin: fechaFinal,
        };

        const response = await axios.post(
          'http://localhost:8000/agregarOlimpiada',
          olimpiadaData,
          { withCredentials: true }
        );

        // Éxito
        setShowSuccessModal(true);
        setErrorMessage("");
        setTitulo("");
        setPeriodoIns("");
        setFechaIni("");
        setFechaFinal("");
      } catch (error) {
          const mensaje = error.response?.data?.error ||  
                          error.response?.data?.message || 
                          error.message || 
                          "Error desconocido";

          setErrorMessage(mensaje);
          setShowSuccessModal(true);
          console.error("Error al crear olimpiada:", mensaje);

      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="p-10 relative">
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-12 text-cyan-900">
          CREAR OLIMPIADA
        </h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={50}
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
              placeholder="Ej. Olimpiada 2025"
            />
            {errores.titulo && <p className="text-red-600 text-sm mt-1">{errores.titulo}</p>}
          </div>

          {/* Período de inscripción */}
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">Período de inscripción</label>
            <select
              value={periodoIns}
              onChange={(e) => setPeriodoIns(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
            >
              <option value="">Seleccione el periodo</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errores.periodoIns && <p className="text-red-600 text-sm mt-1">{errores.periodoIns}</p>}
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">Fecha de inicio</label>
            <input
              type="date"
              value={fechaIni}
              onChange={(e) => setFechaIni(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
            />
            {errores.fechaIni && <p className="text-red-600 text-sm mt-1">{errores.fechaIni}</p>}
          </div>

          {/* Fecha final */}
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">Fecha final</label>
            <input
              type="date"
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
            />
            {errores.fechaFinal && <p className="text-red-600 text-sm mt-1">{errores.fechaFinal}</p>}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleCrear}
            disabled={loading}
            className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
              !loading
                ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Creando..." : "Crear Olimpiada"}
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">¿Estás seguro?</h2>
            <p className="text-gray-700 mb-6">¿Deseas crear esta convocatoria?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmarCreacion}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sí, crear
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            {errorMessage ? (
              <>
                <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
                <p className="text-gray-700 mb-6">{errorMessage}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-green-700 mb-4">¡Éxito!</h2>
                <p className="text-gray-700 mb-6">La olimpiada fue creada correctamente.</p>
              </>
            )}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setErrorMessage("");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Creando olimpiada</h2>
            <p className="text-gray-700">Espere un momento por favor...</p>
          </div>
        </div>
      )}    
    </div>
  );
};

export default CrearOlimpiadas;
