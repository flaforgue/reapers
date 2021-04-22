import { Socket } from 'socket.io';
import { GameEvents, SideMoveDirection, FrontMoveDirection } from '@reapers/game-shared';
import Game from '../core/game';
import Player from '../core/player';

function isValidFrontMoveDirection(direction: unknown): boolean {
  return Boolean(FrontMoveDirection[Number(direction)]);
}

function isValidSideMoveDirection(direction: unknown): boolean {
  return Boolean(SideMoveDirection[Number(direction)]);
}

export default (socket: Socket, game: Game, player: Player): void => {
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

  socket.on(GameEvents.Player.AttackLoaded, (id: string) => {
    if (player.canMove) {
      const target = game.getCharacterById(id);

      if (target) {
        player.attackIfInRange(target);
      }
    }
  });

  socket.on(GameEvents.Player.AttackPerformed, () => {
    if (player.isLoadingAttack) {
      player.performAttack();
    }
  });

  socket.on(GameEvents.Player.AttackCancelled, () => {
    if (player.isLoadingAttack) {
      player.cancelAttack();
    }
  });
};
