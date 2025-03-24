export default function FormularioEstudiante() {
  const roles = ["Estudiante", "Padre/Madre", "Profesor"];

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
                placeholder="Número de Carnet de Identidad"
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

            <div>
              <label className="text-sm font-medium">
                El correo pertenece a:
              </label>
              <div className="flex flex-row space-x-5 mt-3">
                {roles.map((role) => (
                  <label key={role} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="roles"
                      value={role}
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
              <label className="text-sm font-medium">Nombre del Colegio</label>
              <input
                type="text"
                name="colegio"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Nombre del Colegio"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Curso</label>
              <input
                type="text"
                name="Curso"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="6to de Secundaria"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Departamento</label>
              <input
                type="text"
                name="Departamento"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Departamento"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Provincia</label>
              <input
                type="text"
                name="Provincia"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Cercado"
              />
            </div>
          </form>
        </div>
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
    </div>
  );
}
