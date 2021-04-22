/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import socketIOClient from 'socket.io-client';
import { writable } from 'svelte/store';
import {
  AttackState,
  CharacterKind,
  MonsterKind,
  PawnKind,
  FrontMoveDirection,
  SideMoveDirection,
  GameEvents,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  WorldDTO,
  PawnDTO,
} from '@reapers/game-shared';

type UseGameResult = {
  joinGame: (playerName: string) => void;
  leaveGame: () => void;
  updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  updateSideMoveDirection: (direction: SideMoveDirection) => void;
  updateRotation: (rotationY: number) => void;
  loadAttack: (targetId: string) => void;
  performAttack: () => void;
  cancelAttack: () => void;
};

const activePlayerId = writable<string>('');
const game = writable<GameDTO>(new GameDTO());
const world = writable<WorldDTO>(new WorldDTO());

function useGame(serverUrl: string): UseGameResult {
  const socket = socketIOClient(serverUrl);

  function joinGame(playerName: string): void {
    socket.emit(GameEvents.Player.Joined, playerName);
  }

  function leaveGame(): void {
    socket.disconnect();
  }

  function updateFrontMoveDirection(direction: FrontMoveDirection): void {
    socket.emit(GameEvents.Player.FrontMoveDirectionUpdated, direction);
  }

  function updateSideMoveDirection(direction: SideMoveDirection): void {
    socket.emit(GameEvents.Player.SideMoveDirectionUpdated, direction);
  }

  function updateRotation(rotationY: number): void {
    socket.emit(GameEvents.Player.RotationUpdated, rotationY);
  }

  function loadAttack(targetId: string): void {
    socket.emit(GameEvents.Player.AttackLoaded, targetId);
  }

  function performAttack(): void {
    socket.emit(GameEvents.Player.AttackPerformed);
  }

  function cancelAttack(): void {
    socket.emit(GameEvents.Player.AttackCancelled);
  }

  socket.on(GameEvents.Player.Created, (player: CharacterDTO) => {
    activePlayerId.set(player.id);
  });

  socket.on(GameEvents.Game.Created, (worldDTO: WorldDTO) => {
    world.set(worldDTO);
  });

  socket.on(GameEvents.Game.Updated, (gameDTO: GameDTO) => {
    game.set(gameDTO);
  });

  return {
    joinGame,
    leaveGame,
    updateFrontMoveDirection,
    updateSideMoveDirection,
    updateRotation,
    loadAttack,
    performAttack,
    cancelAttack,
  };
}

export {
  activePlayerId,
  game,
  world,
  useGame,
  AttackState,
  CharacterKind,
  MonsterKind,
  PawnKind,
  FrontMoveDirection,
  SideMoveDirection,
  GameEvents,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  WorldDTO,
  PawnDTO,
};
