import { useState } from "react";
import { FaUser, FaIdCard } from "react-icons/fa";

export default function FormularioInscripcion() {
  const [form, setForm] = useState({ apellidos: "", nombre: "", ci: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-xl font-semibold mb-4">Formulario de Inscripción</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Apellidos</label>
          <div className="flex items-center border rounded-md p-2">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <div className="flex items-center border rounded-md p-2">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Cédula de Identidad
          </label>
          <div className="flex items-center border rounded-md p-2">
            <FaIdCard className="text-gray-500 mr-2" />
            <input
              type="text"
              name="ci"
              value={form.ci}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
