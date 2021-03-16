import { Server, Socket } from 'socket.io';
import { ChatEvents, ChatRoom } from '@reapers/chat-shared';

export function registerChatHandlers(io: Server, socket: Socket, playerName: string) {
  for (const room of Object.values(ChatRoom)) {
    socket.join(room);
  }

  socket.on(ChatEvents.System.Disconnect, (reason) => {
    console.info(
      `Connection closed: ${socket.id}, ${reason} (now ${io.sockets.sockets.size})`,
    );
  });

  socket.on(ChatEvents.Message.Created, (room: ChatRoom, content = '') => {
    io.to(room).emit(ChatEvents.Message.Created, {
      sender: playerName,
      content,
    });
  });
}
