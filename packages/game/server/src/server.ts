/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as xhr2 from 'xhr2';
import * as http from 'http';
import SocketIO from 'socket.io';
import express from 'express';
import { registerPlayerHandlers, registerSystemHandlers } from './handlers';
import config from './config';
import { GameEvents, plainToClass, CharacterDTO, WorldDTO } from '@reapers/game-shared';
import Game from './core/game';

global.XMLHttpRequest = xhr2.XMLHttpRequest;

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

app.use('/public', express.static('public'));

io.on(GameEvents.System.Connection, (socket: SocketIO.Socket) => {
  if (io.sockets.sockets.size < config.game.nbMaxPlayers && !game.isFull) {
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
        socket.emit(
          GameEvents.Game.Created,
          plainToClass(WorldDTO, game.world, {
            strategy: 'excludeAll',
            excludeExtraneousValues: true,
          }),
        );
      } catch (e) {
        console.error(e);
      }
    });
  } else {
    console.warn(`Already ${io.sockets.sockets.size} on ${config.game.nbMaxPlayers}`);
    socket.disconnect();
  }
});

httpServer.listen(port, () => console.info(`Application is listening on port ${port}`));
