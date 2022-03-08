import React from 'react';
import cn from 'classnames';
import AntInput, { InputProps } from 'antd/lib/input';
import AntInputPassword from 'antd/lib/input/Password';
import styles from './Input.module.scss';

export type InputType = InputProps & { isPassword?: boolean; isNumber?: boolean };

const Input: React.FC<InputType> = ({ className, placeholder = '', isPassword, isNumber, ...rest }) => {
  if (isPassword) {
    return <AntInputPassword className={cn(styles.input, className)} {...rest} placeholder={placeholder} />;
  }

  return <AntInput className={cn(styles.input, className)} {...rest} placeholder={placeholder} />;
};

export default Input;
