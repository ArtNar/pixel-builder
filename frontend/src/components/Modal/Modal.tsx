import React from 'react';
import cn from 'classnames';
import AntModal, { ModalProps } from 'antd/lib/modal';
import styles from './Modal.module.scss';

const Modal = ({
  children,
  onOk,
  onCancel,
  visible,
  title,
  okText,
  cancelText,
  modalComponentProps,
}: ModalProps & { modalComponentProps?: any; children?: any }) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const handleOnOk = React.useCallback(
    (e) => {
      if (onOk) {
        setConfirmLoading(true);

        Promise.resolve(onOk)
          .then((resolver) => {
            if (resolver) {
              resolver(e);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setConfirmLoading(false);
          });
      }
    },
    [onOk]
  );

  const getChildComponent = () => {
    if (!React.isValidElement(children)) {
      return children;
    }

    return React.cloneElement(children, { ...(modalComponentProps || {}) });
  };

  return (
    <AntModal
      className={styles.modal}
      title={title}
      visible={visible}
      onOk={handleOnOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}>
      {getChildComponent()}
    </AntModal>
  );
};

export default Modal;
