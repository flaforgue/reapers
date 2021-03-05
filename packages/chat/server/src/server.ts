import SocketIO from 'socket.io';
import * as http from 'http';
import express from 'express';
import { registerChatHandlers } from './handlers';
import config from './config';
import { ChatEvent } from '@reapers/chat-shared';

const port = config.port;
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO.Server(httpServer, {
  cors: {
    origin: config.web.url,
    methods: ['GET', 'POST'],
  },
});

io.on(ChatEvent.System.Connection, (socket: SocketIO.Socket) => {
  if (io.sockets.sockets.size < config.nbMaxPlayers) {
    console.info(`New connection: ${socket.id} (now ${io.sockets.sockets.size})`);

    socket.once(ChatEvent.Member.Created, (name: string) => {
      console.info(`Member ${name} created`);
      registerChatHandlers(io, socket, name);
    });
  } else {
    console.warn(`Already ${io.sockets.sockets.size} on ${config.nbMaxPlayers}`);
    socket.disconnect();
  }
});

httpServer.listen(port, () => console.info(`Application is listening on port ${port}`));
