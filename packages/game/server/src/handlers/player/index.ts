import { Socket } from 'socket.io';
import { GameEvents, MoveDirection, RotationDirection } from '@reapers/game-shared';
import { PlayerEntity } from '../../entities';

function isValidMoveDirection(direction: unknown) {
  return Boolean(MoveDirection[Number(direction)]);
}

function isValidRotationDirection(direction: unknown) {
  return Boolean(RotationDirection[Number(direction)]);
}

export default (socket: Socket, player: PlayerEntity) => {
  socket.on(GameEvents.Player.MoveDirectionUpdated, (direction: MoveDirection) => {
    if (isValidMoveDirection(direction)) {
      player.moveDirection = direction;
    }
  });

  socket.on(
    GameEvents.Player.RotationDirectionUpdated,
    (direction: RotationDirection) => {
      if (isValidRotationDirection(direction)) {
        player.rotationDirection = direction;
      }
    },
  );
};
