import React, { ReactNode } from 'react';
import styles from './Card.module.scss';

type CardProps = {
  children: ReactNode;
};

const Card: React.FC<CardProps> = (props) => {
  return <div className={styles.card}>{props.children}</div>;
};

export default Card;
