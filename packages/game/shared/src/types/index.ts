// Reserved names, do not change
enum SystemEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
}

enum PlayerEvent {
  Created = 'PlayerEvent.Created',
  Deleted = 'PlayerEvent.Deleted',
  Joined = 'PlayerEvent.Joined',
  FrontMoveDirectionUpdated = 'PlayerEvent.FrontMoveDirectionUpdated',
  SideMoveDirectionUpdated = 'PlayerEvent.SideMoveDirectionUpdated',
  RotationDirectionUpdated = 'PlayerEvent.RotationDirectionUpdated',
}

enum GameEvent {
  Created = 'GameEvent.Created',
  Updated = 'GameEvent.Updated',
  Stopped = 'GameEvent.Stopped',
}

export const GameEvents = {
  Game: GameEvent,
  Player: PlayerEvent,
  System: SystemEvent,
};

export enum RotationDirection {
  None,
  Left,
  Right,
}

export enum FrontMoveDirection {
  None,
  Forward,
  Backward,
}

export enum SideMoveDirection {
  None,
  Left,
  Right,
}

export enum EntityKind {
  Unknown = 'Unknown',
  Player = 'Player',
  Spider = 'Spider',
  Nest = 'Nest',
}
