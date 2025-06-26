import { FaUser, FaIdCard, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

// Función para validar formato de fecha dd/mm/aaaa
const validarFormatoFecha = (fecha) => {
  if (!fecha) return "";
  
  // Eliminar caracteres que no sean números o /
  let fechaLimpia = fecha.replace(/[^\d\/]/g, '');
  
  // Agregar automáticamente las barras
  if (fechaLimpia.length >= 2 && fechaLimpia.indexOf('/') === -1) {
    fechaLimpia = fechaLimpia.substring(0, 2) + '/' + fechaLimpia.substring(2);
  }
  if (fechaLimpia.length >= 5 && fechaLimpia.split('/').length === 2) {
    const partes = fechaLimpia.split('/');
    fechaLimpia = partes[0] + '/' + partes[1].substring(0, 2) + '/' + partes[1].substring(2);
  }
  
  // Limitar a 10 caracteres (dd/mm/aaaa)
  fechaLimpia = fechaLimpia.substring(0, 10);
  
  return fechaLimpia;
};

// Función para validar si la fecha es válida
const esFechaValida = (fecha) => {
  if (!fecha) return true; // Fecha vacía puede ser válida dependiendo de tus reglas
  
  // Verificar formato dd/mm/aaaa
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = fecha.match(regex);
  
  if (!match) return false;
  
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const año = parseInt(match[3], 10);
  
  // Validar rangos básicos
  if (dia < 1 || dia > 31) return false;
  if (mes < 1 || mes > 12) return false;
  if (año < 1900 || año > 2100) return false;
  
  // Validar días por mes
  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Verificar año bisiesto
  if (mes === 2 && esAñoBisiesto(año)) {
    diasPorMes[1] = 29;
  }
  
  if (dia > diasPorMes[mes - 1]) return false;
  
   const añoActual = new Date().getFullYear();
  if (año > añoActual - 5) return false;
  return true;
};

// Función para verificar año bisiesto
const esAñoBisiesto = (año) => {
  return (año % 4 === 0 && año % 100 !== 0) || (año % 400 === 0);
};

// Función para convertir fecha dd/mm/aaaa a formato yyyy-mm-dd para input date
const fechaAInputDate = (fecha) => {
  if (!fecha || !esFechaValida(fecha)) return "";
  const [dia, mes, año] = fecha.split('/');
  return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
};

// Función para convertir fecha yyyy-mm-dd a formato dd/mm/aaaa
const inputDateAFecha = (inputDate) => {
  if (!inputDate) return "";
  const [año, mes, dia] = inputDate.split('-');
  return `${dia}/${mes}/${año}`;
};

const DatosCompetidor = ({
  estudianteData,
  handleChange,
  mostrarCampo,
  tieneError,
  campoEditable,
  errores,
  validarFormatoCI,
}) => {
  // Función para manejar el cambio de fecha desde input text
  const handleFechaChange = (e) => {
    const fechaFormateada = validarFormatoFecha(e.target.value);
    handleChange("estudiante", "fecha_nacimiento", fechaFormateada);
  };

  // Función para manejar el cambio de fecha desde input date
  const handleFechaDateChange = (e) => {
    const fechaFormateada = inputDateAFecha(e.target.value);
    handleChange("estudiante", "fecha_nacimiento", fechaFormateada);
  };

  // Determinar si el campo de fecha debe ser editable
  const fechaEsEditable = () => {
    return campoEditable("fecha_nacimiento") || 
           tieneError("fecha_nacimiento") || 
           (estudianteData.estudiante?.fecha_nacimiento && 
            !esFechaValida(estudianteData.estudiante.fecha_nacimiento));
  };

  const fechaActual = estudianteData.estudiante?.fecha_nacimiento || "";
  const fechaTieneError = tieneError("fecha_nacimiento") || 
                         (fechaActual && !esFechaValida(fechaActual));

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">
        DATOS DE COMPETIDOR
      </h4>

      {mostrarCampo("apellido_pa") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${
              tieneError("apellido_pa") ? "border-red-500" : ""
            } ${!campoEditable("apellido_pa") ? "bg-gray-100" : ""}`}
            value={estudianteData.estudiante?.apellido_pa || ""}
            onChange={(e) =>
              handleChange(
                "estudiante",
                "apellido_pa",
                e.target.value.toUpperCase()
              )
            }
            readOnly={
              !campoEditable("apellido_pa") && !tieneError("apellido_pa")
            }
          />
          {tieneError("apellido_pa") && (
            <p className="text-red-500 text-xs mt-1">{errores.apellido_pa}</p>
          )}
        </div>
      )}

      {mostrarCampo("apellido_ma") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Materno
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${
              !campoEditable("apellido_ma") ? "bg-gray-100" : ""
            }`}
            value={estudianteData.estudiante?.apellido_ma || ""}
            onChange={(e) =>
              handleChange(
                "estudiante",
                "apellido_ma",
                e.target.value.toUpperCase()
              )
            }
            readOnly={
              !campoEditable("apellido_ma") && !tieneError("apellido_ma")
            }
          />
          {tieneError("apellido_ma") && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errores.apellido_ma}
            </p>
          )}
        </div>
      )}

      {mostrarCampo("nombre") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Nombres
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${
              tieneError("nombre") ? "border-red-500 bg-red-50" : ""
            } ${
              !campoEditable("nombre") && !tieneError("nombre")
                ? "bg-gray-100"
                : ""
            }`}
            value={estudianteData.estudiante?.nombre || ""}
            onChange={(e) =>
              handleChange("estudiante", "nombre", e.target.value.toUpperCase())
            }
            readOnly={!campoEditable("nombre") && !tieneError("nombre")}
          />
          {tieneError("nombre") && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errores.nombre}
            </p>
          )}
        </div>
      )}

      {mostrarCampo("ci") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaIdCard /> Carnet de Identidad
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border rounded-md ${
              tieneError("ci") ? "border-red-500" : ""
            } ${!campoEditable("ci") ? "bg-gray-100" : ""}`}
            value={estudianteData.estudiante?.ci || ""}
            onChange={(e) => {
              const formattedValue = validarFormatoCI(e.target.value);
              handleChange("estudiante", "ci", formattedValue);
            }}
            readOnly={!campoEditable("ci")}
            pattern="\d{7,8}"
            title="El CI debe contener entre 7 y 8 dígitos"
          />
          {tieneError("ci") && (
            <p className="text-red-500 text-xs mt-1">{errores.ci}</p>
          )}
        </div>
      )}

      {mostrarCampo("fecha_nacimiento") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaCalendarAlt /> Fecha de Nacimiento
          </label>
          
          <div className="flex gap-2">
            {/* Input de texto para formato dd/mm/aaaa */}
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              className={`mt-1 p-2 flex-1 border rounded-md ${
                fechaTieneError ? "border-red-500" : ""
              } ${!fechaEsEditable() ? "bg-gray-100" : ""}`}
              value={fechaActual}
              onChange={handleFechaChange}
              readOnly={!fechaEsEditable()}
              maxLength={10}
            />
            
          </div>
          
          {fechaTieneError && (
            <p className="text-red-500 text-xs mt-1">
              {errores.fecha_nacimiento || "Formato de fecha inválido. Use dd/mm/aaaa"}
            </p>
          )}
        </div>
      )}

      {mostrarCampo("correo") && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaEnvelope /> Correo Electrónico
          </label>
          <input
            type="email"
            className={`mt-1 p-2 w-full border rounded-md ${
              tieneError("correo") ? "border-red-500" : ""
            } ${!campoEditable("correo") ? "bg-gray-100" : ""}`}
            value={estudianteData.estudiante?.correo || ""}
            onChange={(e) =>
              handleChange("estudiante", "correo", e.target.value)
            }
            readOnly={!campoEditable("correo")}
          />fechaEsEditable
          {tieneError("correo") && (
            <p className="text-red-500 text-xs mt-1">{errores.correo}</p>
          )}
        </div>
      )}

      {mostrarCampo("propietario_correo") && (
        <div>
          <label className="text-sm font-medium text-gray-700">
            El correo electrónico pertenece a:
          </label>
          <div className="flex flex-row space-x-4 mt-1">
            {["Estudiante", "Padre/Madre", "Profesor"].map((rol) => (
              <label key={rol} className="inline-flex items-center">
                <input
                  type="radio"
                  name="propietario_correo"
                  value={rol}
                  checked={
                    estudianteData.estudiante?.propietario_correo === rol
                  }
                  onChange={() =>
                    handleChange("estudiante", "propietario_correo", rol)
                  }
                  disabled={!campoEditable("propietario_correo")}
                  className={`mr-1 ${
                    !campoEditable("propietario_correo") ? "opacity-60" : ""
                  }`}
                />
                <span className="text-sm">{rol}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatosCompetidor;