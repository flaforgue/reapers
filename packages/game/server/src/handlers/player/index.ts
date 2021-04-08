import { Socket } from 'socket.io';
import {
  GameEvents,
  SideMoveDirection,
  FrontMoveDirection,
  RotationDirection,
} from '@reapers/game-shared';
import { GameEntity, PlayerEntity } from '../../entities';

function isValidFrontMoveDirection(direction: unknown) {
  return Boolean(FrontMoveDirection[Number(direction)]);
}

function isValidSideMoveDirection(direction: unknown) {
  return Boolean(SideMoveDirection[Number(direction)]);
}

function isValidRotationDirection(direction: unknown) {
  return Boolean(RotationDirection[Number(direction)]);
}

export default (socket: Socket, game: GameEntity, player: PlayerEntity) => {
  socket.on(
    GameEvents.Player.FrontMoveDirectionUpdated,
    (direction: FrontMoveDirection) => {
      if (isValidFrontMoveDirection(direction)) {
        player.frontMoveDirection = direction;
      }
    },
  );

  socket.on(
    GameEvents.Player.SideMoveDirectionUpdated,
    (direction: SideMoveDirection) => {
      if (isValidSideMoveDirection(direction)) {
        player.sideMoveDirection = direction;
      }
    },
  );

  socket.on(
    GameEvents.Player.RotationDirectionUpdated,
    (direction: RotationDirection) => {
      if (isValidRotationDirection(direction)) {
        player.rotationDirection = direction;
      }
    },
  );

  socket.on(GameEvents.Player.SpellCasted, (id: string) => {
    const target = game.findCharacterById(id);
    if (target) {
      player.attackIfInRange(target);
    }
  });
};
