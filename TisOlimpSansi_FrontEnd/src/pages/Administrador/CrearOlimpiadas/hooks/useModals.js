import { useState } from "react";

const useModals = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTareasModal, setShowTareasModal] = useState(false);

  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const openSuccessModal = () => setShowSuccessModal(true);
  const closeSuccessModal = () => setShowSuccessModal(false);

  const openTareasModal = () => setShowTareasModal(true);
  const closeTareasModal = () => setShowTareasModal(false);

  const showSuccessAndThenTasks = () => {
    openSuccessModal();
    setTimeout(() => {
      closeSuccessModal();
      openTareasModal();
    }, 1500);
  };

  const closeAllModals = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setShowTareasModal(false);
  };

  return {
    showConfirmModal,
    showSuccessModal,
    showTareasModal,
    openConfirmModal,
    closeConfirmModal,
    openSuccessModal,
    closeSuccessModal,
    openTareasModal,
    closeTareasModal,
    showSuccessAndThenTasks,
    closeAllModals,
  };
};

export default useModals;
