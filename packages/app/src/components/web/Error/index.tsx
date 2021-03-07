import Container from '../Container';
import React from 'react';
import styles from './Error.module.scss';

type ErrorProps = {
  error: string;
};

const Error: React.FC<ErrorProps> = (props) => {
  if (!props.error) {
    return null;
  }

  return (
    <Container>
      <p className={styles.error}>{props.error}</p>
    </Container>
  );
};

export default Error;