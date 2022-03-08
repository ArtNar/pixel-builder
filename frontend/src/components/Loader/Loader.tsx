import React from 'react';
import cn from 'classnames';
import styles from './Loader.module.scss';

export type LoaderType = {
  className?: string;
  small?: boolean;
};

const Loader: React.FC<LoaderType> = ({ className, small }) => {
  return (
    <div className={cn(styles.loader, { [styles.small]: small }, className)}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Loader;
