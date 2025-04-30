export const CURSOS = [
  "3RO DE PRIMARIA",
  "4TO DE PRIMARIA",
  "5TO DE PRIMARIA",
  "6TO DE PRIMARIA",
  "1RO DE SECUNDARIA",
  "2DO DE SECUNDARIA",
  "3RO DE SECUNDARIA",
  "4TO DE SECUNDARIA",
  "5TO DE SECUNDARIA",
  "6TO DE SECUNDARIA",
];

export const PROPIETARIOS_CORREO = ["Estudiante", "Padre/Madre", "Profesor"];

// Calculadores para límites de fecha
export const getMinDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 20);
  return d.toISOString().split("T")[0];
};

export const getMaxDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().split("T")[0];
};
