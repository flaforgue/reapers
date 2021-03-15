import { Socket } from 'socket.io';
import { GameEvents, PlayerDTO, plainToClass } from '@reapers/game-shared';
import { GameEntity, PlayerEntity } from '../../entities';

export default (socket: Socket, player: PlayerEntity, game: GameEntity) => {
  socket.on(GameEvents.System.Disconnect, (reason) => {
    console.info(`Player disconnected: ${reason}`);
    game.removePlayer(player.id);
    socket.broadcast.emit(GameEvents.Player.Deleted, plainToClass(PlayerDTO, player));
  });
};
