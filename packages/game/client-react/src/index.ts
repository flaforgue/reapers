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
  activePlayerId: string;
  frameIndex: number;
  players: PlayerDTO[];
  joinGame: (name: string) => void;
  updateMoveDirection: (direction: MoveDirection) => void;
  updateRotationDirection: (direction: RotationDirection) => void;
  world: WorldDTO;
};

const useGame = (serverUrl: string): UseGameHook => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [activePlayerId, setActivePlayerId] = useState<string>('');
  const [world, setWorld] = useState<WorldDTO>(new WorldDTO());
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [frameIndex, setFrameIndex] = useState<number>(0);

  useEffect(() => {
    socketRef.current = socketIOClient(serverUrl);

    socketRef.current.on(GameEvents.Player.Created, (player: PlayerDTO) => {
      setActivePlayerId(player.id as string);
    });

    socketRef.current.on(GameEvents.Game.Updated, (game: GameDTO) => {
      setWorld(game.world);
      setPlayers(game.players);
      setFrameIndex(game.frameIndex);
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

  return {
    activePlayerId,
    frameIndex,
    joinGame,
    players,
    updateMoveDirection,
    updateRotationDirection,
    world,
  };
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
