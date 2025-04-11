"use client";

import { useState } from "react";
import {
  FaUserAlt,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaSchool,
  FaBuilding,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useFormData } from "./form-data-context";

export default function InscripcionEstudiante({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalData, setGlobalData } = useFormData();

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

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(email, "correo", emailRegex);
  };

  const handleValidatedChange = (namespace, field, value, regex) => {
    if (value.startsWith(" ")) return;
    if (regex.test(value) || value === "") {
      handleInputChange(namespace, field, value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmitAndNext = () => {
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

    const isProvinciaValid = validateInput(
      formData.estudiante?.provincia,
      "provincia"
    );

    if (
      !isApellidoPaternoValid ||
      !isApellidoMaternoValid ||
      !isNombresValid ||
      !isCIValid ||
      !isFechaNacimientoValid ||
      !isCorreoValid ||
      !isCorreoPerteneceValid ||
      !isColegioValid ||
      !isCursoValid ||
      !isDepartamentoValid ||
      !isProvinciaValid
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
          provincia: formData.estudiante?.provincia,
          curso: formData.estudiante?.curso,
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

  const departamentos = {
    "La Paz": ["Murillo", "Pacajes", "Los Andes", "Larecaja", "Ingavi"],
    Cochabamba: ["Cercado", "Quillacollo", "Chapare", "Arani", "Ayopaya"],
    "Santa Cruz": ["Andrés Ibáñez", "Warnes", "Ichilo", "Sara", "Vallegrande"],
    Oruro: ["Cercado", "Sajama", "Sabaya", "Litoral", "Pantaleón Dalence"],
    Potosí: [
      "Tomás Frías",
      "Charcas",
      "Chayanta",
      "Nor Chichas",
      "Sur Chichas",
    ],
    Chuquisaca: [
      "Oropeza",
      "Zudáñez",
      "Tomina",
      "Belisario Boeto",
      "Nor Cinti",
    ],
    Tarija: ["Cercado", "Gran Chaco", "O'Connor", "Avilés", "Arce"],
    Beni: ["Cercado", "Moxos", "Vaca Díez", "Marbán", "Yacuma"],
    Pando: [
      "Madre de Dios",
      "Manuripi",
      "Nicolás Suárez",
      "Abuná",
      "Federico Román",
    ],
  };

  const curso = [
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

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Columna 1: Datos Personales */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-500 self-center">
            Datos Personales
          </h2>
          <div className="space-y-4 w-full max-w-md">
            <div>
              <label className="flex items-center gap-2">
                <FaUserAlt className="text-black" /> Apellido Paterno
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Apellido Paterno"
                value={formData.estudiante?.apellidoPaterno || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "estudiante",
                    "apellidoPaterno",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                  )
                }
                maxLength="15"
              />
              {errors.apellidoPaterno && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidoPaterno}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaUserAlt className="text-black" /> Apellido Materno
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Apellido Materno"
                value={formData.estudiante?.apellidoMaterno || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "estudiante",
                    "apellidoMaterno",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
                  )
                }
                maxLength="15"
              />
              {errors.apellidoMaterno && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidoMaterno}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaUserAlt className="text-black" /> Nombres
              </label>
              <input
                type="text"
                name="nombre"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Nombres"
                value={formData.estudiante?.nombres || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "estudiante",
                    "nombres",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                  )
                }
                maxLength="30"
              />
              {errors.nombres && (
                <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
              )}
            </div>

              <div>
                <label className="flex items-center gap-2">
            <FaIdCard className="text-black" /> Carnet de Identidad
                </label>
                <input
            type="text"
            name="ci"
            className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Número de Carnet de Identidad"
            value={formData.estudiante?.ci || ""}
            onChange={(e) =>
              handleValidatedChange(
                "estudiante",
                "ci",
                e.target.value,
                /^[0-9]*$/
              )
            }
            maxLength="8"
                />
                {errors.ci && (
            <p className="text-red-500 text-sm mt-1">{errors.ci}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
            <FaCalendarAlt className="text-black" /> Fecha de Nacimiento
                </label>
                <input
            type="date"
            name="fechaNacimiento"
            className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.estudiante?.fechaNacimiento || ""}
            min={(() => {
              const d = new Date();
              d.setFullYear(d.getFullYear() - 20);
              return d.toISOString().split('T')[0];
            })()}
            max={(() => {
              const d = new Date();
              d.setFullYear(d.getFullYear() - 3);
              return d.toISOString().split('T')[0];
            })()}
            onChange={(e) =>
              handleInputChange(
                "estudiante",
                "fechaNacimiento",
                e.target.value
              )
            }
                />
                {errors.fechaNacimiento && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fechaNacimiento}
            </p>
                )}
              </div>
            <div>
              <label className="flex items-center gap-2">
                <FaEnvelope className="text-black" /> Correo Electrónico
              </label>
                <input
            type="email"
            name="correo"
            className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Correo Electrónico"
            value={formData.estudiante?.correo || ""}
            onChange={(e) =>
              handleInputChange("estudiante", "correo", e.target.value)
            }
                />
                {errors.correo && (
            <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mt-2">
            El correo electrónico pertenece a:
                </p>
                <div className="flex flex-row space-x-5 mt-2">
            {["Estudiante", "Padre/Madre", "Profesor"].map((rol) => (
              <label key={rol} className="inline-flex items-center">
                <input
                  type="radio"
                  name="correoPertenece"
                  value={rol}
                  checked={formData.estudiante?.correoPertenece === rol}
                  onChange={() =>
              handleInputChange("estudiante", "correoPertenece", rol)
                  }
                  className="mr-2"
                />
                {rol}
              </label>
            ))}
                </div>
                {errors.correoPertenece && (
            <p className="text-red-500 text-sm mt-1">
              {errors.correoPertenece}
            </p>
                )}
              </div>
            </div>
          </div>

          {/* Columna 2: Datos del Colegio */}
        <div className="flex flex-col items-center bg-gray-300 p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 self-center">
            Datos del Colegio
          </h3>
          <div className="space-y-4 w-full max-w-md">
            <div>
              <label className="flex items-center gap-2">
                <FaSchool className="text-black" /> Nombre del Colegio
              </label>
              <input
                type="text"
                name="colegio"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Nombre del Colegio"
                value={formData.estudiante?.colegio || ""}
                onChange={(e) =>
                  handleValidatedChange(
                    "estudiante",
                    "colegio",
                    e.target.value.toUpperCase(),
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                  )
                }
                maxLength="50"
              />
              {errors.colegio && (
                <p className="text-red-500 text-sm mt-1">{errors.colegio}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaBuilding className="text-black" /> Curso
              </label>
              <select
                name="curso"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.estudiante?.curso || ""}
                onChange={(e) =>
                  handleInputChange("estudiante", "curso", e.target.value)
                }
              >
                <option value="">Seleccione un Curso</option>
                {curso.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
              {errors.curso && (
                <p className="text-red-500 text-sm mt-1">{errors.curso}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaMapMarkedAlt className="text-black" /> Departamento
              </label>
              <select
                name="departamento"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.estudiante?.departamentoSeleccionado || ""}
                onChange={(e) => {
                  handleInputChange(
                    "estudiante",
                    "departamentoSeleccionado",
                    e.target.value
                  );
                  handleInputChange("estudiante", "provincia", ""); // Reiniciar provincia
                }}
              >
                <option value="">Seleccione un Departamento</option>
                {Object.keys(departamentos).map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.departamento}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaMapMarkedAlt className="text-black" /> Provincia
              </label>
              <select
                name="provincia"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.estudiante?.provincia || ""}
                onChange={(e) =>
                  handleInputChange("estudiante", "provincia", e.target.value)
                }
                disabled={!formData.estudiante?.departamentoSeleccionado}
              >
                <option value="">Seleccione una Provincia</option>
                {(
                  departamentos[
                    formData.estudiante?.departamentoSeleccionado
                  ] || []
                ).map((provincia) => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
              {errors.provincia && (
                <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>
              )}
            </div>
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
          disabled={
            isSubmitting ||
            !formData.estudiante?.nombres ||
            !formData.estudiante?.ci ||
            !formData.estudiante?.apellidoPaterno ||
            !formData.estudiante?.apellidoMaterno ||
            !formData.estudiante?.fechaNacimiento ||
            !formData.estudiante?.correo ||
            !formData.estudiante?.colegio ||
            !formData.estudiante?.curso ||
            !formData.estudiante?.departamentoSeleccionado ||
            !formData.estudiante?.provincia ||
            !formData.estudiante?.correoPertenece ||
            formData.estudiante?.ci.length < 7 ||
            formData.estudiante?.nombres.length < 2 ||
            formData.estudiante?.apellidoMaterno.length < 2 ||
            formData.estudiante?.apellidoPaterno.length < 2 ||
            formData.estudiante?.colegio.length < 2 ||
            formData.estudiante?.nombres.split(" ").length > 2
          }
          className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
            formData.estudiante?.nombres &&
            formData.estudiante?.ci &&
            formData.estudiante?.apellidoPaterno &&
            formData.estudiante?.apellidoMaterno &&
            formData.estudiante?.fechaNacimiento &&
            formData.estudiante?.correo &&
            formData.estudiante?.colegio &&
            formData.estudiante?.curso &&
            formData.estudiante?.departamentoSeleccionado &&
            formData.estudiante?.provincia &&
            formData.estudiante?.correoPertenece &&
            formData.estudiante?.ci.length >= 7 &&
            formData.estudiante?.nombres.length >= 2 &&
            formData.estudiante?.apellidoMaterno.length >= 2 &&
            formData.estudiante?.apellidoPaterno.length >= 2 &&
            formData.estudiante?.colegio.length >= 2 &&
            formData.estudiante?.nombres.split(" ").length <= 2 &&
            !isSubmitting
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
