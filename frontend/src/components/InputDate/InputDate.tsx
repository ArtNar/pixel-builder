import React from 'react';
import cn from 'classnames';
import AntInputDate, { DatePickerProps } from 'antd/lib/date-picker';
import styles from './InputDate.module.scss';

export type InputDateType = DatePickerProps;

const Input: React.FC<InputDateType> = ({ className, placeholder = '', ...rest }) => {
  return <AntInputDate className={cn(styles.input, className)} {...rest} placeholder={placeholder} />;
};

export default Input;
