import { useState } from "react";

export const useModales = () => {
  const [modalEstado, setModalEstado] = useState({
    tipo: null, 
    titulo: "",
    mensaje: "",
    isOpen: false,
    onConfirm: null,
    datos: null
  });

  const cerrarModal = () => {
    setModalEstado({
      tipo: null,
      titulo: "",
      mensaje: "",
      isOpen: false,
      onConfirm: null,
      datos: null
    });
  };

  const mostrarAlerta = (titulo, mensaje, tipo = "error") => {
    setModalEstado({
      tipo: 'alerta',
      titulo,
      mensaje,
      isOpen: true,
      tipoAlerta: tipo,
      onConfirm: null,
      datos: null
    });
  };

  const mostrarConfirmacion = (titulo, mensaje, onConfirm, tipo = "warning") => {
    setModalEstado({
      tipo: 'confirmacion',
      titulo,
      mensaje,
      isOpen: true,
      tipoConfirmacion: tipo,
      onConfirm,
      datos: null
    });
  };

  return {
    modalEstado,
    cerrarModal,
    mostrarAlerta,
    mostrarConfirmacion
  };
};