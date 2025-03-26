import React from 'react';
import ProcesoRegistro from './ProcesoRegistro';

const InscripcionResponsable = () => {
  const steps = [
    'Datos del Responsable', 
    'Información Adicional', 
    'Confirmación'
  ];

  return (
    <ProcesoRegistro 
      steps={steps} 
      nextRoute="/inscripcion/estudiante"
      backRoute="/"
    />
  );
};

export default InscripcionResponsable;