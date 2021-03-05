import { GameDTO, GameEvent, PlayerDTO, PlayerEvent, WorldDTO } from '@reapers/game-shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

type UseGameHook = {
  world: WorldDTO;
  player: PlayerDTO;
  joinGame: (name: string) => void;
};

const useGame = (serverUrl: string): UseGameHook => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [world, setWorld] = useState<WorldDTO>(new WorldDTO());
  const [player, setPlayer] = useState<PlayerDTO>(new PlayerDTO());

  useEffect(() => {
    socketRef.current = socketIOClient(serverUrl);
    socketRef.current.on(GameEvent.Created, (game: GameDTO) => {
      console.log('game created', game);
      setWorld(game.world);
      // todo adapt for multiplayer
      setPlayer(game.players[0]);
    });

    return (): void => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinGame = useCallback(
    (name: string): void => {
      socketRef.current?.emit(PlayerEvent.Joined, name);
    },
    [socketRef.current],
  );

  return { joinGame, player, world };
};

export { useGame, PlayerDTO, GameDTO, GameEvent, WorldDTO };
