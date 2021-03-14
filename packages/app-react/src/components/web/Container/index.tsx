import React, { ReactNode } from 'react';
import styles from './Container.module.scss';

type ContainerProps = {
  width?: number;
  children: ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = (props) => {
  const cssWidth = `calc(${props.width || 1}*100%`;

  return (
    <div className={`${styles.container} ${props.className}`} style={{ width: cssWidth }}>
      {props.children}
    </div>
  );
};

export default Container;
