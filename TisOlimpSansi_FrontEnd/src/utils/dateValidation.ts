export function validateBirthDate(dateString: string): {
  valid: boolean;
  error?: string;
} {
  if (!dateString) {
    return { valid: false, error: "Campo obligatorio." };
  }

  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();

  if (
    date.getFullYear() !== y ||
    date.getMonth() + 1 !== m ||
    date.getDate() !== d
  ) {
    return { valid: false, error: "Fecha inválida." };
  }

  if (date > today) {
    return { valid: false, error: "La fecha no puede ser futura." };
  }

  // (Opcional) rango de edad: por ejemplo, entre 3 y 20 años
  const min = new Date();
  min.setFullYear(min.getFullYear() - 20);
  const max = new Date();
  max.setFullYear(max.getFullYear() - 3);
  if (date < min || date > max) {
    return {
      valid: false,
      error: "La edad debe estar entre 3 y 20 años.",
    };
  }

  return { valid: true };
}
