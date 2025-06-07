import React from "react";
import { FaUser, FaIdCard, FaEnvelope } from "react-icons/fa";

export default function TutorFormFields({
  area,
  tutorData,
  errors,
  isSearching,
  tutorFound,
  onFormChange,
}) {
  return (
    <div className="space-y-4">
      {/* Carnet de Identidad */}
      <div>
        <label className="flex items-center gap-2">
          <FaIdCard className="text-black" /> Carnet de Identidad
        </label>
        <div className="relative">
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Número de Carnet de Identidad"
            value={tutorData?.ci || ""}
            onChange={(e) =>
              onFormChange(area, "ci", e.target.value, /^[0-9]*$/)
            }
            maxLength="8"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isSearching && (
              <span className="text-blue-500 text-sm">Buscando...</span>
            )}
            {tutorFound && (
              <span className="text-green-500 text-sm">✓ Encontrado</span>
            )}
          </div>
        </div>
        {errors[`${area}-ci`] && (
          <p className="text-red-500 text-sm mt-1">{errors[`${area}-ci`]}</p>
        )}

        {tutorFound && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-2 text-sm">
            Tutor encontrado en el sistema. Los datos han sido cargados
            automáticamente.
          </div>
        )}
      </div>

      {/* Apellidos */}
      <div className="flex gap-4">
        <div className="w-full">
          <label className="flex items-center gap-2">
            <FaUser className="text-black" /> Apellido Paterno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Apellido Paterno"
            value={tutorData?.apellidoPaterno || ""}
            onChange={(e) =>
              onFormChange(
                area,
                "apellidoPaterno",
                e.target.value.toUpperCase(),
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
              )
            }
            maxLength="15"
          />
          {errors[`${area}-apellidoPaterno`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`${area}-apellidoPaterno`]}
            </p>
          )}
        </div>

        <div className="w-full">
          <label className="flex items-center gap-2">
            <FaUser className="text-black" /> Apellido Materno
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Apellido Materno"
            value={tutorData?.apellidoMaterno || ""}
            onChange={(e) =>
              onFormChange(
                area,
                "apellidoMaterno",
                e.target.value.toUpperCase(),
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/
              )
            }
            maxLength="15"
          />
          {errors[`${area}-apellidoMaterno`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`${area}-apellidoMaterno`]}
            </p>
          )}
        </div>
      </div>

      {/* Nombres */}
      <div>
        <label className="flex items-center gap-2">
          <FaUser className="text-black" /> Nombres
        </label>
        <input
          type="text"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Nombres"
          value={tutorData?.nombres || ""}
          onChange={(e) =>
            onFormChange(
              area,
              "nombres",
              e.target.value.toUpperCase(),
              /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/
            )
          }
          maxLength="30"
        />
        {errors[`${area}-nombres`] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[`${area}-nombres`]}
          </p>
        )}
      </div>

      {/* Correo Electrónico */}
      <div>
        <label className="flex items-center gap-2">
          <FaEnvelope className="text-black" /> Correo Electrónico
        </label>
        <input
          type="email"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Correo Electrónico"
          value={tutorData?.correo || ""}
          onChange={(e) => onFormChange(area, "correo", e.target.value, null)}
        />
        {errors[`${area}-correo`] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[`${area}-correo`]}
          </p>
        )}
      </div>
    </div>
  );
}