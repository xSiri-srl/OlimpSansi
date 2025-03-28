import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaSchool,
  FaBuilding,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function FormularioEstudiante() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [colegio, setColegio] = useState("");
  const [correo, setCorreo] = useState("");
  const [errors, setErrors] = useState({});
  const [errorCorreo, setErrorCorreo] = useState("");

  const roles = ["Estudiante", "Padre/Madre", "Profesor"];

  const handleNext = () => {
    navigate("/inscripcion/AreasCompetencia");
  };
  const handlePrevious = () => {
    navigate("/inscripcion/responsable");
  };

  const handleInputChange = (setter, regex) => (e) => {
    const value = e.target.value;
    if (regex.test(value) || value === "") {
      setter(value);
    }
  };

  const validarCorreo = (email) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(email)) {
      setErrorCorreo("Correo electrónico inválido");
    } else {
      setErrorCorreo("");
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

  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provincias, setProvincias] = useState([]);

  const handleDepartamentoChange = (e) => {
    const departamento = e.target.value;
    setDepartamentoSeleccionado(departamento);
    setProvincias(departamentos[departamento] || []);
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center w-full mb-6">
        Formulario de Inscripción del Estudiante
      </h2>

      <div className="flex justify-center space-x-10">
        {/* Formulario parta los Datos Personales */}
        <div className="max-w-md p-6 bg-white shadow-md border rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Datos Personales
          </h2>
          <form className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <FaUserAlt className="text-black" /> Apellidos
              </label>
              <input
                type="text"
                name="apellido"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Apellidos"
                value={apellidos}
                onChange={handleInputChange(
                  setApellidos,
                  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                )}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaUserAlt className="text-black" /> Nombres
              </label>
              <input
                type="text"
                name="nombre"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Nombres"
                value={nombres}
                onChange={handleInputChange(
                  setNombres,
                  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                )}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaIdCard className="text-black" /> Cédula de Identidad
              </label>
              <input
                type="text"
                name="ci"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Número de Carnet de Identidad"
                value={ci}
                onChange={handleInputChange(setCi, /^[0-9]*$/)}
                pattern="[0-9]+"
                maxLength="8"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaCalendarAlt className="text-black" /> Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaEnvelope className="text-black" />
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Correo Electrónico"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  validarCorreo(e.target.value);
                }}
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                El correo pertenece a:
              </label>
              <div className="flex flex-row space-x-5 mt-3">
                {roles.map((role) => (
                  <label key={role} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="roles"
                      value={role}
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="mr-2"
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Formulario parta los Datos del Colegio */}
        <div className="max-w-md p-6 bg-white shadow-md border rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Datos del Colegio
          </h2>
          <form className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <FaSchool className="text-black" />
                Nombre del Colegio
              </label>
              <input
                type="text"
                name="colegio"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Nombre del Colegio"
                value={colegio}
                onChange={handleInputChange(
                  setColegio,
                  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                )}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaBuilding className="text-black" />
                Curso
              </label>
              <select
                name="curso"
                className="mt-1 p-2 w-full border
              rounded-md"
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
                <FaMapMarkedAlt className="text-black" />
                Departamento
              </label>
              <select
                name="departamento"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={handleDepartamentoChange}
                value={departamentoSeleccionado}
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
                <FaMapMarkedAlt className="text-black" />
                Provincia
              </label>
              <select
                name="provincia"
                className="mt-1 p-2 w-full border rounded-md"
                disabled={!departamentoSeleccionado}
              >
                <option value="">Seleccione una Provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          onClick={handlePrevious}
        >
          Atrás
        </button>
        <button
          type="button"
          className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          onClick={handleNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
