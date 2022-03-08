import React from 'react';
import StoreContext from '../../services/store/StoreContext';
import ApiContext from '../../services/api/ApiContext';
import { Paper } from '../Paper';
import { Form } from '../form/Form';
import { FormInput } from '../form/FormInput';
import { Button } from '../Button';
import { Link } from '../Link';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const { setUserData } = React.useContext(StoreContext);
  const { loginUser } = React.useContext(ApiContext);

  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = React.useCallback(
    async (values: any) => {
      try {
        setIsLoading(true);
        const user = await loginUser(values);
        setUserData(user);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    },
    [loginUser, setUserData]
  );

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.root}>
      <Paper className={styles.content}>
        <div className={styles.title}>Login</div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
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
            <Link className={styles.link} to="/register">
              not registered yet?
            </Link>
          </div>
        </Form>
      </Paper>
    </div>
  );
};

export default LoginPage;
