/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React from 'react';

import { ModalContext } from './ModalContext';
import Modal from './Modal';

const ModalProvider = ({ children, container }: any) => {
  const [modals, setModals] = React.useState({});

  const openModal = (key, modal) => {
    setModals((modals) => ({
      ...modals,
      [key]: {
        modal,
        isOpen: true,
      },
    }));
  };

  const closeModal = (key) => {
    setModals((modals) => {
      const newModals = { ...modals };

      newModals[key].isOpen = false;

      return newModals;
    });
  };

  const removeModal = (key) => {
    setModals((modals) => {
      const newModals = { ...modals };

      delete newModals[key];

      return newModals;
    });
  };

  const handleRemoveModal = (key, props) => {
    const { onClose } = props;

    removeModal(key);

    if (onClose) {
      onClose();
    }
  };

  const renderModal = (key) => {
    const {
      modal: { component, props },
      isOpen,
    } = modals[key];

    const Component = component;

    if (!Component) {
      return null;
    }

    return (
      <Modal {...props} key={key} visible={isOpen} onCancel={() => handleRemoveModal(key, props)}>
        <Component closeModal={() => handleRemoveModal(key, props)} />
      </Modal>
    );
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {Object.keys(modals).map((key) => renderModal(key))}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
