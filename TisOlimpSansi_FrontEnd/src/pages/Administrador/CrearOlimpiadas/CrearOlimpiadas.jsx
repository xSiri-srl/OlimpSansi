import React, { useState } from "react";

import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { API_URL } from "../../../utils/api";

// Importar el nuevo modal
import ModalTareasPendientes from "./Modales/ModalTareasPendientes";

const CrearOlimpiadas = () => {
  const [titulo, setTitulo] = useState("");
  const navigate = useNavigate();
  const [fechaIniDate, setFechaIniDate] = useState(null);
  const [fechaFinalDate, setFechaFinalDate] = useState(null);
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [periodoIns, setPeriodoIns] = useState("");
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTareasModal, setShowTareasModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [olimpiadaCreada, setOlimpiadaCreada] = useState(null);
  
  const years = Array.from({ length: 2030 - 2025 + 1 }, (_, i) => 2025 + i);

  const validarCampos = () => {
    // Convertir la fecha actual a string en formato YYYY-MM-DD
    const hoy = new Date();
    const hoyString = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    // fechaIni ya está en formato YYYY-MM-DD del input type="date"
    const nuevosErrores = {};

    if (!titulo.trim()) nuevosErrores.titulo = "El título no puede estar vacío";
    if (!periodoIns) nuevosErrores.periodoIns = "Debe seleccionar un año de gestión";
    if (!fechaIni) nuevosErrores.fechaIni = "Debe ingresar la fecha de inicio";
    
    // Comparación directa de strings en formato YYYY-MM-DD
    else if (fechaIni < hoyString) 
      nuevosErrores.fechaIni = "La fecha de inicio no puede ser anterior a hoy";

    if (!fechaFinal) nuevosErrores.fechaFinal = "Debe ingresar la fecha final";
    else if (fechaIni && fechaFinal <= fechaIni)
      nuevosErrores.fechaFinal = "La fecha final debe ser posterior a la fecha de inicio";

    if (periodoIns && fechaIni) {
      const gestionNum = parseInt(periodoIns, 10);
      const yIni = new Date(fechaIni).getFullYear();
      if (gestionNum !== yIni) {
        nuevosErrores.periodoIns = "La gestión debe coincidir con el año de inicio de inscripciones";
      }
    }
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
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const csrfToken = Cookies.get("XSRF-TOKEN");
      axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;

      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.user?.id;

      const olimpiadaData = {
        id_user: userId,
        titulo,
        fecha_ini: fechaIni,
        fecha_fin: fechaFinal,
      };

      const response = await axios.post(
        `${API_URL}/agregar-olimpiada`,
        olimpiadaData,
        { withCredentials: true }
      );

      const olimpiadaId = response.data.id || response.data.data?.id;
      setOlimpiadaCreada(olimpiadaId);

      
      setShowSuccessModal(true);
      setErrorMessage("");

      setTitulo("");
      setPeriodoIns("");
      setFechaIni("");
      setFechaFinal("");
      setFechaIniDate(null);
      setFechaFinalDate(null);

      setTimeout(() => {
        setShowSuccessModal(false);
        setShowTareasModal(true);
      }, 1500);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        setErrorMessage(error.response.data.message);
        setShowSuccessModal(true);
      } else {
        setErrorMessage("Error inesperado al crear la olimpiada.");
        setShowSuccessModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurarAhora = () => {
    setShowTareasModal(false);
  };

  const handleConfigurarMasTarde = () => {
    setShowTareasModal(false);
    navigate("/"); 
  };

  return (
    <div className="p-10 mb-6 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Crear Olimpiada
      </h2>
      <div className="max-w-4xl mx-auto bg-gray-200 p-7 shadow-lg rounded-lg">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={50}
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
              placeholder="Ej. Olimpiada 2025"
            />
            {errores.titulo && (
              <p className="text-red-600 text-sm mt-1">{errores.titulo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Gestión
            </label>
            <select
              value={periodoIns}
              onChange={(e) => setPeriodoIns(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
            >
              <option value="">Seleccione la gestión</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errores.periodoIns && (
              <p className="text-red-600 text-sm mt-1">{errores.periodoIns}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Inicio de inscripciones
            </label>
            <DatePicker
              selected={fechaIniDate}
              onChange={(date) => {
                setFechaIniDate(date);
                setFechaIni(date.toISOString().split("T")[0]);
              }}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              wrapperClassName="w-full"  
              className="w-full border rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2"
            />
            {errores.fechaIni && (
              <p className="text-red-600 text-sm mt-1">{errores.fechaIni}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-800 mb-1">
              Fin de inscripciones
            </label>
            <DatePicker
              selected={fechaFinalDate}
              onChange={(date) => {
                setFechaFinalDate(date);
                setFechaFinal(date.toISOString().split("T")[0]);
              }}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              wrapperClassName="w-full"  
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
            />

            {errores.fechaFinal && (
              <p className="text-red-600 text-sm mt-1">{errores.fechaFinal}</p>
            )}
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

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-5xl animate-pulse" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              ¿Estás seguro?
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Esta acción creará una nueva convocatoria. ¿Deseas continuar?
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={confirmarCreacion}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
              >
                <FaCheckCircle className="text-lg" />
                Sí, crear
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-xl drop-shadow-lg transition duration-300"
              >
                <FaTimesCircle className="text-lg" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            {errorMessage ? (
              <>
                <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
                <p className="text-gray-700 mb-6">{errorMessage}</p>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setErrorMessage("");
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-green-700 mb-4">
                  ¡Éxito!
                </h2>
                <p className="text-gray-700 mb-6">
                  La olimpiada fue creada correctamente.
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full animate-[progress_1.5s_ease-in-out]"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ModalTareasPendientes
        isOpen={showTareasModal}
        onClose={handleConfigurarMasTarde}
        onContinue={handleConfigurarAhora}
        nombreOlimpiada={titulo}
        olimpiadaId={olimpiadaCreada}
        esPrimeraVez={true}
      />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Creando olimpiada
            </h2>
            <p className="text-gray-700">Espere un momento por favor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearOlimpiadas;