import React from 'react';
import cn from 'classnames';
import AntButton, { ButtonProps } from 'antd/lib/button';
import styles from './Button.module.scss';

const Button: React.FC<ButtonProps> = ({ className, children, ...rest }) => {
  return (
    <AntButton {...rest} className={cn(styles.button, className)}>
      {children}
    </AntButton>
  );
};
export default Button;
