import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container, Error, Input } from '../../web';
import { routes } from '../../../configs/routes.config';
import { PlayerStore } from '../../../stores';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const history = useHistory();
  const player = PlayerStore.useStoreState((state) => state);
  const setPlayerName = PlayerStore.useStoreActions((actions) => actions.setPlayerName);
  const [localName, setLocalName] = useState(player.name);
  const [error, setError] = useState('');

  const handleNameChange = (value: string): void => {
    setLocalName(value);
    setError('');
  };

  const handleSubmit = (): void => {
    if (String(localName).length > 0) {
      setPlayerName(localName);
      history.push(routes.play.path);
    } else {
      setError('A name is required');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <Container width={1 / 3}>
        <Card>
          <Input
            placeholder="Name"
            value={localName}
            onChange={handleNameChange}
            onEnter={handleSubmit}
            type="web"
          />
          <Error error={error} />
          <Button onClick={handleSubmit}>Play</Button>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
