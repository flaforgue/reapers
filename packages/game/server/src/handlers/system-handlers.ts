import { plainToClass } from 'class-transformer';
import { Socket } from 'socket.io';
import { PlayerEvent, SocketEvent } from '../constants';
import { Player } from '../core';
import { PlayerSerializer } from '../serializers';

export default (socket: Socket, player: Player): void => {
  socket.on(SocketEvent.Disconnected, (reason) => {
    console.info(`Player disconnected: ${reason}`);
    player.game.removePlayer(player.id);
    socket.broadcast.emit(PlayerEvent.Deleted, plainToClass(PlayerSerializer, player));
  });
};
