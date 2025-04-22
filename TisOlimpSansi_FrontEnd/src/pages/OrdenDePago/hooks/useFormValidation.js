import { useState } from 'react';
import { validateField, validateEmail, validateCI } from '../utils/validationsUtils';

/**
 * Hook personalizado para manejar validaciones de formulario
 * @returns {Object} Funciones y estado para manejar validaciones
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  // Validar un campo y actualizar errores
  const validateInput = (value, fieldName, regex, minWords = 1) => {
    const { isValid, errorMessage } = validateField(value, regex, minWords);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  // Validar un email y actualizar errores
  const validateEmailField = (email, fieldName = 'email') => {
    const { isValid, errorMessage } = validateEmail(email);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  // Validar un CI y actualizar errores
  const validateCIField = (ci, fieldName = 'ci') => {
    const { isValid, errorMessage } = validateCI(ci);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  // Limpiar el error de un campo específico
  const clearError = (fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  // Establecer un mensaje de error general
  const setGeneralError = (message) => {
    setErrors((prev) => ({ ...prev, general: message }));
  };

  return {
    errors,
    setErrors,
    validateInput,
    validateEmailField,
    validateCIField,
    clearError,
    setGeneralError
  };
};