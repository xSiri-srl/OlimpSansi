import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { useFormData  } from "./form-data-context";
import ModalPeriodo from "../../../components/Modales/ModalPeriodo";
import { API_URL } from "../../../utils/api";
import { estaEnPeriodo } from "../../../utils/estaEnPeriodo";
import axios from "axios"

export default function FormularioEstudiante() {
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useFormData();
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [cargandoOlimpiadas, setCargandoOlimpiadas] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [showPeriodoModal, setShowPeriodoModal] = useState(false);
  const [olimpiadaSeleccionadaInfo, setOlimpiadaSeleccionadaInfo] = useState({
    fechaIni: "",
    fechaFin: ""
  });

  useEffect(() => {
    if (globalData?.olimpiada?.id) {
      setOlimpiadaSeleccionada(globalData.olimpiada.id.toString());
      setNombreOlimpiada(globalData.olimpiada.titulo || "");
    }
  }, [globalData]);

  const handleSeleccion = async () => {
    console.log(olimpiadaSeleccionada)
        
    try {
      
        const response = await axios.get(`${API_URL}/api/curso-area-categoria-por-olimpiada?id=${olimpiadaSeleccionada}`);
        const gradoAreaCurso = response.data;
          
        if (!gradoAreaCurso || gradoAreaCurso.length === 0) {
          throw new Error("No se encontraron datos de grado, área y curso.");
        }
      

      setGlobalData(prevState => ({
        ...prevState,
        olimpiada: {
          id: parseInt(olimpiadaSeleccionada),
          titulo: nombreOlimpiada
        },
        gradoAreaCurso
      }));
console.log(gradoAreaCurso),
      navigate("/inscripcion/responsable", {
        
        state: { 
          id: olimpiadaSeleccionada,
          gradoAreaCurso 
        }
      });

    } catch (err) {
      console.error("Error al obtener los datos de la olimpiada:", err);
      alert("Ocurrió un error al cargar los datos de la olimpiada: " + err.message);
    }
  };

  const handleSeleccionLista = () => {
    setGlobalData(prevState => ({
      ...prevState,
      olimpiada: {
        id: parseInt(olimpiadaSeleccionada),
        titulo: nombreOlimpiada
      }
    }));
    
    navigate(`/inscripcion-lista/tutorial`, {
      state: { id: olimpiadaSeleccionada }
    });
  };

  // Remover la función estaEnPeriodo local ya que está en utils

  const handleOlimpiadaChange = (e) => {
    const idSeleccionado = e.target.value;
    
    if (idSeleccionado) {
      const olimpiadaInfo = olimpiadas.find(
        (o) => o.id.toString() === idSeleccionado
      );
      
      if (olimpiadaInfo) {
        if (estaEnPeriodo(olimpiadaInfo.fecha_ini, olimpiadaInfo.fecha_fin)) {
          setOlimpiadaSeleccionada(idSeleccionado);
          setNombreOlimpiada(olimpiadaInfo.titulo);
        } else {
          setOlimpiadaSeleccionadaInfo({
            fechaIni: olimpiadaInfo.fecha_ini + "T00:00:00-04:00",
            fechaFin: olimpiadaInfo.fecha_fin + "T23:59:59-04:00"
          });
          setShowPeriodoModal(true);
          setOlimpiadaSeleccionada("");
          setNombreOlimpiada("");
        }
      }
    } else {
      setOlimpiadaSeleccionada("");
      setNombreOlimpiada("");
    }
  };

  useEffect(() => {
    const cargarOlimpiadas = async () => {
      setCargandoOlimpiadas(true);
      setErrorCarga("");
      
      try {
        const response = await axios.get(`${API_URL}/olimpiadas-publicas-completas`);
        
        if (response.status === 200) {
          setOlimpiadas(response.data.data || []);
        } else {
          throw new Error("No se pudieron cargar las olimpiadas");
        }
      } catch (error) {
        console.error("Error al cargar olimpiadas:", error);
        setErrorCarga("Error al cargar las olimpiadas. Por favor, intente nuevamente.");
      } finally {
        setCargandoOlimpiadas(false);
      }
    };
  
    cargarOlimpiadas();
  }, []);

  return (
    <div className="p-10 flex flex-col items-center justify-center from-indigo-100 to-purple-200">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">  
        Registro a Olimpiada
      </h2>

      {/* Selector de Olimpiada */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="olimpiada">
              Seleccionar Olimpiada
            </label>
            <select
              id="olimpiada"
              className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={olimpiadaSeleccionada}
              onChange={handleOlimpiadaChange}
              disabled={cargandoOlimpiadas}
            >
              <option value="">Seleccionar...</option>
              {olimpiadas.map((olimpiada) => (
                <option key={olimpiada.id} value={olimpiada.id}>
                  {olimpiada.titulo}
                </option>
              ))}
            </select>
          </div>
          
          {nombreOlimpiada && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
              <h3 className="text-sm text-blue-500 font-semibold">Olimpiada Seleccionada</h3>
              <p className="text-xl font-bold text-blue-800">{nombreOlimpiada}</p>
            </div>
          )}
        </div>

        {cargandoOlimpiadas && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {errorCarga && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mt-4 text-center">
            {errorCarga}
          </div>
        )}
      </div>

      {/* Opciones de inscripción (solo visibles cuando una olimpiada está seleccionada) */}
      {olimpiadaSeleccionada && (
        <>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-8 text-center w-full max-w-2xl">
            <p className="text-green-700">
              Seleccione el método de inscripción para la olimpiada
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-16">
            {/* Opción Individual */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer group"
              onClick={handleSeleccion}
            >
              <div className="bg-gradient-to-r shadow-lg rounded-xl p-8 w-56 h-56 flex items-center justify-center transition-all group-hover:bg-indigo-200">
                <FaUserAlt size={100} className="text-indigo-600 group-hover:text-indigo-800 transition-all" />
              </div>
              <span className="font-mono mt-4 text-2xl font-semibold text-gray-600 group-hover:text-indigo-700">
                Individual
              </span>
            </motion.div>

            {/* Opción Lista */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer group"
              onClick={handleSeleccionLista}
            >
              <div className="bg-gradient-to-r shadow-lg rounded-xl p-8 w-56 h-56 flex items-center justify-center transition-all group-hover:bg-purple-200">
                <FaUsers size={100} className="text-purple-600 group-hover:text-purple-800 transition-all" />
              </div>
              <span className="font-mono mt-4 text-2xl font-semibold text-gray-600 group-hover:text-purple-700">
                Por U.E.
              </span>
            </motion.div>
          </div>
        </>
      )}

      {!olimpiadaSeleccionada && !cargandoOlimpiadas && !errorCarga && olimpiadas.length > 0 && (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-700">
            Por favor, seleccione una olimpiada para continuar con la inscripción
          </p>
        </div>
      )}

      {!cargandoOlimpiadas && !errorCarga && olimpiadas.length === 0 && (
        <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-lg text-center w-full max-w-2xl">
          <p className="text-orange-700">
            No hay olimpiadas disponibles en este momento. Las olimpiadas deben estar completamente configuradas para aparecer aquí.
          </p>
          <p className="text-orange-600 text-sm mt-2">
            Una olimpiada debe tener: áreas de competencia asignadas, costos definidos y límite de inscripciones establecido.
          </p>
        </div>
      )}

      <ModalPeriodo
        isOpen={showPeriodoModal}
        onClose={() => setShowPeriodoModal(false)}
        fechaIni={olimpiadaSeleccionadaInfo.fechaIni}
        fechaFin={olimpiadaSeleccionadaInfo.fechaFin}
      />
    </div>
  );
}