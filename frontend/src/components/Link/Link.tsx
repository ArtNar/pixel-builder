import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import styles from './Link.module.scss';

export type LinkType = {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  to?: string;
  href?: string;
  isExternal?: boolean;
};

const Link: React.FC<LinkType> = ({ className, disabled, children, to, href, isExternal }) => {
  let props: any = {
    className: cn(
      styles.link,
      {
        disabled,
      },
      className
    ),
  };

  if (href && isExternal) {
    props = {
      ...props,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return to ? (
    <RouterLink {...{ ...props }} to={to}>
      {children}
    </RouterLink>
  ) : (
    <a {...props} href={href} disabled={disabled}>
      {children}
    </a>
  );
};
export default Link;
