import { ChatEvent, ChatMessage, ChatRoom } from '@reapers/chat-shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const nbMaxMessages = 100 * -1; // negative to be used in slice()

type UseChatHook = {
  messages: ChatMessage[];
  sendMessage: (room: ChatRoom, content: string) => void;
  joinChat: (name: string) => void;
};

const useChat = (serverUrl: string): UseChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<SocketIOClient.Socket>();

  useEffect(() => {
    socketRef.current = socketIOClient(serverUrl);
    socketRef.current.on(ChatEvent.Message.Created, (message: ChatMessage) => {
      setMessages((messages: ChatMessage[]) => [...messages.slice(nbMaxMessages), message]);
    });

    return (): void => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (room: ChatRoom, content: string): void => {
    socketRef.current?.emit(ChatEvent.Message.Created, room, content);
  };

  const joinChat = useCallback(
    (name: string): void => {
      socketRef.current?.emit(ChatEvent.Member.Created, name);
    },
    [socketRef.current],
  );

  return { joinChat, messages, sendMessage };
};

export { useChat, ChatRoom };
