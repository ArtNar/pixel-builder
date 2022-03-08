import React from 'react';
import cn from 'classnames';
import AntInputNumber, { InputNumberProps } from 'antd/lib/input-number';
import styles from './InputNumber.module.scss';

export type InputNumberType = InputNumberProps;

const Input: React.FC<InputNumberType> = ({ className, placeholder = '', ...rest }) => {
  return <AntInputNumber className={cn(styles.input, className)} {...rest} placeholder={placeholder} max={10000} />;
};

export default Input;
