import {
  GameDTO,
  GameEvents,
  MoveDirection,
  PlayerDTO,
  RotationDirection,
  WorldDTO,
} from '@reapers/game-shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

type UseGameHook = {
  world: WorldDTO;
  player: PlayerDTO;
  joinGame: (name: string) => void;
  updateMoveDirection: (direction: MoveDirection) => void;
  updateRotationDirection: (direction: RotationDirection) => void;
};

const useGame = (serverUrl: string): UseGameHook => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [world, setWorld] = useState<WorldDTO>(new WorldDTO());
  const [player, setPlayer] = useState<PlayerDTO>(new PlayerDTO());

  useEffect(() => {
    socketRef.current = socketIOClient(serverUrl);
    socketRef.current.on(GameEvents.Game.Updated, (game: GameDTO) => {
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
      socketRef.current?.emit(GameEvents.Player.Joined, name);
    },
    [socketRef.current],
  );

  const updateMoveDirection = useCallback(
    (direction: MoveDirection): void => {
      socketRef.current?.emit(GameEvents.Player.MoveDirectionUpdated, direction);
    },
    [socketRef.current],
  );

  const updateRotationDirection = useCallback(
    (direction: RotationDirection): void => {
      socketRef.current?.emit(GameEvents.Player.RotationDirectionUpdated, direction);
    },
    [socketRef.current],
  );

  return { joinGame, player, updateMoveDirection, updateRotationDirection, world };
};

export {
  useGame,
  PlayerDTO,
  GameDTO,
  GameEvents,
  WorldDTO,
  MoveDirection,
  RotationDirection,
};
