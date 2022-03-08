import React from 'react';

const violation = () => {
  throw new Error('Make sure your component is rendered inside ModalProvider');
};

export type ModalType = {
  component: React.ReactElement;
  props: Record<string, any>;
};

type ModalContextType = {
  closeModal: (key: string) => void;
  openModal: (key: string, modal: ModalType) => void;
};

export const ModalContext = React.createContext<ModalContextType>({
  openModal: violation,
  closeModal: violation,
});
