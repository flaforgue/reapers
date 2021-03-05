import SocketIO from 'socket.io';
import * as http from 'http';
import express from 'express';
import Game from './core/game';
import { registerSystemHandlers } from './handlers';
import config from './config';
import { GameDTO, GameEvent, plainToClass, PlayerEvent, SystemEvent } from '@reapers/game-shared';

const port = config.port;
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO.Server(httpServer, {
  cors: {
    origin: config.web.url,
    methods: ['GET', 'POST'],
  },
});
const game = new Game(io.sockets);
console.info('New game created', game.id);

io.on(SystemEvent.Connection, (socket: SocketIO.Socket) => {
  if (io.sockets.sockets.size < config.nbMaxPlayers && game.players.length < config.nbMaxPlayers) {
    console.info(`New connection: ${socket.id} (now ${io.sockets.sockets.size})`);

    socket.once(PlayerEvent.Joined, (name: string) => {
      try {
        const player = game.addPlayer(socket.id, name);
        registerSystemHandlers(socket, player, game);
        socket.emit(GameEvent.Created, plainToClass(GameDTO, game));
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
