import React from "react";
import {
  FaUserAlt,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  TextField,
  RadioGroupField,
  DateField,
} from "../components/FormComponents";
import { PROPIETARIOS_CORREO, getMinDate, getMaxDate } from "./constants";

export default function DatosPersonalesForm({ 
  formData, 
  handleInputChange, 
  handleCIChange, 
  errors,
  isSearching,
  estudianteFound
}) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-gray-500 self-center">
        Datos Personales
      </h2>
      <div className="space-y-4 w-full max-w-md">
        <div className="relative">
          <TextField
            label="Carnet de Identidad"
            icon={<FaIdCard className="text-black" />}
            name="ci"
            placeholder="Número de Carnet de Identidad"
            value={formData.estudiante?.ci || ""}
            onChange={handleCIChange} 
            error={errors.ci}
            maxLength="8"
            regex={/^[0-9]*$/}
          />
          {isSearching && <div className="text-blue-500 text-sm mt-1">Buscando...</div>}
          {estudianteFound && (
            <div className="text-green-500 text-sm mt-1">
              ✓ Estudiante encontrado, se han cargado sus datos
            </div>
          )}
        </div>

        {estudianteFound && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Estudiante encontrado en el sistema. Se han cargado los datos automáticamente.
          </div>
        )}

        <TextField
          label="Apellido Paterno"
          icon={<FaUserAlt className="text-black" />}
          name="apellidoPaterno"
          placeholder="Apellido Paterno"
          value={formData.estudiante?.apellidoPaterno || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "apellidoPaterno", value)
          }
          error={errors.apellidoPaterno}
          maxLength="15"
          regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
          transform={(value) => value.toUpperCase()}
        />

        <TextField
          label="Apellido Materno"
          icon={<FaUserAlt className="text-black" />}
          name="apellidoMaterno"
          placeholder="Apellido Materno"
          value={formData.estudiante?.apellidoMaterno || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "apellidoMaterno", value)
          }
          error={errors.apellidoMaterno}
          maxLength="15"
          regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/}
          transform={(value) => value.toUpperCase()}
        />

        <TextField
          label="Nombres"
          icon={<FaUserAlt className="text-black" />}
          name="nombres"
          placeholder="Nombres"
          value={formData.estudiante?.nombres || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "nombres", value)
          }
          error={errors.nombres}
          maxLength="30"
          regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/}
          transform={(value) => value.toUpperCase()}
        />

        <DateField
          label="Fecha de Nacimiento"
          icon={<FaCalendarAlt className="text-black" />}
          name="fechaNacimiento"
          value={formData.estudiante?.fechaNacimiento || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "fechaNacimiento", value)
          }
          error={errors.fechaNacimiento}
          min={getMinDate()}
          max={getMaxDate()}
        />

        <TextField
          label="Correo Electrónico"
          icon={<FaEnvelope className="text-black" />}
          name="correo"
          type="email"
          placeholder="Correo Electrónico"
          value={formData.estudiante?.correo || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "correo", value)
          }
          error={errors.correo}
        />

        <RadioGroupField
          label="El correo electrónico pertenece a:"
          name="correoPertenece"
          options={PROPIETARIOS_CORREO}
          value={formData.estudiante?.correoPertenece || ""}
          onChange={(value) =>
            handleInputChange("estudiante", "correoPertenece", value)
          }
          error={errors.correoPertenece}
        />
      </div>
    </div>
  );
}