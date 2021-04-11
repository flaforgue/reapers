import SocketIO from 'socket.io';
import * as http from 'http';
import express from 'express';
import { registerPlayerHandlers, registerSystemHandlers } from './handlers';
import config from './config';
import { GameEvents, plainToClass, CharacterDTO } from '@reapers/game-shared';
import { GameEntity } from './entities';

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

const port = config.port;
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO.Server(httpServer, {
  cors: {
    origin: config.web.url,
    methods: ['GET', 'POST'],
  },
});
const game = new GameEntity(io.sockets);
console.info('New game created', game.id);

io.on(GameEvents.System.Connection, (socket: SocketIO.Socket) => {
  if (
    io.sockets.sockets.size < config.nbMaxPlayers &&
    game.players.length < config.nbMaxPlayers
  ) {
    console.info(`New connection: ${socket.id} (now ${io.sockets.sockets.size})`);

    socket.once(GameEvents.Player.Joined, (name: string) => {
      try {
        const player = game.addPlayer(socket, name);

        registerSystemHandlers(socket, player, game);
        registerPlayerHandlers(socket, game, player);

        socket.emit(
          GameEvents.Player.Created,
          plainToClass(CharacterDTO, player, {
            strategy: 'excludeAll',
            excludeExtraneousValues: true,
          }),
        );
      } catch (e) {
        console.error(e);
      }
    });
  } else {
    console.warn(`Already ${io.sockets.sockets.size} on ${config.nbMaxPlayers}`);
    socket.disconnect();
  }
});

httpServer.listen(port, () => console.info(`Application is listening on port ${port}`));
