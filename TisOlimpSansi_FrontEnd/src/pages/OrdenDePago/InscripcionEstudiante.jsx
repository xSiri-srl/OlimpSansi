"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaUserAlt,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaSchool,
  FaBuilding,
  FaMapMarkedAlt,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";
import { useFormData } from "./form-data-context";
import { validateBirthDate } from "./utils/dateValidation";
import {
  TextField,
  SelectField,
  RadioGroupField,
  DateField,
} from "./components/FormComponents";

export default function InscripcionEstudiante({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();

  // Estados para manejar datos de colegios
  const [colegiosData, setColegiosData] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);
  const [distritosList, setDistritosList] = useState([]);
  const [colegiosFiltrados, setColegiosFiltrados] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [busquedaColegio, setBusquedaColegio] = useState("");
  const [esNuevoColegio, setEsNuevoColegio] = useState(false);

  const sugerenciasRef = useRef(null);

  // Detector de clics fuera del componente de sugerencias
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

  // Cargar datos de colegios al iniciar
  useEffect(() => {
    axios
      .post("http://localhost:8000/api/colegios/filtro", {})
      .then((res) => {
        setColegiosData(res.data);
        const departamentosUnicos = [
          ...new Set(res.data.map((c) => c.departamento)),
        ];
        setDepartamentosList(departamentosUnicos);
      })
      .catch((err) => console.error("Error al cargar colegios", err));
  }, []);

  // Filtrar distritos cuando cambia el departamento
  useEffect(() => {
    const distritos = colegiosData
      .filter(
        (c) => c.departamento === formData.estudiante?.departamentoSeleccionado
      )
      .map((c) => c.distrito);

    setDistritosList([...new Set(distritos)]);
  }, [formData.estudiante?.departamentoSeleccionado, colegiosData]);

  // Filtrar colegios cuando cambia el distrito
  useEffect(() => {
    const colegios = colegiosData
      .filter(
        (c) =>
          c.departamento === formData.estudiante?.departamentoSeleccionado &&
          c.distrito === formData.estudiante?.distrito
      )
      .map((c) => c.nombre_colegio);

    setColegiosFiltrados([...new Set(colegios)]);
  }, [
    formData.estudiante?.distrito,
    formData.estudiante?.departamentoSeleccionado,
    colegiosData,
  ]);

  // Actualizar sugerencias cuando cambia el texto de búsqueda
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

    // Si hay una coincidencia exacta o no hay coincidencias, actualizar el valor del colegio
    if (
      filtrados.length === 1 &&
      filtrados[0].toLowerCase() === texto.toLowerCase()
    ) {
      handleInputChange("estudiante", "colegio", filtrados[0]);
    } else if (filtrados.length === 0) {
      handleInputChange("estudiante", "colegio", texto);
    }
  };

  // Seleccionar una sugerencia
  const seleccionarSugerencia = (sugerencia) => {
    setBusquedaColegio(sugerencia);
    handleInputChange("estudiante", "colegio", sugerencia);
    setMostrarSugerencias(false);
    setEsNuevoColegio(false);
  };

  // Función para validar campos de entrada
  const validateInput = (value, fieldName, regex) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Campo obligatorio." }));
      return false;
    }

    if (regex && !regex.test(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Formato inválido." }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return true;
  };

  // Función para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(email, "correo", emailRegex);
  };

  // Manejador para enviar el formulario y avanzar
  const handleSubmitAndNext = () => {
    // Validar todos los campos
    const isApellidoPaternoValid = validateInput(
      formData.estudiante?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isApellidoMaternoValid = validateInput(
      formData.estudiante?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isNombresValid = validateInput(
      formData.estudiante?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isCIValid = validateInput(formData.estudiante?.ci, "ci", /^[0-9]*$/);

    const isFechaNacimientoValid = validateInput(
      formData.estudiante?.fechaNacimiento,
      "fechaNacimiento"
    );

    const isCorreoValid = validateEmail(formData.estudiante?.correo);

    const isCorreoPerteneceValid = validateInput(
      formData.estudiante?.correoPertenece,
      "correoPertenece"
    );

    const isColegioValid = validateInput(
      formData.estudiante?.colegio,
      "colegio",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isCursoValid = validateInput(formData.estudiante?.curso, "curso");

    const isDepartamentoValid = validateInput(
      formData.estudiante?.departamentoSeleccionado,
      "departamento"
    );

    const isDistritoValid = validateInput(
      formData.estudiante?.distrito,
      "distrito"
    );

    const fecha = formData.estudiante?.fechaNacimiento || "";
    const { valid: isFechaValida, error: fechaError } =
      validateBirthDate(fecha);
    if (!isFechaValida) {
      setErrors((prev) => ({ ...prev, fechaNacimiento: fechaError }));
    }

    // Si algún campo no es válido, detener el proceso
    if (
      !isApellidoPaternoValid ||
      !isApellidoMaternoValid ||
      !isNombresValid ||
      !isCIValid ||
      !isFechaNacimientoValid ||
      !isFechaValida ||
      !isCorreoValid ||
      !isCorreoPerteneceValid ||
      !isColegioValid ||
      !isCursoValid ||
      !isDepartamentoValid ||
      !isDistritoValid
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Actualizar datos en el objeto JSON global
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
          es_nuevo: esNuevoColegio,
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

  const cursos = [
    "3ro de Primaria",
    "4to de Primaria",
    "5to de Primaria",
    "6to de Primaria",
    "1ro de Secundaria",
    "2do de Secundaria",
    "3ro de Secundaria",
    "4to de Secundaria",
    "5to de Secundaria",
    "6to de Secundaria",
  ];

  const propietariosCorreo = ["Estudiante", "Padre/Madre", "Profesor"];

  // Calculadores para límites de fecha
  const getMinDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 20);
    return d.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 5);
    return d.toISOString().split("T")[0];
  };

  // Verificación para habilitar botón de siguiente
  const isFormValid =
    formData.estudiante?.nombres &&
    formData.estudiante?.ci &&
    formData.estudiante?.apellidoPaterno &&
    formData.estudiante?.apellidoMaterno &&
    formData.estudiante?.fechaNacimiento &&
    formData.estudiante?.correo &&
    formData.estudiante?.colegio &&
    formData.estudiante?.curso &&
    formData.estudiante?.departamentoSeleccionado &&
    formData.estudiante?.distrito &&
    formData.estudiante?.correoPertenece &&
    formData.estudiante?.ci.length >= 7 &&
    formData.estudiante?.nombres.length >= 2 &&
    formData.estudiante?.apellidoMaterno.length >= 2 &&
    formData.estudiante?.apellidoPaterno.length >= 2 &&
    formData.estudiante?.colegio.length >= 2 &&
    formData.estudiante?.nombres.split(" ").length <= 2 &&
    !isSubmitting;

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Columna 1: Datos Personales */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-500 self-center">
            Datos Personales
          </h2>
          <div className="space-y-4 w-full max-w-md">
            <TextField
              label="Apellido Paterno"
              icon={<FaUserAlt className="text-black" />}
              name="apellidoPaterno"
              placeholder="Apellido Paterno"
              value={formData.estudiante?.apellidoPaterno || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "apellidoPaterno", value)
              }
              error={errors.apellidoPaterno}
              maxLength="15"
              regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
              transform={(value) => value.toUpperCase()}
            />

            <TextField
              label="Apellido Materno"
              icon={<FaUserAlt className="text-black" />}
              name="apellidoMaterno"
              placeholder="Apellido Materno"
              value={formData.estudiante?.apellidoMaterno || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "apellidoMaterno", value)
              }
              error={errors.apellidoMaterno}
              maxLength="15"
              regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
              transform={(value) => value.toUpperCase()}
            />

            <TextField
              label="Nombres"
              icon={<FaUserAlt className="text-black" />}
              name="nombres"
              placeholder="Nombres"
              value={formData.estudiante?.nombres || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "nombres", value)
              }
              error={errors.nombres}
              maxLength="30"
              regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/}
              transform={(value) => value.toUpperCase()}
            />

            <TextField
              label="Carnet de Identidad"
              icon={<FaIdCard className="text-black" />}
              name="ci"
              placeholder="Número de Carnet de Identidad"
              value={formData.estudiante?.ci || ""}
              onChange={(value) => handleInputChange("estudiante", "ci", value)}
              error={errors.ci}
              maxLength="8"
              regex={/^[0-9]*$/}
            />

            <DateField
              label="Fecha de Nacimiento"
              icon={<FaCalendarAlt className="text-black" />}
              name="fechaNacimiento"
              value={formData.estudiante?.fechaNacimiento || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "fechaNacimiento", value)
              }
              error={errors.fechaNacimiento}
              min={getMinDate()}
              max={getMaxDate()}
            />

            <TextField
              label="Correo Electrónico"
              icon={<FaEnvelope className="text-black" />}
              name="correo"
              type="email"
              placeholder="Correo Electrónico"
              value={formData.estudiante?.correo || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "correo", value)
              }
              error={errors.correo}
            />

            <RadioGroupField
              label="El correo electrónico pertenece a:"
              name="correoPertenece"
              options={propietariosCorreo}
              value={formData.estudiante?.correoPertenece || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "correoPertenece", value)
              }
              error={errors.correoPertenece}
            />
          </div>
        </div>

        {/* Columna 2: Datos del Colegio */}
        <div className="flex flex-col items-center bg-gray-300 p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 self-center">
            Datos de la Unidad Educativa
          </h3>
          <div className="space-y-4 w-full max-w-md">
            {/* Departamento - Usando nuestro componente SelectField */}
            <SelectField
              label="Departamento"
              icon={<FaMapMarkedAlt className="text-black" />}
              name="departamentoSeleccionado"
              value={formData.estudiante?.departamentoSeleccionado || ""}
              onChange={(value) => {
                handleInputChange(
                  "estudiante",
                  "departamentoSeleccionado",
                  value
                );
                handleInputChange("estudiante", "distrito", "");
                handleInputChange("estudiante", "colegio", "");
                setBusquedaColegio("");
              }}
              options={departamentosList}
              error={errors.departamento}
              placeholder="Seleccione un Departamento"
            />

            {/* Distrito - Usando nuestro componente SelectField */}
            <SelectField
              label="Distrito"
              icon={<FaMapMarkedAlt className="text-black" />}
              name="distrito"
              value={formData.estudiante?.distrito || ""}
              onChange={(value) => {
                handleInputChange("estudiante", "distrito", value);
                handleInputChange("estudiante", "colegio", "");
                setBusquedaColegio("");
              }}
              options={distritosList}
              error={errors.distrito}
              placeholder="Seleccione un Distrito"
              disabled={!formData.estudiante?.departamentoSeleccionado}
            />

            {/* Componente de Autocompletado para colegios */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <FaSchool className="text-black" />
                <label>Unidad Educativa</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ingresar nombre de la unidad educativa"
                  value={busquedaColegio}
                  onChange={(e) => actualizarSugerencias(e.target.value)}
                  onFocus={() => {
                    if (busquedaColegio.length >= 2)
                      setMostrarSugerencias(true);
                  }}
                  disabled={!formData.estudiante?.distrito}
                />
                {busquedaColegio && (
                  <FaTimesCircle
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => {
                      setBusquedaColegio("");
                      handleInputChange("estudiante", "colegio", "");
                      setMostrarSugerencias(false);
                    }}
                  />
                )}

                {/* Sugerencias */}
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

            <SelectField
              label="Curso"
              icon={<FaBuilding className="text-black" />}
              name="curso"
              value={formData.estudiante?.curso || ""}
              onChange={(value) =>
                handleInputChange("estudiante", "curso", value)
              }
              options={cursos}
              error={errors.curso}
              placeholder="Seleccione un Curso"
            />
          </div>
        </div>
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
          disabled={!isFormValid}
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
            isFormValid
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
