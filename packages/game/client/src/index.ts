import socketIOClient from 'socket.io-client';
import { writable } from 'svelte/store';
import {
  EntityKind,
  MovableDTO,
  GameDTO,
  GameEvents,
  MonsterDTO,
  FrontMoveDirection,
  SideMoveDirection,
  PlayerDTO,
  RotationDirection,
  WorldDTO,
} from '@reapers/game-shared';

const activePlayerId = writable<string>('');
const game = writable<GameDTO>(new GameDTO());

let socket: SocketIOClient.Socket | undefined;

function joinGame(playerName: string) {
  socket?.emit(GameEvents.Player.Joined, playerName);
}

function leaveGame() {
  socket?.disconnect();
}

function updateFrontMoveDirection(direction: FrontMoveDirection) {
  socket?.emit(GameEvents.Player.FrontMoveDirectionUpdated, direction);
}

function updateSideMoveDirection(direction: SideMoveDirection) {
  socket?.emit(GameEvents.Player.SideMoveDirectionUpdated, direction);
}

function updateRotationDirection(direction: RotationDirection) {
  socket?.emit(GameEvents.Player.RotationDirectionUpdated, direction);
}

function useGame(serverUrl: string) {
  if (socket?.io?.uri != serverUrl) {
    socket?.disconnect();
    socket = socketIOClient(serverUrl);
    socket.on(GameEvents.Player.Created, (player: PlayerDTO) => {
      activePlayerId.set(player.id);
    });

    socket.on(GameEvents.Game.Updated, (gameDTO: GameDTO) => {
      game.set(gameDTO);
    });
  }

  return {
    joinGame,
    leaveGame,
    updateFrontMoveDirection,
    updateSideMoveDirection,
    updateRotationDirection,
  };
}

export {
  activePlayerId,
  game,
  useGame,
  EntityKind,
  MovableDTO,
  MonsterDTO,
  PlayerDTO,
  GameDTO,
  WorldDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
};
