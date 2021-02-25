import 'reflect-metadata';
import SocketIO from 'socket.io';
import * as http from 'http';
import express from 'express';
import Game from './core/game';
import { registerSystemHandlers } from './handlers';
import config from './config';
import { PlayerEvent } from './constants';

const port = config.port;
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO.Server(httpServer, {
  cors: {
    origin: config.client.url,
    methods: ['GET', 'POST'],
  },
});
const game = new Game(io.sockets);
console.info('New game created', game.id);

io.on('connection', (socket: SocketIO.Socket) => {
  console.info(`New connection received: ${socket.id} (now ${io.sockets.sockets.size})`);

  socket.on(PlayerEvent.Joined, (name: string) => {
    try {
      const player = game.addPlayer(socket.id, name);

      registerSystemHandlers(socket, player);

      if (game.isFull) {
        game.startGameLoop();
      }
    } catch (e) {
      console.error(e);
    }
  });
});

httpServer.listen(port, () => console.info(`Application is listening on port ${port}`));
