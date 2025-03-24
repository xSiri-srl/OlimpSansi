import { FaUser, FaIdCard } from "react-icons/fa";

export default function FormularioInscripcion() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-3">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Responsable de Inscripción
      </h2>
      <form className="space-y-4 mt-8 p-4 shadow-md border rounded-md">
        <div className="flex items-center gap-2">
          <FaUser className="text-black" />
          <label>Apellidos</label>
        </div>
        <input
          type="text"
          name="apellidos"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Apellidos"
        />

        <div className="flex items-center gap-2">
          <FaUser className="text-black" />
          <label>Nombres</label>
        </div>
        <input
          type="text"
          name="nombre"
          className="mt-1 p-2 w-full border rounded-md"
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
        />

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          >
            Atrás
          </button>
          <button
            type="button"
            className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
          >
            Adelante
          </button>
        </div>
      </form>
    </div>
  );
}
