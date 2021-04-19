/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import socketIOClient from 'socket.io-client';
import { writable } from 'svelte/store';
import {
  CharacterKind,
  MonsterKind,
  PawnKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  WorldDTO,
  PawnDTO,
} from '@reapers/game-shared';

type UseGameResult = {
  joinGame: (playerName: string) => void;
  leaveGame: () => void;
  updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  updateSideMoveDirection: (direction: SideMoveDirection) => void;
  updateRotation: (rotationY: number) => void;
  castSpell: (targetId: string) => void;
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

  function castSpell(targetId: string): void {
    socket.emit(GameEvents.Player.SpellCasted, targetId);
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
    castSpell,
  };
}

export {
  activePlayerId,
  game,
  world,
  useGame,
  CharacterKind,
  MonsterKind,
  PawnKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  WorldDTO,
  PawnDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
};
