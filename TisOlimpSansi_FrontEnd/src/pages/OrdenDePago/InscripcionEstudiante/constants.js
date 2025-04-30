export const CURSOS = [
    "3ro de Primaria",
    "4to de Primaria",
    "5to de Primaria",
    "6to de Primaria",
    "1ro de Secundaria",
    "2do de Secundaria",
    "3ro de Secundaria",
    "4to de Secundaria",
    "5to de Secundaria",
    "6to de Secundaria",
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