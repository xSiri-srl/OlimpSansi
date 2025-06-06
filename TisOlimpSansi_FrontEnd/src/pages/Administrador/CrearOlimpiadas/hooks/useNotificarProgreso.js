import { useState } from 'react';

export const useNotificarProgreso = () => {
  const [modalProgreso, setModalProgreso] = useState({
    isOpen: false,
    olimpiadaId: null,
    nombreOlimpiada: ''
  });

  const mostrarProgreso = (olimpiadaId, nombreOlimpiada) => {
    setModalProgreso({
      isOpen: true,
      olimpiadaId,
      nombreOlimpiada
    });
  };

  const cerrarProgreso = () => {
    setModalProgreso({
      isOpen: false,
      olimpiadaId: null,
      nombreOlimpiada: ''
    });
  };

  return {
    modalProgreso,
    mostrarProgreso,
    cerrarProgreso
  };
};