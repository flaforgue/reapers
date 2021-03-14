import socketIOClient from 'socket.io-client';
import { ChatEvents, ChatMessage, ChatRoom } from '@reapers/chat-shared';
import { writable } from 'svelte/store';

const nbMaxMessages = 100 * -1; // negative to be used in slice()
const messages = writable<ChatMessage[]>([]);

let socket: SocketIOClient.Socket | undefined;

function joinChat(userName: string) {
  socket?.emit(ChatEvents.Member.Created, userName);
}

function leaveChat() {
  socket?.disconnect();
}

function sendMessage(room: ChatRoom, content: string) {
  socket?.emit(ChatEvents.Message.Created, room, content);
}

function useChat(serverUrl: string) {
  if (socket?.io?.uri != serverUrl) {
    socket?.disconnect();
    socket = socketIOClient(serverUrl);
    socket?.on(ChatEvents.Message.Created, (message: ChatMessage) => {
      messages.update((messages: ChatMessage[]) => [
        ...messages.slice(nbMaxMessages),
        message,
      ]);
    });
  }

  return {
    joinChat,
    leaveChat,
    sendMessage,
  };
}

export { ChatRoom, useChat, messages };
