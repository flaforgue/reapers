enum PlayerEvent {
  Created = 'PlayerEvent.Created',
  Deleted = 'PlayerEvent.Deleted',
  Joined = 'PlayerEvent.Joined',
}

enum SocketEvent {
  Disconnected = 'disconnect', // must match socket-io 'disconnect' event name
}

enum GameEvent {
  Updated = 'GameEvent.Updated',
  Stopped = 'GameEvent.Stopped',
}

export { GameEvent, PlayerEvent, SocketEvent };
