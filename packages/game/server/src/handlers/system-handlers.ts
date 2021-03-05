import { Socket } from 'socket.io';
import { PlayerEvent, PlayerDTO, SystemEvent, plainToClass } from '@reapers/game-shared';
import { Game, Player } from '../core';

export default (socket: Socket, player: Player, game: Game): void => {
  socket.on(SystemEvent.Disconnect, (reason) => {
    console.info(`Player disconnected: ${reason}`);
    game.removePlayer(player.id);
    socket.broadcast.emit(PlayerEvent.Deleted, plainToClass(PlayerDTO, player));
  });
};
