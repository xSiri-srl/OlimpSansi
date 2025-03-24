export default function FormularioEstudiante() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Formulario de Inscripción del Estudiante
      </h2>
      <form className="space-y-4 mt-8 p-4 shadow-md border rounded-md">
        <div>
          <label className="text-sm font-medium">Apellidos</label>
          <input
            type="text"
            name="apellido"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Apellidos"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Nombres</label>
          <input
            type="text"
            name="nombre"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Nombres"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Cédula de Identidad</label>
          <input
            type="text"
            name="ci"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Numero de Carnet de Identidad"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Correo Electrónico"
          />
        </div>
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
