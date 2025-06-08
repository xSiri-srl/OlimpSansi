export const validateField = (value, regex = null, minWords = 1) => {
  if (!value || value.trim() === "") {
    return { isValid: false, errorMessage: "Campo obligatorio." };
  }

  if (regex && !regex.test(value)) {
    return { isValid: false, errorMessage: "Formato inválido." };
  }

  if (minWords > 1 && value.trim().split(/\s+/).length < minWords) {
    return { 
      isValid: false, 
      errorMessage: `Debe contener al menos ${minWords} palabra(s).` 
    };
  }

  return { isValid: true, errorMessage: "" };
};


export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return validateField(email, emailRegex);
};


export const validateCI = (ci) => {
  const ciRegex = /^[0-9]*$/;
  const result = validateField(ci, ciRegex);
  
  if (!result.isValid) return result;
  
  if (ci.length < 7 || ci.length > 8) {
    return { 
      isValid: false, 
      errorMessage: "El CI debe tener entre 7 y 8 dígitos." 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};