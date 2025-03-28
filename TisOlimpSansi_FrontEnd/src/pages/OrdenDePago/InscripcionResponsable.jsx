import { FaUser, FaIdCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function FormularioInscripcion() {
  const navigate = useNavigate();
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [errors, setErrors] = useState({});

  const handleNext = async () => {
    const newErrors = {};
    if (!apellidoPaterno) newErrors.apellidoPaterno = "Campo obligatorio.";
    if (!apellidoMaterno) newErrors.apellidoMaterno = "Campo obligatorio.";
    if (!nombres) newErrors.nombres = "Campo obligatorio.";
    if (!ci) newErrors.ci = "Campo obligatorio.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/agregarTresponsableInscrip",
        {
          apellido_pa: apellidoPaterno,
          apellido_ma: apellidoMaterno,
          nombre: nombres,
          ci: ci,
        }
      );
      //console.log("Respuesta del servidor:", response.data);
      navigate("/inscripcion/estudiante");
    } catch (error) {
      setErrors({ general: "Hubo un error al enviar los datos." });
    }
  };

  const handleBack = () => {
    navigate("/inscripcion/forma-inscripcion");
  };

  const handleInputChange = (setter, fieldName, regex) => (e) => {
    const value = e.target.value;
    if (regex.test(value) || value === "") {
      setter(value);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-3">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Responsable de Inscripción
      </h2>
      <form className="space-y-4 mt-8 p-4 shadow-md border rounded-md">
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
                "apellidoPaterno",
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
                "apellidoMaterno",
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
          placeholder="Nombres"
          value={nombres}
          onChange={handleInputChange(
            setNombres,
            "nombres",
            /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
          )}
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
          onChange={handleInputChange(setCi, "ci", /^[0-9]*$/)}
          maxLength="8"
        />
        {errors.ci && <p className="text-red-500 text-sm">{errors.ci}</p>}

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
            onClick={handleBack}
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
