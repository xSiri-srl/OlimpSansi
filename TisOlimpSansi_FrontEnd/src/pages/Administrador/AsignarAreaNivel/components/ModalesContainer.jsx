import React from "react";
import ModalConfirmacion from "../../../../components/Modales/ModalConfirmacion";
import ModalAlerta from "../../../../components/Modales/ModalAlerta";
import ModalValidacion from "../../../../components/Modales/ModalValidacion";
import ModalTareasPendientes from "../../../../components/Modales/ModalTareasPendientes";

const ModalesContainer = ({
  modalEstado,
  cerrarModal,
  modalProgreso,
  cerrarProgreso,
}) => {
  return (
    <>
      {modalEstado.tipo === "alerta" && (
        <ModalAlerta
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          type={modalEstado.tipoAlerta}
        />
      )}

      {modalEstado.tipo === "confirmacion" && (
        <ModalConfirmacion
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          onConfirm={modalEstado.onConfirm}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          type={modalEstado.tipoConfirmacion}
        />
      )}

      {modalEstado.tipo === "validacion" && (
        <ModalValidacion
          isOpen={modalEstado.isOpen}
          onClose={cerrarModal}
          onConfirm={modalEstado.onConfirm}
          title={modalEstado.titulo}
          message={modalEstado.mensaje}
          validationType={modalEstado.validationType}
          areas={modalEstado.areas}
        />
      )}

      <ModalTareasPendientes
        isOpen={modalProgreso.isOpen}
        onClose={cerrarProgreso}
        onContinue={cerrarProgreso}
        nombreOlimpiada={modalProgreso.nombreOlimpiada}
        olimpiadaId={modalProgreso.olimpiadaId}
        esPrimeraVez={true}
      />
    </>
  );
};

export default ModalesContainer;