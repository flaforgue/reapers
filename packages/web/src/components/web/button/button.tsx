import React, { ReactNode } from 'react';
import styles from './button.module.scss';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
