import socketIOClient from 'socket.io-client';
import { writable } from 'svelte/store';
import {
  CharacterKind,
  MonsterKind,
  PawnKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  MonsterDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  WorldDTO,
  PawnDTO,
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

function updateRotation(rotationY: number) {
  socket?.emit(GameEvents.Player.RotationUpdated, rotationY);
}

function castSpell(targetId: string) {
  socket?.emit(GameEvents.Player.SpellCasted, targetId);
}

function useGame(serverUrl: string) {
  if (socket?.io?.uri != serverUrl) {
    socket?.disconnect();
    socket = socketIOClient(serverUrl);
    socket.on(GameEvents.Player.Created, (player: CharacterDTO) => {
      activePlayerId.set(player.id);
    });

    socket.on(GameEvents.Game.Created, (gameDTO: GameDTO) => {
      game.set(gameDTO);
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
    updateRotation,
    castSpell,
  };
}

export {
  activePlayerId,
  game,
  useGame,
  CharacterKind,
  MonsterKind,
  PawnKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  MonsterDTO,
  GameDTO,
  WorldDTO,
  PawnDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
};
