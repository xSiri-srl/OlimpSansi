import { useState } from "react";

export const useModalState = () => {
  const [modalEstado, setModalEstado] = useState({
    tipo: null,
    titulo: "",
    mensaje: "",
    isOpen: false,
    onConfirm: null,
    datos: null,
  });

  const cerrarModal = () => {
    setModalEstado({
      tipo: null,
      titulo: "",
      mensaje: "",
      isOpen: false,
      onConfirm: null,
      datos: null,
    });
  };

  const mostrarAlerta = (titulo, mensaje, tipo = "error") => {
    setModalEstado({
      tipo: "alerta",
      titulo,
      mensaje,
      isOpen: true,
      tipoAlerta: tipo,
      onConfirm: null,
      datos: null,
    });
  };

  const mostrarConfirmacion = (
    titulo,
    mensaje,
    onConfirm,
    tipo = "warning"
  ) => {
    setModalEstado({
      tipo: "confirmacion",
      titulo,
      mensaje,
      isOpen: true,
      tipoConfirmacion: tipo,
      onConfirm,
      datos: null,
    });
  };

  const mostrarResumenCambios = (
    areasParaDesasociar,
    categoriasParaEliminar,
    onConfirm
  ) => {
    setModalEstado({
      tipo: "resumenCambios",
      titulo: "",
      mensaje: "",
      isOpen: true,
      onConfirm,
      datos: { areasParaDesasociar, categoriasParaEliminar },
    });
  };

  return {
    modalEstado,
    cerrarModal,
    mostrarAlerta,
    mostrarConfirmacion,
    mostrarResumenCambios,
  };
};
