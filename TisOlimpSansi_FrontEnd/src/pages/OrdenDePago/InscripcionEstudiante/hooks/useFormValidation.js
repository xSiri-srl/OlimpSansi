import { useState } from "react";
import { validateBirthDate } from "../../utils/dateValidation";

export default function useFormValidation(formData) {
  const [errors, setErrors] = useState({});
  
  const validateInput = (value, fieldName, regex) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Campo obligatorio." }));
      return false;
    }

    if (regex && !regex.test(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Formato inválido." }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateInput(email, "correo", emailRegex);
  };

  const isFormValid =
    formData.estudiante?.nombres &&
    formData.estudiante?.ci &&
    formData.estudiante?.apellidoPaterno &&
    formData.estudiante?.apellidoMaterno &&
    formData.estudiante?.fechaNacimiento &&
    formData.estudiante?.correo &&
    formData.estudiante?.colegio &&
    formData.estudiante?.curso &&
    formData.estudiante?.departamentoSeleccionado &&
    formData.estudiante?.distrito &&
    formData.estudiante?.correoPertenece &&
    formData.estudiante?.ci.length >= 7 &&
    formData.estudiante?.nombres.length >= 2 &&
    formData.estudiante?.apellidoMaterno.length >= 2 &&
    formData.estudiante?.apellidoPaterno.length >= 2 &&
    formData.estudiante?.colegio.length >= 2 &&
    formData.estudiante?.nombres.split(" ").length <= 2;

  const validateAllFields = () => {
    const isApellidoPaternoValid = validateInput(
      formData.estudiante?.apellidoPaterno,
      "apellidoPaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isApellidoMaternoValid = validateInput(
      formData.estudiante?.apellidoMaterno,
      "apellidoMaterno",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isNombresValid = validateInput(
      formData.estudiante?.nombres,
      "nombres",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    );

    const isCIValid = validateInput(formData.estudiante?.ci, "ci", /^[0-9]*$/);

    const isFechaNacimientoValid = validateInput(
      formData.estudiante?.fechaNacimiento,
      "fechaNacimiento"
    );

    const isCorreoValid = validateEmail(formData.estudiante?.correo);

    const isCorreoPerteneceValid = validateInput(
      formData.estudiante?.correoPertenece,
      "correoPertenece"
    );

    const isColegioValid = validateInput(
      formData.estudiante?.colegio,
      "colegio",
      /^[A-Za-zÁÉÍÓÚáéíóúÑñËë0-9\s,.\-+()'"'№ºª°\n\r]+$/
    );

    const isCursoValid = validateInput(formData.estudiante?.curso, "curso");

    const isDepartamentoValid = validateInput(
      formData.estudiante?.departamentoSeleccionado,
      "departamento"
    );

    const isDistritoValid = validateInput(
      formData.estudiante?.distrito,
      "distrito"
    );

    const fecha = formData.estudiante?.fechaNacimiento || "";
    const { valid: isFechaValida, error: fechaError } =
      validateBirthDate(fecha);
    if (!isFechaValida) {
      setErrors((prev) => ({ ...prev, fechaNacimiento: fechaError }));
    }

    return (
      isApellidoPaternoValid &&
      isApellidoMaternoValid &&
      isNombresValid &&
      isCIValid &&
      isFechaNacimientoValid &&
      isFechaValida &&
      isCorreoValid &&
      isCorreoPerteneceValid &&
      isColegioValid &&
      isCursoValid &&
      isDepartamentoValid &&
      isDistritoValid
    );
  };

  return {
    errors,
    setErrors,
    isFormValid,
    validateAllFields
  };
}