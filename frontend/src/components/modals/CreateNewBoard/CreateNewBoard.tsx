import React from 'react';
import moment from 'moment';
import ApiContext from '../../../services/api/ApiContext';
import { Button } from '../../Button';
import { Form } from '../../form/Form';
import { FormInput } from '../../form/FormInput';
import { FormInputNumber } from '../../form/FormInputNumber';
import { FormInputDate } from '../../form/FormInputDate';
import { FormCheckbox } from '../../form/FormCheckbox';
import styles from './CreateNewBoard.module.scss';

const CreateNewBoard = ({ closeModal }) => {
  const { createBoard } = React.useContext(ApiContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateBoard = React.useCallback(
    async (values: any) => {
      try {
        setIsLoading(true);
        await createBoard(values);

        if (closeModal) {
          closeModal();
        }
      } catch (error) {
        console.log(error.message);
      }

      setIsLoading(false);
    },
    [createBoard, closeModal]
  );

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  return (
    <div>
      <div className={styles.title}>Create new board</div>
      <div>
        <Form
          name="login"
          initialValues={{ isPublic: false }}
          onFinish={handleCreateBoard}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <FormInput name="name" placeholder="name" rules={[{ required: true, message: 'Please input your name!' }]} />
          <FormInputNumber
            name="size"
            placeholder="size"
            rules={[{ required: true, message: 'Please input your size!' }]}
          />
          <FormInputDate
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            name="closedAt"
            placeholder="closed at"
            rules={[{ required: true, message: 'Please input your closedAt!' }]}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
          <FormCheckbox label="Is public" name="isPublic" rules={[{ required: false }]} valuePropName="checked" />
          <div className={styles.actions}>
            <Button className={styles.button} onClick={closeModal}>
              cancel
            </Button>
            <Button className={styles.button} htmlType="submit" loading={isLoading}>
              create
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateNewBoard;
