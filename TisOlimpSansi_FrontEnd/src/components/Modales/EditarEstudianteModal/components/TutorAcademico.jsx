import { FaUser, FaIdCard, FaEnvelope } from "react-icons/fa";

const TutorAcademico = ({
  estudianteData,
  handleChange,
  areaIndex,
  nombreArea,
  tieneError,
  errores,
  validarFormatoCI,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">
        DATOS DE TUTOR ACADEMICO PARA {nombreArea.toUpperCase()} (Opcional)
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Paterno
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border bg-gray-100 rounded-md ${
              tieneError(`tutor_academico_${areaIndex}_apellido_pa`)
                ? "border-red-500"
                : ""
            }`}
            value={
              estudianteData.tutores_academicos?.[areaIndex]?.tutor
                ?.apellido_pa || ""
            }
            disabled={true}
          />
          {tieneError(`tutor_academico_${areaIndex}_apellido_pa`) && (
            <p className="text-red-500 text-xs mt-1">
              {errores[`tutor_academico_${areaIndex}_apellido_pa`]}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaUser /> Apellido Materno
          </label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border bg-gray-100 rounded-md ${
              tieneError(`tutor_academico_${areaIndex}_apellido_ma`)
                ? "border-red-500"
                : ""
            }`}
            value={
              estudianteData.tutores_academicos?.[areaIndex]?.tutor
                ?.apellido_ma || ""
            }
            disabled={true}
          />
          {tieneError(`tutor_academico_${areaIndex}_apellido_ma`) && (
            <p className="text-red-500 text-xs mt-1">
              {errores[`tutor_academico_${areaIndex}_apellido_ma`]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaUser /> Nombres
        </label>
        <input
          type="text"
          className={`mt-1 p-2 w-full border bg-gray-100 rounded-md ${
            tieneError(`tutor_academico_${areaIndex}_nombre`)
              ? "border-red-500"
              : ""
          }`}
          value={
            estudianteData.tutores_academicos?.[areaIndex]?.tutor?.nombre || ""
          }
          disabled={true}
        />
        {tieneError(`tutor_academico_${areaIndex}_nombre`) && (
          <p className="text-red-500 text-xs mt-1">
            {errores[`tutor_academico_${areaIndex}_nombre`]}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaIdCard /> Carnet de Identidad
        </label>
        <input
          type="text"
          className={`mt-1 p-2 w-full border bg-gray-100 rounded-md ${
            tieneError(`tutor_academico_${areaIndex}_ci`)
              ? "border-red-500"
              : ""
          }`}
          value={
            estudianteData.tutores_academicos?.[areaIndex]?.tutor?.ci || ""
          }
          disabled={true}
          pattern="\d{7,8}"
          title="El CI debe contener entre 7 y 8 dígitos"
        />
        {tieneError(`tutor_academico_${areaIndex}_ci`) && (
          <p className="text-red-500 text-xs mt-1">
            {errores[`tutor_academico_${0}_ci`]}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaEnvelope /> Correo Electrónico
        </label>
        <input
          type="email"
          className={`mt-1 p-2 w-full border rounded-md ${
            estudianteData.tutores_academicos?.[0]?.tutor?.ci == ""
              ? "bg-gray-100"
              : ""
          } ${
            estudianteData.tutores_academicos?.[0]?.tutor?.correo !== "" &&
            tieneError(`tutor_academico_${areaIndex}_correo`)
              ? "border-red-500 bg-red-50"
              : ""
          }`}
          value={
            estudianteData.tutores_academicos?.[areaIndex]?.tutor?.correo || ""
          }
            onChange={(e) => {
              handleChange(
                `tutor_academico_${areaIndex}`,
                "correo",
                e.target.value
              );
            }}
          disabled={estudianteData.tutores_academicos?.[0]?.tutor?.ci == ""}
          maxLength={30}
        />
        {tieneError(`tutor_academico_${areaIndex}_correo`) && (
          <p className="text-red-500 text-xs mt-1">
            {errores[`tutor_academico_${areaIndex}_correo`]}
          </p>
        )}
      </div>
    </div>
  );
};

export default TutorAcademico;
