import { Socket } from 'socket.io';
import { GameEvents, SideMoveDirection, FrontMoveDirection } from '@reapers/game-shared';
import { GameEntity, PlayerEntity } from '../../entities';
import charactersByIds from '../../globals/characters-by-ids';

function isValidFrontMoveDirection(direction: unknown) {
  return Boolean(FrontMoveDirection[Number(direction)]);
}

function isValidSideMoveDirection(direction: unknown) {
  return Boolean(SideMoveDirection[Number(direction)]);
}

export default (socket: Socket, game: GameEntity, player: PlayerEntity) => {
  socket.on(
    GameEvents.Player.FrontMoveDirectionUpdated,
    (direction: FrontMoveDirection) => {
      if (player.canMove && isValidFrontMoveDirection(direction)) {
        player.frontMoveDirection = direction;
      }
    },
  );

  socket.on(
    GameEvents.Player.SideMoveDirectionUpdated,
    (direction: SideMoveDirection) => {
      if (player.canMove && isValidSideMoveDirection(direction)) {
        player.sideMoveDirection = direction;
      }
    },
  );

  socket.on(GameEvents.Player.RotationUpdated, (rotationY: number) => {
    if (player.canMove) {
      player.setRotationY(rotationY);
    }
  });

  socket.on(GameEvents.Player.SpellCasted, (id: string) => {
    if (player.canMove) {
      const target = charactersByIds[id];

      if (target) {
        player.attackIfInRange(target);
      }
    }
  });
};
