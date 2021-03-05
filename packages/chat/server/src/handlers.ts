import { Server, Socket } from 'socket.io';
import { ChatEvent, ChatRoom } from '@reapers/chat-shared';

export const registerChatHandlers = (io: Server, socket: Socket, playerName: string): void => {
  for (const room of Object.values(ChatRoom)) {
    socket.join(room);
  }

  socket.on(ChatEvent.System.Disconnect, (reason) => {
    console.info(`Connection closed: ${socket.id}, ${reason} (now ${io.sockets.sockets.size})`);
  });

  socket.on(ChatEvent.Message.Created, (room: ChatRoom, content = '') => {
    io.to(room).emit(ChatEvent.Message.Created, {
      sender: playerName,
      content,
    });
  });
};
