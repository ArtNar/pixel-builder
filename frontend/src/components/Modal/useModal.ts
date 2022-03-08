import { useContext } from 'react';
import { ModalContext, ModalType } from './ModalContext';

export const useModal = (key: string) => {
  const context = useContext(ModalContext);
  const { openModal, closeModal } = context;

  const handleOpenModal = async (getComponent: () => Promise<any>, props: ModalType['props'] = {}) => {
    const { default: component }: any = typeof getComponent === 'function' ? await getComponent() : {};

    openModal(key, {
      component,
      props,
    });
  };

  const handleCloseModal = () => closeModal(key);

  return [handleOpenModal, handleCloseModal];
};
