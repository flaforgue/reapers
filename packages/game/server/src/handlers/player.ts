import { Socket } from 'socket.io';
import { GameEvents, SideMoveDirection, FrontMoveDirection } from '@reapers/game-shared';
import Game from '../core/game';
import Player from '../core/player';
import charactersByIds from '../globals/characters-by-ids';

function isValidFrontMoveDirection(direction: unknown) {
  return Boolean(FrontMoveDirection[Number(direction)]);
}

function isValidSideMoveDirection(direction: unknown) {
  return Boolean(SideMoveDirection[Number(direction)]);
}

export default (socket: Socket, game: Game, player: Player) => {
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
