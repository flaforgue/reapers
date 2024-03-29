// Reserved names, do not change
enum SystemEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
}

enum MessageEvent {
  Created = 'MessageEvent.Created',
}

enum MemberEvent {
  Created = 'MemberEvent.Created',
}

const ChatEvents = {
  Message: MessageEvent,
  Member: MemberEvent,
  System: SystemEvent,
};

enum ChatRoom {
  General = 'general',
  Trading = 'trading',
}

type ChatMessage = {
  content: string;
  sender: string;
};

export { ChatEvents, ChatRoom, ChatMessage };
