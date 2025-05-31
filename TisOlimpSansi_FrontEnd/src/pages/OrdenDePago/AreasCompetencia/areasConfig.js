// Datos estáticos
export const primeraFila = [
  { nombre: "Matemáticas", imgSrc: "/images/matematicaas.png" },
  { nombre: "Física", imgSrc: "/images/fisica.png" },
  { nombre: "Química", imgSrc: "/images/quimica.png" },
];

export const segundaFila = [
  { nombre: "Biología", imgSrc: "/images/biologia.png" },
  { nombre: "Informática", imgSrc: "/images/informatica.png" },
  { nombre: "Robótica", imgSrc: "/images/robotica.png" },
  { nombre: "Astronomía y Astrofísica", imgSrc: "/images/astronomia.png" },
];

// Mapa de categorías según área y grado
export const categoriasMap = {
  "ASTRONOMÍA - ASTROFÍSICA": {
    "3RO DE PRIMARIA": "3P",
    "4TO DE PRIMARIA": "4P",
    "5TO DE PRIMARIA": "5P",
    "6TO DE PRIMARIA": "6P",
    "1RO DE SECUNDARIA": "1S",
    "2DO DE SECUNDARIA": "2S",
    "3RO DE SECUNDARIA": "3S",
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  BIOLOGÍA: {
    "2DO DE SECUNDARIA": "2S",
    "3RO DE SECUNDARIA": "3S",
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  FÍSICA: {
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  Informática: {
    "5TO DE PRIMARIA": "Guacamayo",
    "6TO DE PRIMARIA": "Guacamayo",
    "1RO DE SECUNDARIA": ["Guanaco", "Londra", "Bufeo"],
    "2DO DE SECUNDARIA": ["Guanaco", "Londra", "Bufeo"],
    "3RO DE SECUNDARIA": ["Guanaco", "Londra", "Bufeo"],
    "4TO DE SECUNDARIA": ["Jucumari", "Puma"],
    "5TO DE SECUNDARIA": ["Jucumari", "Puma"],
    "6TO DE SECUNDARIA": ["Jucumari", "Puma"],
  },
  MATEMÁTICAS: {
    "1RO DE SECUNDARIA": "PRIMER NIVEL",
    "2DO DE SECUNDARIA": "SEGUNDO NIVEL",
    "3RO DE SECUNDARIA": "TERCER NIVEL",
    "4TO DE SECUNDARIA": "CUARTO NIVEL",
    "5TO DE SECUNDARIA": "QUINTO NIVEL",
    "6TO DE SECUNDARIA": "SEXTO NIVEL",
  },
  QUÍMICA: {
    "2DO DE SECUNDARIA": "2S",
    "3RO DE SECUNDARIA": "3S",
    "4TO DE SECUNDARIA": "4S",
    "5TO DE SECUNDARIA": "5S",
    "6TO DE SECUNDARIA": "6S",
  },
  ROBÓTICA: {
    "5TO DE PRIMARIA": ["BUILDERS P", "LEGO P"],
    "6TO DE PRIMARIA": ["BUILDERS P", "LEGO P"],
    "1RO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "2DO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "3RO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "4TO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "5TO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
    "6TO DE SECUNDARIA": ["BUILDERS S", "LEGO S"],
  },
};