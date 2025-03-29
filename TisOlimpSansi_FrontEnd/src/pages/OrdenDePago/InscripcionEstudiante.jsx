import {
  FaUserAlt,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaSchool,
  FaBuilding,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function InscripcionEstudiante({
  formData,
  handleInputChange,
  handleNext,
  handleBack,
}) {
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
    Tarija: ["Cercado", "Gran Chaco", "O’Connor", "Avilés", "Arce"],
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
                handleInputChange("estudiante","apellidoPaterno", e.target.value)}
              />
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
                handleInputChange("estudiante","apellidoMaterno", e.target.value)}
              />
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
                handleInputChange("estudiante","nombres", e.target.value)}
              />
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
                handleInputChange("estudiante","ci", e.target.value)}
              />
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
                onChange={(e) =>
                  handleInputChange("estudiante","fechaNacimiento", e.target.value)
                }
              />
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
                onChange={(e) => handleInputChange("estudiante", "correo", e.target.value)}
              />
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
                onChange={(e) => handleInputChange("estudiante","colegio", e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaBuilding className="text-black" /> Curso
              </label>
              <select
                name="curso"
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.estudiante?.curso || ""}
                onChange={(e) => handleInputChange("estudiante","curso", e.target.value)}
              >
                <option value="">Seleccione un Curso</option>
                {curso.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
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
                  handleInputChange("estudiante", "departamentoSeleccionado", e.target.value);
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
                {(departamentos[formData.estudiante?.departamentoSeleccionado] || []).map(
                  (provincia) => (
                    <option key={provincia} value={provincia}>
                      {provincia}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-center mt-8 gap-4 w-full">
        <button
          type="button"
          className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-gray-500 hover:-translate-y-1 hover:scale-105 hover:bg-gray-600"
          onClick={handleBack}
        >
          Atrás
        </button>
        <button
          type="button"
          className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
          onClick={handleNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}