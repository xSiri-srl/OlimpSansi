import { useState, useEffect, useRef } from "react";
import { FaSchool, FaMapMarkedAlt, FaTimesCircle } from "react-icons/fa";
import { useFormData } from "./form-context";
import axios from "axios";
import { API_URL } from "../../../utils/api";

function RegistroColegio({ setStep }) {
  const [formData, setFormData] = useState({
    colegio: {
      Departamento: "",
      Distrito: "",
      nombre_colegio: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { globalData, setGlobalData } = useFormData();
  const [colegiosData, setColegiosData] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);
  const [colegiosFiltrados, setColegiosFiltrados] = useState([]);
  const [busquedaColegio, setBusquedaColegio] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [esNuevoColegio, setEsNuevoColegio] = useState(false);
  const sugerenciasRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sugerenciasRef.current &&
        !sugerenciasRef.current.contains(event.target)
      ) {
        setMostrarSugerencias(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios.post(`${API_URL}/api/colegios/filtro`, {}).then((res) => {
      setColegiosData(res.data);
      const departamentosUnicos = [
        ...new Set(res.data.map((c) => c.departamento)),
      ];
      setDepartamentosList(departamentosUnicos);
    });
  }, []);

  useEffect(() => {
    if (globalData.colegio) {
      const resp = globalData.colegio;
      setFormData({
        colegio: {
          departamento: resp.departamento || "",
          distrito: resp.distrito || "",
          nombre_colegio: resp.nombre_colegio || "",
        },
      });
      setBusquedaColegio(resp.nombre_colegio || "");
    }
  }, [globalData]);

  useEffect(() => {
    const distritos = colegiosData
      .filter((c) => c.departamento === formData.colegio.departamento)
      .map((c) => c.distrito);

    setDistritosList([...new Set(distritos)]);
  }, [formData.colegio.departamento, colegiosData]);

  useEffect(() => {
    const colegios = colegiosData
      .filter(
        (c) =>
          c.departamento === formData.colegio.departamento &&
          c.distrito === formData.colegio.distrito
      )
      .map((c) => c.nombre_colegio);

    setColegiosFiltrados([...new Set(colegios)]);
  }, [formData.colegio.distrito, formData.colegio.departamento, colegiosData]);

  const actualizarSugerencias = (texto) => {
    setBusquedaColegio(texto);

    if (!texto || texto.length < 2) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const filtrados = colegiosFiltrados.filter((colegio) =>
      colegio.toLowerCase().includes(texto.toLowerCase())
    );

    setSugerencias(filtrados);
    setMostrarSugerencias(true);
    setEsNuevoColegio(filtrados.length === 0);

    if (
      filtrados.length === 1 &&
      filtrados[0].toLowerCase() === texto.toLowerCase()
    ) {
      handleInputChange("colegio", "nombre_colegio", filtrados[0]);
    } else if (filtrados.length === 0) {
      handleInputChange("colegio", "nombre_colegio", texto);
    }
  };

  const seleccionarSugerencia = (sugerencia) => {
    setBusquedaColegio(sugerencia);
    handleInputChange("colegio", "nombre_colegio", sugerencia);
    setMostrarSugerencias(false);
    setEsNuevoColegio(false);
  };

  const handleInputChange = (grupo, campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [campo]: valor,
      },
    }));
  };

  const handleNext = () => setStep(3);

  const handleSubmitAndNext = () => {
    const newErrors = {};

    if (!formData.colegio.departamento) {
      newErrors.departamento = "Debe seleccionar un departamento";
    }

    if (!formData.colegio.distrito) {
      newErrors.distrito = "Debe seleccionar un distrito";
    }

    if (
      !formData.colegio.nombre_colegio ||
      formData.colegio.nombre_colegio.trim() === ""
    ) {
      newErrors.colegio = "Debe seleccionar o escribir el nombre del colegio";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        setGlobalData((prevData) => ({
          ...prevData,
          colegio: {
            ...formData.colegio,
            es_nuevo: esNuevoColegio,
          },
        }));
        handleNext();
      } catch (error) {
        setErrors({ general: "Hubo un error al procesar los datos." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-500">
            Registro de la Unidad Educativa
          </h2>
          <p className="text-sm text-gray-600">
            Estos datos corresponden al colegio del estudiante.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <FaMapMarkedAlt className="text-black" /> Departamento
            </label>
            <select
              name="departamento"
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.colegio.departamento || ""}
              onChange={(e) => {
                handleInputChange("colegio", "departamento", e.target.value);
                handleInputChange("colegio", "distrito", "");
                handleInputChange("colegio", "nombre_colegio", "");
                setBusquedaColegio("");
              }}
            >
              <option value="">Seleccione un Departamento</option>
              {departamentosList.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>

            {errors.departamento && (
              <p className="text-red-500 text-sm mt-1">{errors.departamento}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <FaMapMarkedAlt className="text-black" /> Distrito
            </label>
            <select
              name="distrito"
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.colegio.distrito || ""}
              onChange={(e) => {
                handleInputChange("colegio", "distrito", e.target.value);
                handleInputChange("colegio", "nombre_colegio", "");
                setBusquedaColegio("");
              }}
              disabled={!formData.colegio.departamento}
            >
              <option value="">Seleccione un Distrito</option>
              {distritosList.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>

            {errors.distrito && (
              <p className="text-red-500 text-sm mt-1">{errors.distrito}</p>
            )}
          </div>

          <div className="relative">
            <label className="flex items-center gap-2">
              <FaSchool className="text-black" /> Unidad Educativa
            </label>

            <div className="relative">
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ingresar nombre de la unidad educativa"
                value={busquedaColegio}
                onChange={(e) => actualizarSugerencias(e.target.value)}
                onFocus={() => {
                  if (busquedaColegio.length >= 2) setMostrarSugerencias(true);
                }}
                disabled={!formData.colegio.distrito}
              />

              {busquedaColegio && (
                <FaTimesCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setBusquedaColegio("");
                    handleInputChange("colegio", "nombre_colegio", "");
                    setMostrarSugerencias(false);
                  }}
                />
              )}

              {mostrarSugerencias && (
                <div
                  ref={sugerenciasRef}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
                >
                  {sugerencias.length > 0 ? (
                    sugerencias.map((sugerencia, idx) => (
                      <div
                        key={idx}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => seleccionarSugerencia(sugerencia)}
                      >
                        {sugerencia}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      No se encontro ninguna coincidencia, puede registrar una
                      nueva unidad educativa.
                    </div>
                  )}
                </div>
              )}
            </div>

            {esNuevoColegio && busquedaColegio.length >= 2 && (
              <p className="text-blue-500 text-sm mt-1">
                Se registrará una nueva unidad educativa con este nombre.
              </p>
            )}

            {errors.colegio && (
              <p className="text-red-500 text-sm mt-1">{errors.colegio}</p>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmitAndNext}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ml-4"
            >
              {isSubmitting ? "Guardando..." : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroColegio;
