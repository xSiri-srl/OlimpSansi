import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function InscripcionTutorLegal() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [errors, setErrors] = useState({});
  const [errorCorreo, setErrorCorreo] = useState("");
  const roles = ["Estudiante", "Padre/Madre", "Profesor"];

  const handleNext = async () => {
    const newErrors = {};
    if (!selectedRole) newErrors.selectedRole = "Debe seleccionar un rol";
    if (!apellidoPaterno) newErrors.apellidoPaterno = "Campo obligatorio";
    if (!apellidoMaterno) newErrors.apellidoMaterno = "Campo obligatorio";
    if (!nombres) newErrors.nombres = "Campo obligatorio";
    if (!ci) newErrors.ci = "Campo obligatorio";
    if (!telefono) newErrors.telefono = "Campo obligatorio";
    if (!correo) {
      newErrors.correo = "Campo obligatorio";
    } else {
      const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regexCorreo.test(correo)) newErrors.correo = "Correo inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/agregarTutorLegal",
        {
          apellido_pa: apellidoPaterno,
          apellido_ma: apellidoMaterno,
          nombre: nombres,
          ci: ci,
          correo: correo,
          numero_celular: telefono,
          tipo: selectedRole,
        }
      );
      console.log("Respuesta del servidor:", response.data);
      navigate("/inscripcion/estudiante");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
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

  return (
    <div className="max-w-md mx-auto p-5 bg-white mt-3">
      <h2 className="text-xl font-semibold mb-4 text-center">Tutor Legal</h2>
      <form className="space-y-4 mt-5 p-4 shadow-md border rounded-md">
        <div className="flex flex-row space-x-5 mt-2">
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
            />
            {errors.apellidoPaterno && (
              <p className="text-red-500 text-sm pt-3">
                {errors.apellidoPaterno}
              </p>
            )}
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
            />
            {errors.apellidoMaterno && (
              <p className="text-red-500 text-sm pt-3">
                {errors.apellidoMaterno}
              </p>
            )}
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
        {errors.nombres && (
          <p className="text-red-500 text-sm">{errors.nombres}</p>
        )}

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
        {errors.ci && <p className="text-red-500 text-sm">{errors.ci}</p>}

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
        {errors.correo && (
          <p className="text-red-500 text-sm">{errors.correo}</p>
        )}
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
        {errors.telefono && (
          <p className="text-red-500 text-sm">{errors.telefono}</p>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
            onClick={handleNext}
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
