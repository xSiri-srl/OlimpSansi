import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function FormularioInscripcion() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const roles = ["Estudiante", "Padre/Madre", "Profesor"];
  const handleNext = () => {
    navigate("/inscripcion/tutorAcademico");
  };
  const handlePrevious = () => {
    navigate("/inscripcion/AreasCompetencia");
  };

  const handleInputChange = (setter, regex) => (e) => {
    const value = e.target.value;
    if (regex.test(value) || value === "") {
      setter(value);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-3">
      <h2 className="text-xl font-semibold mb-4 text-center">Tutor Legal</h2>
      <form className="space-y-4 mt-8 p-4 shadow-md border rounded-md">
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
        <div className="flex gap-4">
          <div className="w-full">
            <div className="flex items-center gap-2">
              <FaUser className="text-black" />
              <label>Apellido Paterno</label>
            </div>
            <input
              type="text"
              name="apellidoPaterno"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Apellido Paterno"
              value={apellidoPaterno}
              onChange={handleInputChange(
                setApellidoPaterno,
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
              )}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
            />
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2">
              <FaUser className="text-black" />
              <label>Apellido Materno</label>
            </div>
            <input
              type="text"
              name="apellidoMaterno"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Apellido Materno"
              value={apellidoMaterno}
              onChange={handleInputChange(
                setApellidoMaterno,
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
              )}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaUser className="text-black" />
          <label>Nombres</label>
        </div>
        <input
          type="text"
          name="nombre"
          className="mt-1 p-2 w-full border rounded-md"
          value={nombres}
          onChange={handleInputChange(setNombres, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)}
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
          placeholder="Nombres"
        />

        <div className="flex items-center gap-2">
          <FaIdCard className="text-black" />
          <label>CI</label>
        </div>
        <input
          type="text"
          name="ci"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Numero de Carnet de Identidad"
          value={ci}
          onChange={handleInputChange(setCi, /^[0-9]*$/)}
          pattern="[0-9]+"
          maxLength="8"
        />

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
          />
        </div>

        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-black" />
          <label>Telefono/Celular</label>
        </div>
        <input
          type="text"
          name="Telefono"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Numero de telefono/Celular"
          value={telefono}
          onChange={handleInputChange(setTelefono, /^[0-9]*$/)}
          pattern="[0-9]+"
          maxLength="8"
        />

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
      </form>
    </div>
  );
}
