import React from 'react';
import cn from 'classnames';
import AntInputCheckbox, { CheckboxProps } from 'antd/lib/checkbox';
import styles from './InputCheckbox.module.scss';

export type InputCheckboxType = CheckboxProps;

const InputCheckbox: React.FC<InputCheckboxType> = ({ className, ...rest }) => {
  return <AntInputCheckbox className={cn(styles.input, className)} {...rest} />;
};

export default InputCheckbox;
