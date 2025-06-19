import { useState } from 'react';
import { validateField, validateEmail, validateCI } from '../utils/validationsUtils';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateInput = (value, fieldName, regex, minWords = 1) => {
    const { isValid, errorMessage } = validateField(value, regex, minWords);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  const validateEmailField = (email, fieldName = 'email') => {
    const { isValid, errorMessage } = validateEmail(email);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  const validateCIField = (ci, fieldName = 'ci') => {
    const { isValid, errorMessage } = validateCI(ci);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return isValid;
  };

  const clearError = (fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

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