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
import axios from "axios";

export default function FormularioEstudiante() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [colegio, setColegio] = useState("");
  const [correo, setCorreo] = useState("");
  const [errors, setErrors] = useState({});
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [provincias, setProvincias] = useState([]);

  const roles = ["Estudiante", "Padre/Madre", "Profesor"];

  const handleNext = async () => {
    const newErrors = {};
    if (!selectedRole) newErrors.selectedRole = "Debe seleccionar un rol";
    if (!apellidoPaterno) newErrors.apellidoPaterno = "Campo obligatorio";
    if (!apellidoMaterno) newErrors.apellidoMaterno = "Campo obligatorio";
    if (!nombres) newErrors.nombres = "Campo obligatorio";
    if (!ci) newErrors.ci = "Campo obligatorio";
    if (!fechaNacimiento) newErrors.fechaNacimiento = "Campo obligatorio";
    if (!colegio) newErrors.colegio = "Campo obligatorio";
    if (!cursoSeleccionado) newErrors.curso = "Debe seleccionar un curso";
    if (!departamentoSeleccionado)
      newErrors.departamento = "Debe seleccionar un departamento";
    if (!provinciaSeleccionada)
      newErrors.provincia = "Debe seleccionar una provincia";
    if (!correo) {
      newErrors.correo = "Campo obligatorio";
    } else if (!validarCorreo(correo)) {
      newErrors.correo = "Correo inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const responseEstudiante = await axios.post(
        "http://localhost:8000/api/agregarEstudiante",
        {
          apellido_pa: apellidoPaterno,
          apellido_ma: apellidoMaterno,
          nombre: nombres,
          ci: ci,
          correo: correo,
          fecha_registro: fechaNacimiento,
          tipo: selectedRole,
        }
      );

      const responseColegio = await axios.post(
        "http://localhost:8000/api/agregarColegio",
        {
          nombre_colegio: colegio,
          departamento: departamentoSeleccionado,
          provincia: provinciaSeleccionada,
        }
      );

      const responseGrado = await axios.post(
        "http://localhost:8000/api/agregarGrado",
        {
          nombre_grado: cursoSeleccionado,
        }
      );

      console.log(
        "Respuesta del servidor estudiante:",
        responseEstudiante.data
      );
      console.log("Respuesta del servidor colegio:", responseColegio.data);
      console.log("Respuesta del servidor grado:", responseGrado.data);

      navigate("/inscripcion/AreasCompetencia");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
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
      return false;
    } else {
      setErrorCorreo("");
      return true;
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

  const handleDepartamentoChange = (e) => {
    const departamento = e.target.value;
    setDepartamentoSeleccionado(departamento);
    setProvincias(departamentos[departamento] || []);
    setProvinciaSeleccionada("");
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
            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="apellidoPaterno"
                  className="flex items-center gap-2"
                >
                  <FaUserAlt className="text-black" /> Apellido Paterno
                </label>
                <input
                  type="text"
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Apellido Paterno"
                  value={apellidoPaterno}
                  onChange={handleInputChange(
                    setApellidoPaterno,
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                  )}
                />
                {errors.apellidoPaterno && (
                  <p className="text-red-500 text-sm pt-3">
                    {errors.apellidoPaterno}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="apellidoMaterno"
                  className="flex items-center gap-2"
                >
                  <FaUserAlt className="text-black" /> Apellido Materno
                </label>
                <input
                  type="text"
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Apellido Materno"
                  value={apellidoMaterno}
                  onChange={handleInputChange(
                    setApellidoMaterno,
                    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
                  )}
                />
                {errors.apellidoMaterno && (
                  <p className="text-red-500 text-sm pt-3">
                    {errors.apellidoMaterno}
                  </p>
                )}
              </div>
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
              />
              {errors.nombres && (
                <p className="text-red-500 text-sm">{errors.nombres}</p>
              )}
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
              {errors.ci && <p className="text-red-500 text-sm">{errors.ci}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaCalendarAlt className="text-black" /> Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              />
              {errors.fechaNacimiento && (
                <p style={{ color: "red" }}>{errors.fechaNacimiento}</p>
              )}
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
              {errors.correo && (
                <p className="text-red-500 text-sm">{errors.correo}</p>
              )}
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
              {errors.selectedRole && (
                <p className="text-red-500 text-sm">{errors.selectedRole}</p>
              )}
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
              />
              {errors.colegio && (
                <span className="text-red-500">{errors.colegio}</span>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <FaBuilding className="text-black" />
                Curso
              </label>
              <select
                name="curso"
                value={cursoSeleccionado}
                onChange={(e) => setCursoSeleccionado(e.target.value)}
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
              {errors.curso && (
                <p className="text-red-500 text-sm">{errors.curso}</p>
              )}
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
              {errors.departamento && (
                <p className="text-red-500 text-sm">{errors.departamento}</p>
              )}
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
              {errors.provincia && (
                <p className="text-red-500 text-sm">{errors.provincia}</p>
              )}
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
