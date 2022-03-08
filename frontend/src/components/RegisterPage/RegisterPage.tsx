import React from 'react';
import StoreContext from '../../services/store/StoreContext';
import ApiContext from '../../services/api/ApiContext';
import { Paper } from '../Paper';
import { Form } from '../form/Form';
import { FormInput } from '../form/FormInput';
import { Button } from '../Button';
import { Link } from '../Link';
import styles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const { setUserData } = React.useContext(StoreContext);
  const { registerUser } = React.useContext(ApiContext);

  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = React.useCallback(
    async (values: any) => {
      try {
        setIsLoading(true);
        const user = await registerUser(values);
        setUserData(user);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
      }
    },
    [registerUser, setUserData]
  );

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.root}>
      <Paper className={styles.content}>
        <div className={styles.title}>Register</div>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <FormInput name="name" placeholder="name" rules={[{ required: true, message: 'Please input your name!' }]} />
          <FormInput
            name="email"
            placeholder="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          />
          <FormInput
            name="password"
            placeholder="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            isPassword
          />
          <div className={styles.actions}>
            <Button className={styles.button} htmlType="submit" loading={isLoading}>
              enter
            </Button>
            <Link className={styles.link} to="/login">
              already registered?
            </Link>
          </div>
        </Form>
      </Paper>
    </div>
  );
};

export default RegisterPage;
