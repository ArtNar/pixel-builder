import React from 'react';
import cn from 'classnames';
import styles from './Paper.module.scss';

const Paper = ({ children, className }) => {
  return <div className={cn(styles.paper, className)}>{children}</div>;
};

export default Paper;
