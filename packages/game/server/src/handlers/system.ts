import { Socket } from 'socket.io';
import { GameEvents, CharacterDTO, plainToClass } from '@reapers/game-shared';
import Game from '../core/game';
import Player from '../core/player';

export default (socket: Socket, player: Player, game: Game): void => {
  socket.on(GameEvents.System.Disconnect, (reason: string) => {
    console.info(`Player disconnected: ${reason}`);
    game.removePlayer(player);
    socket.broadcast.emit(
      GameEvents.Player.Deleted,
      plainToClass(CharacterDTO, player, {
        excludeExtraneousValues: true,
        strategy: 'excludeAll',
      }),
    );
  });
};
